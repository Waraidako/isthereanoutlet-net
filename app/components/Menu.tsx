"use client"

import dynamic from "next/dynamic";

const BurgerMenu = dynamic(() => import('./BurgerMenu'), {
    ssr: false,
});

export default function Menu() {
    return <BurgerMenu />;
}