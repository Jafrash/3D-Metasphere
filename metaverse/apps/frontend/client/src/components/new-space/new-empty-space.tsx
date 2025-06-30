import { useState } from "react";
import  Navbar from "../nav/navbar"
import { SpaceEditor } from "./SpaceEditor";

export function NewEmptySpace() {
    const [name, setName] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [dimension, setDimension] = useState("");

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
            <header className="relative overflow-hidden">
                <Navbar />
                <div className="container mx-auto px-4 flex flex-row gap-2 lg:px-8">
                    <div className="mt-9 w-full rounded-2xl border shadow-md bg-white">
                        <div className="border-b bg-indigo-50 px-6 py-4 rounded-t-2xl">
                            <h2 className="text-xl font-semibold text-gray-800">Create a new map</h2>
                            <p className="text-sm text-gray-600">Fill in the form below to create a new map</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Map Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="New Map"
                                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="thumbnail" className="text-sm font-medium text-gray-700">Thumbnail</label>
                                    <input
                                        id="thumbnail"
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onChange={(e) => setThumbnail(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="dimension" className="text-sm font-medium text-gray-700">Dimension</label>
                                    <input
                                        id="dimension"
                                        type="text"
                                        placeholder="100x100"
                                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onChange={(e) => setDimension(e.target.value)}
                                    />
                                </div>
                            </div>

                            {!name || !thumbnail || !dimension ? (
                                <p className="text-red-500 text-sm mt-4">Please fill in all the fields</p>
                            ) : null}

                            {name && thumbnail && dimension && (
                                <div className="mt-6">
                                    <SpaceEditor name={name} thumbnail={thumbnail} dimension={dimension} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
