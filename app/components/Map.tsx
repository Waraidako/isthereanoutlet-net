"use client"

import React, { useEffect, useRef, useState } from "react";
import L, {LatLng, Map, PointExpression} from 'leaflet';
import "leaflet/dist/leaflet.css";
import "../../public/images/icons/no-outlets-confirmed.png";
import '../utils/Leaflet.DoubleTapDrag';
import '../utils/Leaflet.DoubleTapDragZoom';
import { placeMarker } from "@/app/utils/mapHandler";
import {renderToStaticMarkup, renderToString} from "react-dom/server";
import {createRoot} from "react-dom/client";

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

function buildFormMarkup(e: LatLng): string {
    return (`
        <div>
            <form action="/api/add-point" method="POST" class="">
                <div class="flex-col justify-items-center items-center min-w-[300px]">
                    <div class="w-full mb-2"><input class="text-center w-full placeholder-black" type="text" id="coordinates" name="coordinates" readonly placeholder="Coordinates: [`
                        + e.lat.toFixed(6) + ', ' + e.lng.toFixed(6) +
                    `]"/></div>
                    <div class="w-full mb-2"><input class="w-full text-center" type="text" id="name" name="name" required placeholder="Name"/></div>
                    <div class="w-full mb-2"><input class="w-full text-center" type="submit" value="Add place"></div>
                </div>
            </form>
        </div>`
    )
}

export default function MapDisplay() {
    const mapRef = useRef(null);
    const mapProt = useRef<Map | null>(null);

    const populateMap = async (leafletMap: Map) => {
        const req = await fetch("api/points");
        const json = await req.json();
        json.points.map((point: any) => {
            const pointIconName: string = point.type + (point.is_confirmed ? '-' : '-not-') + 'confirmed.png';
            placeMarker(leafletMap, JSON.parse(point.coordinates), buildIcon(pointIconName), JSON.stringify({
                name: point.name,
                is_confirmed: point.is_confirmed,
                photo: point.photo,
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
                placeMarker(map, e.latlng, buildIcon('has-outlets-confirmed.png'), JSON.stringify({ name: 'I see you' }));
            });
            const onLocationError = ((e: any): void => {
                map.setView([55.751934, 37.618346], 16);
            })
            const onContextMenu = ((e: any) => {
                const marker = L.marker(e.latlng, {
                    icon: buildIcon('outlets-not-defined-confirmed.png')

                }).addTo(map)
                    .bindPopup(buildFormMarkup(e.latlng), {
                        keepInView: true,
                        //autoPan: true,
                        //autoPanPadding: markerPadding,
                    }).openPopup();
                marker.on('popupclose', () => {
                    const element = marker.getElement();
                    if (element) {
                        element.style.transition = 'opacity 0.3s ease';
                        element.style.opacity = '0';
                    }
                    setTimeout(() => {
                        map.removeLayer(marker);
                    }, 300);
                })
                let point = map.latLngToLayerPoint(e.latlng);
                point.y -= map.getSize().y / 4;
                map.panTo(map.layerPointToLatLng(point));
                //map.setView(map.layerPointToLatLng(point), 17);
                // It's not up to Pollo's standards ;(
                // But shit guess I have to be ok with it
            })

            map.locate({ setView: true, maxZoom: 16 })
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
            map.on('contextmenu', onContextMenu);
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