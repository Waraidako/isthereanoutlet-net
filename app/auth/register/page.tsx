"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");

    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const handleRegister = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLocalError("");

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname, password }),
        });

        if (res.ok) {
            // Redirect to login with a success message in the URL
            router.push("/auth/login?message=Account created! Please sign in.");
        } else {
            const data = await res.json();
            setLocalError(data.message || "Registration failed");
        }
    };

    return (
        <div className="flex justify-center items-center flex-col w-screen h-screen">
            <div className={'flex flex-col justify-center items-center pl-15 pr-15 pt-8 pb-8 backdrop-brightness-95 rounded-lg'}>
                <h1 className={'text-2xl mb-6'}>Create Account</h1>

                {/* Error Display */}
                {(localError || errorParam) && (
                    <div className="bg-red-100 text-red-700 p-2 rounded-lg mb-4 text-sm border border-red-200 text-center w-full">
                        {localError || errorParam}
                    </div>
                )}

                <form onSubmit={handleRegister} className={'flex flex-col'}>
                    <input
                        className={'border-2 border-gray-300 rounded-lg p-[6px] mb-2'}
                        type="text"
                        placeholder="choose a nickname"
                        required
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <input
                        className={'border-2 border-gray-300 rounded-lg p-[6px] mb-4'}
                        type="password"
                        placeholder="choose a password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className={'w-full text-center button-6'}>Register</button>
                </form>

                <div className={'mt-5'}>
                    Already have an account?
                    <Link href="/auth/login">
                        <div className={'text-blue-500 text-center'}>Sign in here</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
