import L, { LatLngExpression, Map } from 'leaflet';
import { renderToString } from "react-dom/server";
// @ts-ignore
import { Session } from "next-auth/react";
import { createRoot } from "react-dom/client";
import React, {useEffect} from "react";

export function placeMarker(map: Map, lat: LatLngExpression, icon: L.Icon, info: string, session: any, status: string, userNickname: string | undefined): void {

    const container = document.createElement('div');
    const root = createRoot(container);

    const marker = L.marker(lat, { icon: icon }).addTo(map)

    root.render(
        <PopupMarkup
            info={info}
            session={session}
            status={status}
            marker={marker}
            userNickname={userNickname}
        />
    );

    marker.bindPopup(container);

    return;
}

function PopupMarkup({info, session, status, marker, userNickname}: {info: string, session: any, status: string, marker: any, userNickname: string | undefined}): React.JSX.Element {
    type viewStates =
        'main'
        | 'deleting'
        | 'delete-success'
        | 'delete-error'
        | 'confirming'
        | 'confirm-success'
        | 'confirm-error';
    const [view, setView] = React.useState<viewStates>('main');

    useEffect(() => {
        marker.getPopup()?.update();
    }, [view]);

    const confirmPoint = async () => {
        setView('confirming');
        const req = await fetch(`/api/confirm-point?id=${parsedJSON.id}`, {
            method: 'PUT',
        })
        if (req.status === 200) setView('confirm-success');
        else setView('confirm-error');
        return;
    }
    const deletePoint = async () => {
        setView('deleting');
        const req = await fetch(`/api/delete-point?id=${parsedJSON.id}`, {
            method: 'DELETE',
        })
        if (req.status === 200) setView('delete-success');
        else setView('delete-error');
        return;
    }

    const parsedJSON = JSON.parse(info);

    type ExtendedSession = Session & {
        user: {
            id: number;
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

    switch (view) {
        case 'deleting':
            return (
                <div className="font-montserrat text-xl flex justify-center items-center min-w-[200px]">
                    Deleting...
                </div>
            )
        case 'delete-success':
            return (
                <div className="font-montserrat text-green-600 text-xl  flex-col flex justify-center items-center min-w-[200px]">
                    <div className={'mb-2'}>Point deleted successfully!</div>
                    <button
                        className={'button-6 flex min-h-0! h-25px! w-full'}
                        onClick={() => {window.location.reload()}}
                    >
                        OK
                    </button>
                </div>
            )
        case 'delete-error':
            return (
                <div className="font-montserrat text-red-600 text-xl  flex-col flex justify-center items-center min-w-[200px]">
                    <div className={'mb-2 text-center'}>Deletion failed.<br />Please try again</div>
                    <button
                        className={'button-6 flex min-h-0! h-25px! w-full'}
                        onClick={(e) => {
                            e.stopPropagation();
                            setView('main');
                        }}
                    >
                        OK
                    </button>
                </div>
            )
        case 'confirming':
            return (
                <div className="font-montserrat flex-col text-xl flex justify-center items-center min-w-[200px]">
                    Confirming...
                </div>
            )
        case 'confirm-success':
            return (
                <div className="font-montserrat text-green-600 text-xl  flex-col flex justify-center items-center min-w-[200px]">
                    <div className={'mb-2'}>Point confirmed successfully!</div>
                    <button
                        className={'button-6 flex min-h-0! h-25px! w-full'}
                        onClick={() => {window.location.reload()}}
                    >
                        OK
                    </button>
                </div>
            )
        case 'confirm-error':
            return (
                <div className="font-montserrat text-red-600 text-xl  flex-col flex justify-center items-center min-w-[200px]">
                    <div className={'mb-2 text-center'}>Confirmation failed.<br />Please try again</div>
                    <button
                        className={'button-6 flex min-h-0! h-25px! w-full'}
                        onClick={(e) => {
                            e.stopPropagation();
                            setView('main');
                        }}
                    >
                        OK
                    </button>
                </div>
            )
        case 'main':
            return (
                    <div className="font-montserrat flex-col flex justify-center items-center min-w-[200px]">
                        <div className="font-bold text-xl text-center">{parsedJSON.name}</div>
                        {
                            parsedJSON.is_confirmed == false
                                ? <div className="text-red-500">Location is not confirmed</div>
                                : ''
                        }
                        <div className="mb-2 text-center">{parsedJSON.description}</div>
                        {
                            parsedJSON.photo
                                ? <img src={parsedJSON.photo} className={'text-gray-500 mb-2 max-h-[300px]'}
                                       alt="photo"></img>
                                : ''
                        }
                        {
                            userNickname
                            ? <div className={'mb-2 text-center text-gray-500'}>Added by @{userNickname}</div>
                            : ''
                        }
                        {allowedToDelete || allowedToConfirm ?
                            <div className={'flex flex-row justify-center gap-1.25 w-full h-8.75 mb-2 '}>
                                {
                                    allowedToConfirm
                                        ? <button id={'confirm-button'}
                                                  className={`flex button-6 bg-green-200! min-h-0! whitespace-nowrap 
                                    ${allowedToDelete ? 'max-w-1/2' : 'w-full'}`}
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      confirmPoint();
                                                  }}
                                        >
                                            <div className={'font-medium text-sm w-full'}>Confirm point</div>
                                        </button>
                                        : ''
                                }
                                {
                                    allowedToDelete
                                        ? <button id={'delete-button'}
                                                  className={`flex button-6 bg-red-200! min-h-0! whitespace-nowrap 
                                    ${allowedToConfirm ? 'max-w-1/2' : 'w-full'}`}
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      deletePoint();
                                                  }}
                                        >
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