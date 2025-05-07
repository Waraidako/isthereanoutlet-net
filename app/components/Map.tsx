"use client"

import React, { useEffect, useRef, useState } from "react";
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

let popupOpen: boolean = false;

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

export default function MapDisplay() {
    const mapRef = useRef(null);
    const mapProt = useRef<Map | null>(null);
    const populateMap = async (leafletMap: Map) => {
        const req = await fetch("/api/points");
        const json = await req.json();
        json.points.map((point: any) => {
            const pointIconName: string = point.type + (point.is_confirmed ? '-' : '-not-') + 'confirmed.png';
            placeMarker(leafletMap, JSON.parse(point.coordinates), buildIcon(pointIconName), JSON.stringify({
                name: point.name,
                is_confirmed: point.is_confirmed,
                description: point.description
            }))
        })
    }

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
            const map = mapProt.current;
            const onLocationFound = ((e: any): void => {
                map.setView(e.latlng, 16)
                placeMarker(map, e.latlng, hasOutletsConfirmedIcon, JSON.stringify({ name: 'I see you' }));
            });
            const onLocationError = ((e: any): void => {
                map.setView([55.751934, 37.618346], 16);
            })
            const onMapClick = ((e:any): void => {
                if (!popupOpen) {
                    alert('clicked on: ' + e.latlng)
                }
                console.log(popupOpen);
            })
            map.locate({ setView: true, maxZoom: 16 })
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
            map.on('click', onMapClick);
            map.on('popupopen', () => {
                popupOpen = true;
            })
            map.on('popupclose', () => {
                popupOpen = false;
            })
            populateMap(map);
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

/*
const points = await prisma.point.findMany();

points.map((point) => {
                const pointIconName: string = point.type + (point.is_confirmed ? '-' : '-not-') + 'confirmed.png';
                placeMarker(map, JSON.parse(point.coordinates), buildIcon(pointIconName), JSON.stringify({
                    name: point.name,
                    isconfirmed: point.is_confirmed,
                    description: point.description
                }))
            })
 */