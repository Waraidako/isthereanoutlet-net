import L, { LatLngExpression, Map } from 'leaflet';
import { renderToString } from "react-dom/server";

export function placeMarker(map: Map, lat: LatLngExpression, icon: L.Icon, info: string): void {
    L.marker(lat, { icon: icon }).addTo(map).bindPopup(generatePopupMarkup(info));
    return;
}

function generatePopupMarkup(info: string): string {
    const parsedJSON = JSON.parse(info);
    let width = 0;
    return renderToString (
        <div className="font-montserrat flex-col flex justify-center items-center min-w-[200px]">
            <div className="font-bold text-xl">{parsedJSON.name}</div>
            {
                parsedJSON.is_confirmed == false
                ? <div className="text-red-500">Location is not confirmed</div>
                : ''
            }
            <div className="mb-2">{parsedJSON.description}</div>
            {
                parsedJSON.photo
                    ? <img src={parsedJSON.photo} alt="photo"></img>
                    : ''
            }
        </div>
    );
}
/*
JSON structure: {
    is_confirmed: true/false - checks if the point is confirmed
    name: place name,
    description: place description
    photo: link to photo if present
    comments: comments lol no idea how to implement for now dgaf
}
 */