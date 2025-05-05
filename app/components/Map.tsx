"use client"

import React, { useEffect, useRef } from "react";
import L, {Map, PointExpression} from 'leaflet';
import "leaflet/dist/leaflet.css";
import "../../public/images/icons/no-outlets-confirmed.png";
import '../utils/Leaflet.DoubleTapDrag';
import '../utils/Leaflet.DoubleTapDragZoom';
import { placeMarker } from "@/app/utils/mapHandler";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

const iconSize: PointExpression = [48, 48];
const iconAnchor: PointExpression = [24, 45];
const popupAnchor: PointExpression = [0, -45];

function buildIcon(path: string): L.Icon {
    return L.icon({
        iconUrl: '/images/icons/' + path,

        iconSize: iconSize,
        iconAnchor: iconAnchor,
        popupAnchor: popupAnchor
    })
}

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

export default async function MapDisplay() {
    const mapRef = useRef(null);
    const mapProt = useRef<Map | null>(null);
    const points = await prisma.point.findMany();

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
            }).addTo(mapProt.current);
            const map = mapProt.current!;

            const onLocationFound = ((e: any): void => {
                map.setView(e.latlng, 16)
                placeMarker(map, e.latlng, hasOutletsConfirmedIcon, JSON.stringify({ name: 'I see you' }));
            });

            const onLocationError = ((e: any): void => {
                map.setView([55.751934, 37.618346], 16);
            })

            const onMapClick = ((e:any): void => {

            })

            const info1 = JSON.stringify({
                isconfirmed: 'false',
                name: "Place #1",
                description: "A cafe by the fountain",
                photo: "/images/test.jpg",
            });
            //const info2 = JSON.stringify({ name: "Place #2" });
            //const info3 = JSON.stringify({ name: "Place #3" });
            //const info4 = JSON.stringify({ name: "Place #4" });
            placeMarker(mapProt.current, [55.751934, 37.618346], hasOutletsNotConfirmedIcon, info1);
            //placeMarker(mapProt.current, [55.752934, 37.619346], hasOutletsConfirmedIcon, info2);
            //placeMarker(mapProt.current, [55.752834, 37.618446], noOutletsConfirmedIcon, info3);
            //placeMarker(mapProt.current, [55.753934, 37.618556], noOutletsNotConfirmedIcon, info4);
            map.locate({ setView: true, maxZoom: 16 })
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
            points.map((point) => {
                const pointIconName: string = point.type + (point.is_confirmed ? '-' : '-not-') + 'confirmed.png';
                placeMarker(map, JSON.parse(point.coordinates), buildIcon(pointIconName), JSON.stringify({
                    name: point.name,
                    isconfirmed: point.is_confirmed,
                    description: point.description
                }))
            })
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