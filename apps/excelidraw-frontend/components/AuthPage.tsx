"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Make sure this points to your Express server, NOT Next.js
const BACKEND_URL = "http://localhost:3001"; 

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // Needed for signup
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const endpoint = isSignin ? "/signin" : "/signup";
            
            // Your backend types.ts expects 'username', 'password', and (for signup) 'name'
            const payload = isSignin 
                ? { username: email, password }
                : { username: email, password, name: name || email.split("@")[0] };

            const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload);

            if (isSignin) {
                // 1. Save the JWT token
                localStorage.setItem("token", response.data.token);
                // 2. Redirect to the canvas
                router.push("/dashboard"); // Update this path to wherever your canvas lives
            } else {
                // If signup is successful, take them to the login page
                router.push("/signin");
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            // Grab the specific error message sent from your Express backend
            setError(err.response?.data?.error || "An error occurred. Make sure your backend is running on port 3001.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FDFCF8] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-200">
                
                {/* Header */}
                <div>
                    <h2 className="mt-2 text-center text-4xl font-serif font-medium tracking-tight text-zinc-900">
                        {isSignin ? "Welcome back." : "Join Drawly."}
                    </h2>
                    <p className="mt-3 text-center text-sm text-zinc-500">
                        {isSignin ? "Don't have an account? " : "Already have an account? "}
                        <Link
                            href={isSignin ? "/signup" : "/signin"}
                            className="font-medium text-zinc-900 hover:text-zinc-600 transition-colors underline decoration-zinc-300 underline-offset-4"
                        >
                            {isSignin ? "Sign up for free" : "Sign in instead"}
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Error Message Display */}
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {!isSignin && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        type="text"
                                        required={!isSignin}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full rounded-lg border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-lg bg-zinc-900 px-4 py-3.5 text-sm font-medium text-[#FDFCF8] shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : (isSignin ? "Sign In" : "Create Account")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}