import React from "react";
import { useState } from "react";
import { BACKEND_URL } from "../../lib/config";
import { useNavigate } from "react-router-dom";
import { MapEditor } from "./mapEditor";

export function CreateMap() {
    const [name, setName] = useState("");
    const [width, setWidth] = useState(1000);
    const [height, setHeight] = useState(1000);
    const [mapData, setMapData] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        if (!name || !mapData) {
            alert("Please fill in all fields and create the map data");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/map`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    width,
                    height,
                    data: mapData
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            alert("Map created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error creating map:", error);
            alert("Failed to create map");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <h1 className="text-3xl font-bold text-center mb-8">Create New Map</h1>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Map Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Enter map name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            autoComplete="map-name"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="width" className="text-sm font-medium text-gray-700">
                                                Width
                                            </label>
                                            <input
                                                id="width"
                                                type="number"
                                                value={width}
                                                onChange={(e) => setWidth(parseInt(e.target.value))}
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                autoComplete="map-width"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="height" className="text-sm font-medium text-gray-700">
                                                Height
                                            </label>
                                            <input
                                                id="height"
                                                type="number"
                                                value={height}
                                                onChange={(e) => setHeight(parseInt(e.target.value))}
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                autoComplete="map-height"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h2 className="text-xl font-semibold mb-4">Map Editor</h2>
                                        <MapEditor
                                            width={width}
                                            height={height}
                                            onMapDataChange={setMapData}
                                        />
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Create Map
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
