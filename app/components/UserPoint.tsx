"use client"

import L from "leaflet";
import {useEffect, useRef} from 'react';
import { buildIcon } from "@/app/components/Map";


export const UserPoint = ({ info }: { info: any }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null); // Track the map instance

    const pointIconName: string = info.type + (info.is_confirmed ? '-' : '-not-') + 'confirmed.png';
    const coords = JSON.parse(info.coordinates);

    useEffect(() => {
        if (!mapRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(coords, 15);
            mapInstanceRef.current.invalidateSize();
            return;
        }

        const map = L.map(mapRef.current, {
            doubleClickZoom: false,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
        }).setView(coords, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker(coords, {icon: buildIcon(pointIconName)}).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [ coords ]);

    const isoDate = info.date_added;
    const dateObject = new Date(isoDate);

    const formattedDate = new Intl.DateTimeFormat('de-DE', {
        dateStyle: 'short',
        timeStyle: 'medium',
        hour12: false,
    }).format(dateObject);

    return (
        <div className={'h-[18vh] max-h-[18vh] bg-[#DDDDDD] rounded-lg flex flex-row justify-between items-center p-1.5'}>
            <div className={'ml-3 max-w-[57%] text-base text-start flex gap-2 flex-col'}>
                <div className={'truncate'}>Name: {info.name}</div>
                <div className={'truncate'}>Description: {info.description}</div>
                <div className={'flex flex-row w-full'}><div>Confirmed:&nbsp;</div>{
                    info.is_confirmed
                        ? <div className={'text-green-500'}>Yes</div>
                        : <div className={'text-red-500'}>No</div>}
                </div>
                <div>Added on: {formattedDate.replace(',', '')}</div>
            </div>
            <div
                ref={mapRef}
                className={'w-[40%] h-[17vh] rounded-lg'}
            />
        </div>
    )
}

export default UserPoint;