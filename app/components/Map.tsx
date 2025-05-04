"use client"

import { useEffect, useRef } from "react";
import L, {Map, PointExpression} from 'leaflet';
import "leaflet/dist/leaflet.css";
import "../../public/images/icons/no-outlets-confirmed.png";
import '../utils/Leaflet.DoubleTapDrag';
import '../utils/Leaflet.DoubleTapDragZoom';
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
    const mapRef = useRef(null);
    const mapProt = useRef<Map | null>(null);
    const map = mapProt.current!;

    const onLocationFound = ((e: any) => {
        placeMarker(mapProt.current!, e.latlng, hasOutletsConfirmedIcon, 'You are within this radius')
        L.circle(e.latlng, e.accuracy).addTo(mapProt.current!);
    });

    const onLocationError = ((e: any) => {
        mapProt.current!.setView([55.751934, 37.618346], 14);
    })

    useEffect(() => {
        if (mapRef.current && !mapProt.current) {
            mapProt.current = L.map(mapRef.current, {
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
            }).addTo(mapProt.current);
            const info1 = JSON.stringify({ name: "Place #1" });
            const info2 = JSON.stringify({ name: "Place #2" });
            const info3 = JSON.stringify({ name: "Place #3" });
            const info4 = JSON.stringify({ name: "Place #4" });
            placeMarker(mapProt.current, [55.751934, 37.618346], hasOutletsNotConfirmedIcon, info1);
            placeMarker(mapProt.current, [55.752934, 37.619346], hasOutletsConfirmedIcon, info2);
            placeMarker(mapProt.current, [55.752834, 37.618446], noOutletsConfirmedIcon, info3);
            placeMarker(mapProt.current, [55.753934, 37.618556], noOutletsNotConfirmedIcon, info4);


        }
        return () => {
            if (mapProt.current) {
                mapProt.current.remove();
                mapProt.current = null;
            }
        };
    }, []);

    return (
        <div ref={mapRef} className="h-[100vh] w-full font-montserrat"/>
    );
}