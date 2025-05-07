"use client"

import dynamic from "next/dynamic";

const MapDisplay = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
    return (
        <div className="font-montserrat">
            <MapDisplay />
        </div>
  );
}
