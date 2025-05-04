import L, { LatLngExpression, Map } from 'leaflet';
import { renderToString } from "react-dom/server";

export function placeMarker(map: Map, lat: LatLngExpression, icon: L.Icon, info: string): void {
    L.marker(lat, { icon: icon }).addTo(map).bindPopup(generatePopupMarkup(info));
    return;
}

function generatePopupMarkup(info: string): string {
    const parsedJSON = JSON.parse(info);
    return renderToString (
        <div className="font-montserrat flex-col flex justify-center items-center">
            <div className="font-bold text-xl">{parsedJSON.name}</div>
            <div className="">Hello world</div>
        </div>
    );
}
/*
JSON structure: {
    isconfirmed: "true"/"false" - checks if the point is confirmed
    name: place name,
    description: place description
    photo: link to photo if present
    comments: comments lol no idea how to implement for now dgaf
}
 */