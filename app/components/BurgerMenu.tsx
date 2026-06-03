"use client"

import { slide as Menu } from 'react-burger-menu';
import React from "react";
import { HamburgerSVG } from './HamburgerSVG';
import {signIn, signOut, useSession} from 'next-auth/react';

const styles = {
    bmBurgerButton: {
        position: 'fixed',
        scale: '100%',
        width: '64px',
        height: '64px',
        left: '10px',
        top: '10px'
    },
    bmBurgerBars: {
        background: '#373a47'
    },
    bmBurgerBarsHover: {
        background: '#a90000'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenuWrap: {
        position: 'fixed',
        height: '100%'
    },
    bmMenu: {
        background: '#ededed',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#1c1c1c',
        padding: '0.8em'
    },
    bmItem: {
        display: 'inline-block'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}

export const LoginButton = () => {
    const { data: session, status }  = useSession()
    if (status === 'loading') return <div className="absolute bottom-21" />

    if (session) return <div className="absolute bottom-21"><a href="/profile">Profile</a></div>

    return <div className="absolute bottom-21"><button onClick={() => signIn()}><a>Sign in / Register</a></button></div>
}

export default function BurgerMenu() {
    const { data: session, status }  = useSession();

    return (
        <Menu styles = { styles } className="flex-col h-full font-montserrat" customBurgerIcon={ <HamburgerSVG /> }>
            <div className="flex h-full flex-col ">
                <div className="mb-4 w-full"><a href="/">Main Map</a></div>
                <div className="mb-4 w-full"><a href="/bug" className="mb-4 w-full">Report Bug</a></div>
                <div className="mb-4 w-full"><a href="/credits">Credits</a></div>
                {/*<div className="mb-4 w-full"><a href="/piss">Color Theme</a></div>*/}
                <LoginButton />
                {
                    status === 'authenticated'
                    ? <div className={'absolute bottom-12'}><button onClick={() => signOut()}>Log out</button></div>
                    : ''
                }
            </div>
        </Menu>
    )
}