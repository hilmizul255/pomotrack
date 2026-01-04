'use client';

import { signIn } from "next-auth/react";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Log In</h1>
            <button onClick={() => signIn('google')} className="bg-blue-500 text-white px-4 py-2 rounded">Log In with Google</button>
            <p>Don't have an account? <a href="/register" className="underline">Register</a></p>
        </div>
    );
}