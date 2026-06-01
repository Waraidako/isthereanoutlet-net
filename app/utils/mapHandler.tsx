import L, { LatLngExpression, Map } from 'leaflet';
import { renderToString } from "react-dom/server";
import { Session } from "next-auth/react";

export function placeMarker(map: Map, lat: LatLngExpression, icon: L.Icon, info: string, session: any, status: string): void {
    L.marker(lat, { icon: icon }).addTo(map).bindPopup(generatePopupMarkup(info, session, status));
    return;
}

function generatePopupMarkup(info: string, session: any, status: string): string {
    const parsedJSON = JSON.parse(info);

    type ExtendedSession = Session & {
        user: {
            role: string;
        }
    };

    const extendedSession = session as unknown as ExtendedSession;

    let allowedToConfirm = false;
    let allowedToDelete = false;

    if (status === 'authenticated') {
        const user = extendedSession.user;
        if (parsedJSON.userId === user.id || user.role === 'admin') allowedToDelete = true;
        if (parsedJSON.userId !== user.id || user.role === 'admin') allowedToConfirm = parsedJSON.is_confirmed === false;
    }

    const confirmPoint = async () => {
        return;
    }
    const deletePoint = async () => {
        return;
    }

    return renderToString (
        <div className="font-montserrat flex-col flex justify-center items-center min-w-[200px]">
            <div className="font-bold text-xl text-center">{parsedJSON.name}</div>
            {
                parsedJSON.is_confirmed == false
                ? <div className="text-red-500">Location is not confirmed</div>
                : ''
            }
            {
                parsedJSON.description
                    ? <div className="mb-2 text-center">{parsedJSON.description}</div>
                    : ''
            }
            {
                parsedJSON.photo
                    ? <img src={parsedJSON.photo} className={'text-gray-500 mb-2 max-h-[300px]'} alt="photo"></img>
                    : ''
            }
            { allowedToDelete || allowedToConfirm ?
            <div className={'flex flex-row gap-[5px] w-full h-[35px] mb-2 '} >
                {
                    allowedToConfirm
                    ? <button className={`flex button-6 bg-green-200! min-h-0! whitespace-nowrap ${allowedToDelete ? 'max-w-1/2' : 'w-full'}`}>
                            <div className={'font-medium text-sm w-full'}>Confirm point</div>
                    </button>
                    : ''
                }
                {
                    allowedToDelete
                    ? <button className={`flex button-6 bg-red-200! min-h-0! whitespace-nowrap ${allowedToConfirm ? 'max-w-1/2' : 'w-full'}`}>
                            <div className={'font-medium text-sm w-full'}>Delete point</div>
                        </button>
                    : ''
                }
            </div>
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