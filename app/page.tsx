"use client"

import dynamic from "next/dynamic";

const MapDisplay = dynamic(() => import("./components/Map"), { ssr: false });

// Below are hamburger menu styles. They're here instead of the CSS file for better readability


export default function Home() {
    return (
        <div className="font-montserrat">

            <MapDisplay />
        </div>
  );
}
