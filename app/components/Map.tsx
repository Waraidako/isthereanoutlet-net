"use client"

import { useEffect, useRef } from "react";
import L, {Map, PointExpression} from 'leaflet';
import "leaflet/dist/leaflet.css";
import "../../public/images/icons/no-outlets-confirmed.png";
import 'leaflet-doubletapdrag';
import 'leaflet-doubletapdragzoom';
import { placeMarker } from "@/app/utils/mapHandler";

const iconSize: PointExpression = [48, 48];
const iconAnchor: PointExpression = [24, 45];
const popupAnchor: PointExpression = [0, -45];

const noOutletsConfirmedIcon = L.icon({
    iconUrl: "/images/icons/no-outlets-confirmed.png",

    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
});

const noOutletsNotConfirmedIcon = L.icon({
    iconUrl: "/images/icons/no-outlets-not-confirmed.png",

    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
});

const hasOutletsConfirmedIcon = L.icon({
    iconUrl: "/images/icons/has-outlets-confirmed.png",

    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
});

const hasOutletsNotConfirmedIcon = L.icon({
    iconUrl: "/images/icons/has-outlets-not-confirmed.png",

    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
});

export default function MapDisplay() {
    const mapProt = useRef(null);
    const map = useRef<Map | null>(null);

    useEffect(() => {
        if (mapProt.current && !map.current) {
            map.current = L.map(mapProt.current, {
                // @ts-expect-error: doubleTapDragZoom is very much there but for some reason is unrecognized
                doubleTapDragZoom: 'center',
                doubleTapDragZoomOptions: {
                    reverse: true,
                },
                zoomSnap: 0.01,
                zoomControl: false,
            })
            .setView([55.751934, 37.618346], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map.current);
            const info1 = JSON.stringify({ name: "Place #1" });
            const info2 = JSON.stringify({ name: "Place #2" });
            const info3 = JSON.stringify({ name: "Place #3" });
            const info4 = JSON.stringify({ name: "Place #4" });
            placeMarker(map.current, [55.751934, 37.618346], hasOutletsNotConfirmedIcon, info1);
            placeMarker(map.current, [55.752934, 37.619346], hasOutletsConfirmedIcon, info2);
            placeMarker(map.current, [55.752834, 37.618446], noOutletsConfirmedIcon, info3);
            placeMarker(map.current, [55.753934, 37.618556], noOutletsNotConfirmedIcon, info4);
        }
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    return (
        <div ref={mapProt} className="h-[100vh] w-full font-montserrat"/>
    );
}