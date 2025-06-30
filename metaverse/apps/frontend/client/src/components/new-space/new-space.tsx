import { MapInterface } from "../../types"
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../lib/config"


export function NewSpaceCard() {
    const [maps, setMaps] = useState<MapInterface[]>([]);

    async function getMaps() {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to login first");
            return;
        }
        const res = await fetch(`${BACKEND_URL}/admin/map`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        setMaps(data);
    }

    useEffect(() => {
        getMaps();
    }, []);

    return (
        <div className="mt-9 w-full rounded-xl border shadow-md bg-white">
            <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4 flex flex-row justify-between items-center rounded-t-xl">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Existing Maps</h2>
                    <p className="text-sm text-gray-600">
                        Here are the virtual spaces you have created. You can create new spaces and manage them here.
                    </p>
                </div>
                <button
                    onClick={() => window.location.href = "/new-space/create"}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Start with Empty Space
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {maps.length === 0 && (
                    <div className="text-center col-span-3 border-2 border-dashed border-indigo-300 rounded-lg p-4">
                        <h2 className="text-indigo-400">
                            You have not created any spaces yet.
                        </h2>
                    </div>
                )}

                {maps.map((map) => (
                    <MapCard key={map.id} {...map} />
                ))}
            </div>
        </div>
    );
}

function MapCard({ id, name, thumbnail, height, width }: MapInterface) {
    return (
        <div className="border rounded-xl shadow-sm bg-white flex flex-col overflow-hidden">
            <div className="p-4">
                {thumbnail && (
                    <img
                        src={thumbnail}
                        alt={name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                    />
                )}
                <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                <p className="text-sm text-gray-500">{height}x{width}</p>
            </div>
            <div className="p-4 mt-auto">
                <button
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                    onClick={() => window.location.href = `/new-space/${id}`}
                >
                    Use this Map
                </button>
            </div>
        </div>
    );
}
