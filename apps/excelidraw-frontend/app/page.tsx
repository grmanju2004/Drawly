import { Pencil, Share2, Users2, Sparkles, MoveRight } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import Link from "next/link";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#d4d4d8 1px, transparent 1px)', 
             backgroundSize: '32px 32px' 
           }}>
      </div>

      <nav className="relative z-10 border-b border-zinc-200/60 bg-[#FDFCF8]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center shadow-sm">
               <Pencil className="w-5 h-5 text-[#FDFCF8]" />
            </div>
            <span className="font-serif text-3xl font-semibold tracking-tight">Drawly.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/signin" className="text-sm font-medium tracking-wide hover:text-zinc-500 transition-colors uppercase">
              Log in
            </Link>
            <Link href="/signup">
              <button className="h-12 px-8 rounded-full bg-zinc-900 text-[#FDFCF8] text-sm font-medium tracking-wide hover:bg-zinc-800 transition-all uppercase">
                Start drawing
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-200 bg-white/60 text-xs font-semibold tracking-widest text-zinc-600 uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Drawly Beta is live</span>
          </div>
          
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-tight text-zinc-900">
            The canvas for <br className="hidden md:block"/>
            <span className="italic text-zinc-500">clear thinking.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 font-light leading-relaxed">
            An elegant, collaborative whiteboarding tool designed to get out of your way. Sketch architectures, draft ideas, and build together in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/signup">
              <button className="group flex items-center gap-3 h-14 px-8 rounded-full bg-zinc-900 text-[#FDFCF8] text-base font-medium hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-900/10">
                Open Canvas
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/gallery">
              <button className="h-14 px-8 rounded-full border border-zinc-300 bg-white/50 text-base font-medium hover:bg-white hover:border-zinc-400 transition-all active:scale-95">
                Explore Gallery
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Minimalist Feature Grid */}
      <section className="relative z-10 border-t border-zinc-200/60 bg-white py-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-16">
            
            <div className="space-y-6 group">
              <div className="w-14 h-14 border border-zinc-200 flex items-center justify-center bg-[#FDFCF8] group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-3xl font-medium">Real-time sync.</h3>
              <p className="text-zinc-600 leading-relaxed font-light text-lg">
                Share a link and watch cursors dance across the screen. Collaboration happens instantly, no matter where you are.
              </p>
            </div>

            <div className="space-y-6 group">
              <div className="w-14 h-14 border border-zinc-200 flex items-center justify-center bg-[#FDFCF8] group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-3xl font-medium">Built for teams.</h3>
              <p className="text-zinc-600 leading-relaxed font-light text-lg">
                From engineering diagrams to product roadmaps, bring your entire team onto an infinite, shared canvas.
              </p>
            </div>

            <div className="space-y-6 group">
              <div className="w-14 h-14 border border-zinc-200 flex items-center justify-center bg-[#FDFCF8] group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                <Pencil className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-3xl font-medium">Fluid drawing.</h3>
              <p className="text-zinc-600 leading-relaxed font-light text-lg">
                A minimal interface that fades away. Smart shape recognition and perfectly tuned tools keep you in the flow.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200/60 bg-[#FDFCF8]">
        <div className="container mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-zinc-500 font-medium">
            © {new Date().getFullYear()} Drawly. 
          </p>
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <span className="sr-only">GitHub</span>
              <GithubIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}