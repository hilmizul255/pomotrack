'use client';

import { signIn } from "next-auth/react";

export default function Register() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Register</h1>
            <button onClick={() => signIn('google')} className="bg-blue-500 text-white px-4 py-2 rounded">Register with Google</button>
            <p>Already have an account? <a href="/login" className="underline">Login</a></p>
        </div>
    );
}