import { BACKEND_URL } from "../../../lib/config";
import { MapInterface, ElementInterface, AvatarInterface } from "../../../lib/types"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapCard, ElementCard, AvatarCard } from "./getDataInCard";
import { Button } from "@headlessui/react";
export function MainComponent() {
    const [maps, setMaps] = useState<MapInterface[]>([]);
    const [elements, setElements] = useState<ElementInterface[]>([]);
    const [avatars, setAvatars] = useState<AvatarInterface[]>([]);
    const navigate = useNavigate();

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
        console.log("maps", data);
        setMaps(data);
    }

    async function getElements() {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to login first");
            return;
        }
        const res = await fetch(`${BACKEND_URL}/elements`);

        const data = await res.json();
        console.log("elements", data);
        setElements(data.elements);
    }

    async function getAvatars() {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to login first");
            return;
        }
        const res = await fetch(`${BACKEND_URL}/avatars`);

        const data = await res.json();
        console.log("avatars", data);
        setAvatars(data.avatars);
    }

    useEffect(() => {
        getMaps();
        getElements();
        getAvatars();
    }, []);

    return (
        <div className="p-6">
            <div className="border-b bg-primary/5 p-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-500 mt-2">
                    This is the admin dashboard for the Metaverse project. You can manage users, view statistics, and more.
                </p>
            </div>

            <div className="mt-8">
                <div className="mb-6">
                    <div className="flex flex-row justify-start items-center space-x-4">
                        <Button
                            onClick={() => navigate("/create-map")}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create new Map
                        </Button>
                        <Button
                            onClick={() => navigate("/create-element")}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add new Element
                        </Button>
                        <Button
                            onClick={() => navigate("/create-avatar")}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add new Avatar
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="col-span-1 lg:col-span-2">
                        <div className="border-b bg-primary/5 p-6">
                            <h2 className="text-xl font-semibold">Maps</h2>
                            <p className="text-gray-500 mt-2">
                                Maps are the virtual worlds that users can explore and interact with.
                            </p>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {maps.map((map) => (
                                <MapCard key={map.id} {...map} />
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="border-b bg-primary/5 p-6">
                            <h2 className="text-xl font-semibold">Elements</h2>
                            <p className="text-gray-500 mt-2">
                                Elements are the building blocks of maps.
                            </p>
                        </div>
                        <div className="mt-6">
                            {elements.map((element) => (
                                <ElementCard key={element.id} {...element} />
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="border-b bg-primary/5 p-6">
                            <h2 className="text-xl font-semibold">Avatars</h2>
                            <p className="text-gray-500 mt-2">
                                Avatars are characters.
                            </p>
                        </div>
                        <div className="mt-6">
                            {avatars.map((avatar) => (
                                <AvatarCard key={avatar.id} {...avatar} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
