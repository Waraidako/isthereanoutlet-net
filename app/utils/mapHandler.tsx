import L, { LatLngExpression, Map } from 'leaflet';
import { renderToString } from "react-dom/server";

export function placeMarker(map: Map, lat: LatLngExpression, icon: L.Icon, info: string): void {
    L.marker(lat, { icon: icon }).addTo(map).bindPopup(generatePopupMarkup(info));
    return;
}

function generatePopupMarkup(info: string): string {
    const parsedJSON = JSON.parse(info);
    return renderToString (
        <div className="font-montserrat">
            {parsedJSON.name}
        </div>
    );
}