import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "text";
    text: string;
    x: number;
    y: number;
};

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "pencil";
    private isTyping: boolean = false; // Add state to track if we are currently typing
    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type == "chat") {
                const parsedData = JSON.parse(message.message);
                
                if (parsedData.type === "clear") {
                    this.existingShapes = [];
                    this.clearCanvas();
                } else if (parsedData.shape) {
                    this.existingShapes.push(parsedData.shape);
                    this.clearCanvas();
                }
            }
        };
    }

    public clearAll() {
        this.existingShapes = [];
        this.clearCanvas();
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ type: "clear" }),
            roomId: this.roomId
        }));
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.fillStyle = "rgba(255, 255, 255)"; 
        this.ctx.lineWidth = 2;

        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.beginPath();
                this.ctx.rect(shape.x, shape.y, shape.width, shape.height);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "text") {
                // Update font to a handwritten whiteboard style
                this.ctx.font = "24px 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(shape.text, shape.x, shape.y);
            }
        });
    }

    mouseDownHandler = (e: MouseEvent) => {
        if (this.isTyping) return; // Prevent drawing if we are currently typing text
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.clicked || this.isTyping) return;

        if (this.selectedTool === "pencil") {
            const shape: Shape = {
                type: "pencil",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY
            };
            this.existingShapes.push(shape);
            
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId: this.roomId
            }));

            this.startX = e.clientX;
            this.startY = e.clientY;
            this.clearCanvas();
        } else if (this.selectedTool === "rect" || this.selectedTool === "circle") {
            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; 
            this.ctx.beginPath();
            
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            if (this.selectedTool === "rect") {
                this.ctx.rect(this.startX, this.startY, width, height);
            } else if (this.selectedTool === "circle") {
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            }
            this.ctx.stroke();
            this.ctx.closePath();
        }
    };

    mouseUpHandler = (e: MouseEvent) => {
        if (this.isTyping) return; 
        this.clicked = false;
        
        if (this.selectedTool === "pencil") return; 

        const clickX = e.clientX;
        const clickY = e.clientY;

        // --- NEW INLINE TEXT EDITOR ---
        if (this.selectedTool === "text") {
            this.isTyping = true;
            
            // 1. Create a temporary HTML input perfectly aligned with the mouse click
            const input = document.createElement("input");
            input.type = "text";
            input.style.position = "absolute";
            input.style.left = `${clickX}px`;
            // Adjust Y slightly so the text baseline matches where the user clicked
            input.style.top = `${clickY - 12}px`; 
            input.style.background = "transparent";
            input.style.color = "white";
            input.style.font = "24px 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif";
            input.style.border = "1px dashed rgba(255,255,255,0.5)";
            input.style.outline = "none";
            input.style.padding = "0";
            input.style.margin = "0";
            input.style.zIndex = "1000";
            input.style.minWidth = "200px";

            const container = this.canvas.parentElement;
            if (container) {
                container.appendChild(input);
                setTimeout(() => input.focus(), 0); // Focus it immediately

                // 2. Logic to save the text when user is done
                const finishTyping = () => {
                    if (!this.isTyping) return;
                    this.isTyping = false;
                    const text = input.value.trim();
                    
                    if (text) {
                        const shape: Shape = {
                            type: "text",
                            x: clickX,
                            y: clickY,
                            text: text
                        };
                        this.existingShapes.push(shape);
                        this.socket.send(JSON.stringify({
                            type: "chat",
                            message: JSON.stringify({ shape }),
                            roomId: this.roomId
                        }));
                        this.clearCanvas();
                    }
                    input.remove(); // Delete the HTML element
                };

                // 3. Listeners for Enter, Escape, or clicking away (blur)
                input.addEventListener("blur", finishTyping);
                input.addEventListener("keydown", (ev) => {
                    if (ev.key === "Enter") {
                        finishTyping();
                    } else if (ev.key === "Escape") {
                        this.isTyping = false;
                        input.remove(); // Just cancel without saving
                    }
                });
            }
            return;
        }

        // --- ERASER TOOL LOGIC ---
        if (this.selectedTool === "eraser") {
            const initialLength = this.existingShapes.length;

            this.existingShapes = this.existingShapes.filter(shape => {
                if (shape.type === "rect") {
                    const minX = Math.min(shape.x, shape.x + shape.width);
                    const maxX = Math.max(shape.x, shape.x + shape.width);
                    const minY = Math.min(shape.y, shape.y + shape.height);
                    const maxY = Math.max(shape.y, shape.y + shape.height);
                    return !(clickX >= minX && clickX <= maxX && clickY >= minY && clickY <= maxY);
                }
                if (shape.type === "circle") {
                    const distance = Math.sqrt((clickX - shape.centerX) ** 2 + (clickY - shape.centerY) ** 2);
                    return distance > shape.radius;
                }
                if (shape.type === "text") {
                    return !(clickX >= shape.x && clickX <= shape.x + 100 && clickY >= shape.y - 24 && clickY <= shape.y + 24);
                }
                return true; 
            });

            if (this.existingShapes.length !== initialLength) {
                this.socket.send(JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({ type: "clear" }),
                    roomId: this.roomId
                }));
                
                this.existingShapes.forEach(shape => {
                    this.socket.send(JSON.stringify({
                        type: "chat",
                        message: JSON.stringify({ shape }),
                        roomId: this.roomId
                    }));
                });
            }
            this.clearCanvas();
            return;
        }

        // --- RECTANGLE & CIRCLE LOGIC ---
        const width = clickX - this.startX;
        const height = clickY - this.startY;
        let shape: Shape | null = null;

        if (this.selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height
            };
        } else if (this.selectedTool === "circle") {
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + width / 2,
                centerY: this.startY + height / 2,
            };
        }

        if (shape) {
            this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId: this.roomId
            }));
            this.clearCanvas();
        }
    };

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);    
    }
}