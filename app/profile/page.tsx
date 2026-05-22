"use client"

import { signOut, useSession } from 'next-auth/react';
import {redirect} from "next/navigation";
import { useEffect } from 'react';

export default function Page() {
    const { data: session, status }  = useSession()

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/");
        }
    }, [status])

    if (status === 'loading') {
        return (
            <div className="flex w-screen justify-center items-center text-xl font-montserrat pt-7 text-center">
                <div className="max-w-3/4">Checking login info...</div>
            </div>
        )
    }

    if (!session) {
        redirect('/');
    }

    return (
        <div className="flex flex-col w-screen h-screen justify-center items-center text-xl font-montserrat pt-7 text-center">
            <div className="max-w-3/4 w-3/4 h-full wrap-break-word">
                <div>Hello, { session!.user!.name }</div>
                <button className={'bg-red-500 align-bottom pt-2 pb-2 w-full rounded-lg'}
                    onClick={() => signOut()}>
                            Sign Out
                </button>
            </div>
        </div>
    )
}