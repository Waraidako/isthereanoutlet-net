"use client"

import dynamic from "next/dynamic";
import { slide as Menu } from 'react-burger-menu';

const MapDisplay = dynamic(() => import("./components/Map"), { ssr: false });

// Below are hamburger menu styles. They're here instead of the CSS file for better readability
const styles = {
    bmBurgerButton: {
        position: 'fixed',
        scale: '90%',
        width: '36px',
        height: '30px',
        left: '17px',
        top: '17px'
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

export default function Home() {
    return (
        <div className="font-montserrat">
            <Menu styles = { styles } className="flex-col h-full">
                <a href="/piss" className="mb-4 w-full">PISS BUTTON</a>
                <a href="/piss" className="mb-4 w-full">PISS BUTTON</a>
                <a href="/piss" className="mb-4 w-full">PISS BUTTON</a>
                <a href="/piss" className="mb-4 w-full">PISS BUTTON</a>
            </Menu>
            <MapDisplay />
        </div>
  );
}
