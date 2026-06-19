Drawly 🎨


Drawly is a high-performance, real-time collaborative whiteboard application designed for teams to brainstorm and visualize ideas together. Built with a modern tech stack, it provides a seamless, "Excalidraw-like" experience with persistent storage and multi-user synchronization.

🚀 Key Features

Real-Time Collaboration: Powered by WebSockets for instant synchronization across multiple users.

Persistent Storage: Drawings are saved to a PostgreSQL database, ensuring your work survives page refreshes.

Rich Toolset: Features include Pencil, Rectangle, Circle, Text, and Eraser tools.

Smart Routing: Uses URL Slugs for shareable, human-readable workspace links.

Responsive UI: A clean, intuitive "Build in Public" aesthetic using TailwindCSS and Lucide React.

Full-Stack Integrity: End-to-end type safety using TypeScript.

🛠 Tech Stack

Frontend: Next.js 16 (App Router), TailwindCSS, Lucide React

Backend (API): Node.js, Express, Prisma ORM

Real-Time: WebSockets (ws)

Database: PostgreSQL (Neon)

Deployment & Tools: Turbopack, pnpm (Monorepo)

📋 Architecture

The application is structured as a monorepo for efficient code sharing:

apps/excelidraw-frontend: The collaborative canvas and dashboard interface.

apps/http-backend: REST API for room management, authentication, and history fetching.

apps/ws-backend: WebSocket server for real-time shape broadcasting and database persistence.

packages/db: Shared Prisma schema and database client.

⚙️ Getting Started

Prerequisites
pnpm installed.

A Neon PostgreSQL database URL.

Installation

1. Clone the repository:

Bash

git clone <your-repo-url>
cd Drawly

2. Install dependencies:

Bash

pnpm install

3. Set up environment variables in apps/http-backend/.env and apps/ws-backend/.env:

Code snippet

DATABASE_URL="your_neon_db_connection_string"
JWT_SECRET="your_secret_key"

4. Run the development environment:

Bash

pnpm run dev

💡 How to Use

1. Create: Log in and create a new canvas from the Dashboard.

2. Share: Copy the room slug from the URL bar and share it with your team.

3. Collaborate: Everyone in the room sees updates in real-time. Drawings are automatically saved to the database.

4. Manage: Use the toolbar to switch tools, erase shapes, or clear the entire canvas.

🏗 Future Enhancements
[ ] Color picker for different stroke/fill colors.

[ ] Adjustable brush/stroke thickness.

[ ] Download canvas as PNG/SVG.

[ ] User authentication roles (View-only vs. Edit).

Made with ❤️
Built as a final-year engineering project to master full-stack development, WebSockets, and real-time state synchronization.