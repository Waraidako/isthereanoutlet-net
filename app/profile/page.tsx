"use client"

// @ts-ignore
import {Session, signOut, useSession} from 'next-auth/react';
import {redirect} from "next/navigation";
import {useEffect, useState} from 'react';
import dynamic from "next/dynamic";

const UserPoint = dynamic(() => import('@/app/components/UserPoint'), {
    ssr: false,
});

type ExtendedSession = Session & {
    user: {
        id: number;
        role: string;
    }
};

export interface Point {
    id: number;
    name: string;
    description: string;
    type: 'has-outlets' | 'no-outlets';
    coordinates: string;
    photo: string;
    is_confirmed: boolean;
    date_added: string;
    last_edited: string;
    is_deleted: boolean;
    userId: number;
}

export default function Page() {
    const { data: session, status }  = useSession()
    const [ points, setPoints ] = useState<Point[]>([]);
    const [ pointsFetched, setPointsFetched ] = useState<boolean>(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/");
        }
    }, [status])

    useEffect(() => {
        async function fetchUserPoints() {
            const extendedSession = session as unknown as ExtendedSession;
            const req = await fetch(`/api/get-user-points?id=${extendedSession.user.id}`, {
                method: "GET",
            })
            const points = (await req.json()).points;
            setPoints(points);
            setPointsFetched(true);
        }

        if (status === 'authenticated') fetchUserPoints();
    }, [session, status])

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
            <div className="max-w-3/4 w-3/4 h-full wrap-break-word flex flex-col gap-2.5">
                <div className={'font-semibold text-2xl'}>Hello, { session!.user!.name }</div>
                <div>Your added points:</div>
                {
                    pointsFetched
                    ? points.map((point) => (
                        <UserPoint key={point.id} info={point} />
                    ))
                        : ''
                }
                <div className={'flex items-center pt-5 justify-center w-full pb-7'}>
                    <button className={'bg-red-500 w-1/2 align-bottom pt-2 pb-2 rounded-lg'}
                        onClick={() => signOut()}>
                                Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}