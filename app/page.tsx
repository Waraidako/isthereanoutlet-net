"use client"

import dynamic from "next/dynamic";
import { slide as Menu } from 'react-burger-menu';

const MapDisplay = dynamic(() => import("./components/Map"), { ssr: false });

// Below are hamburger menu styles. They're here instead of the CSS file for better readability
const styles = {
    bmBurgerButton: {
        position: 'fixed',
        width: '36px',
        height: '30px',
        left: '36px',
        top: '36px'
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
        background: '#373a47',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
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
            <Menu styles = { styles }>
                <a href="/piss">Piss button 1</a>
                <a href="/piss">Piss button 2</a>
                <a href="/piss">Piss button 3</a>
                <a href="/piss">Piss button 4</a>
            </Menu>
            <MapDisplay />
        </div>
  );
}
