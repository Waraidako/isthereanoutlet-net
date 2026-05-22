"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message"); // From registration success
    const error = searchParams.get("error");     // From NextAuth login failure

    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        await signIn("credentials", {
            nickname,
            password,
            callbackUrl: "/",
            redirect: true,
        });
    };

    return (
        <div className="flex justify-center items-center flex-col w-screen h-screen">
            <div className={'flex flex-col justify-center items-center pl-15 pr-15 pt-8 pb-8 backdrop-brightness-95 rounded-lg'}>
                <h1 className={'text-2xl mb-6'}>Sign In</h1>

                {/* Success Message Display */}
                {message && (
                    <div className="bg-green-100 text-green-700 p-2 rounded-lg mb-4 text-sm border border-green-200 text-center w-full">
                        {message}
                    </div>
                )}

                {/* Error Message Display */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded-lg mb-4 text-sm border border-red-200 text-center w-full">
                        {error === "CredentialsSignin"
                            ? "Invalid nickname or password"
                            : "An error occurred during sign in"}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={'flex flex-col'}>
                    <input
                        className={'border-2 border-gray-300 rounded-lg p-[6px] mb-2'}
                        type="text"
                        placeholder="nickname"
                        required
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <input
                        className={'border-2 border-gray-300 rounded-lg p-[6px] mb-4'}
                        type="password"
                        placeholder="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className={'w-full text-center button-6'}>Login</button>
                </form>

                <div className={'mt-5'}>
                    Don't have an account?
                    <Link href="/auth/register">
                        <div className={'text-blue-500 text-center'}>Register here</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
