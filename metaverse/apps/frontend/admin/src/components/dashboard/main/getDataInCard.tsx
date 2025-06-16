import { BACKEND_URL } from "../../../lib/config";
import { AvatarInterface, ElementInterface, MapInterface, MapElementInterface } from "../../../lib/types"
import { useState } from "react";
import { Button } from "@headlessui/react";

interface MapCardProps extends MapInterface {
    mapElements: MapElementInterface[];
}

export function MapCard({ id, name, thumbnail, height, width, mapElements }: MapCardProps) {
    return (
        <div className="rounded-lg border bg-white shadow-sm">
            <div className="flex gap-2 p-4">
                <img src={thumbnail || ""} alt={name} className="h-20 w-20 rounded-lg object-cover" />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-gray-500">{height}x{width}</p>
            </div>
            <div className="p-4 border-t">
                <h4 className="text-sm font-medium mb-2">Elements</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mapElements.map((element) => (
                        <div key={element.id} className="bg-gray-50 p-3 rounded">
                            <div className="flex justify-between items-center">
                                <div className="text-sm">
                                    <p>ID: {element.id}</p>
                                    <p>Position: ({element.x}, {element.y})</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between p-4 border-t">
                <Button
                    onClick={() => {
                        window.location.href = `/map/${id}`;
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    View
                </Button>
                <Button
                    onClick={() => {
                        window.location.href = `/map/${id}/edit`;
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Edit
                </Button>
            </div>
        </div>
    )
}

export function ElementCard({ id, width, height, imageUrl, name, static: isStatic }: ElementInterface) {
    const [newImgUrl, setNewImgUrl] = useState<string>("");
    const [update, setUpdate] = useState<boolean>(false);

    async function UpdateElement() {
        if (newImgUrl === "") return;

        const res = await fetch(`${BACKEND_URL}/admin/element/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                imageUrl: newImgUrl,
            }),
        });
        if (res.ok) {
            alert("Element Updated")
        } else {
            alert("Failed to update element")
        }
    }

    return (
        <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-4">
                <img 
                    src={imageUrl || "https://via.placeholder.com/150"} 
                    alt={id} 
                    className="h-32 w-full object-cover rounded-lg mb-4"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-gray-500">
                    {width}x{height} {isStatic ? "Static" : "Dynamic"}
                </p>
            </div>
            <div className="p-4 border-t">
                {update && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            New Image:
                        </label>
                        <input
                            type="text"
                            placeholder="https://exampleImgUrl.com/150"
                            onChange={(e) => setNewImgUrl(e.target.value)}
                            value={newImgUrl}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                )}
                <Button
                    onClick={() => {
                        if (!update) {
                            setUpdate(true);
                        } else if (newImgUrl) {
                            UpdateElement();
                            setUpdate(false);
                        }
                    }}
                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100 mt-2"
                >
                    {update ? (newImgUrl ? "Save" : "Enter Image Url") : "Update"}
                </Button>
            </div>
        </div>
    )
}

export function AvatarCard({ id, name, imageUrl }: AvatarInterface) {
    return (
        <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-4">
                <div
                    className="h-32 w-full bg-no-repeat bg-cover mb-4"
                    style={{
                        backgroundImage: `url(${imageUrl || "https://via.placeholder.com/150"})`,
                        backgroundPosition: '32 0',
                        backgroundSize: 'cover',
                    }}
                ></div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-gray-500">{id}</p>
            </div>
        </div>
    );
}
