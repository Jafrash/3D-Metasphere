import { useState } from "react";
import { MapEditor } from "./mapEditor";

export function CreateMap() {
    const [name, setName] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [dimension, setDimension] = useState("");

    return (
        <div className="border rounded-xl shadow-lg bg-white w-full max-w-4xl mx-auto">
            <div className="border-b p-4 bg-blue-100 rounded-t-xl">
                <h2 className="text-xl font-semibold">Create a new map</h2>
                <p className="text-sm text-gray-600">
                    Fill in the form below to create a new map
                </p>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Map Name */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Map Name
                        </label>
                        <input
                            id="name"
                            placeholder="New Map"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="thumbnail-upload" className="text-sm font-medium text-gray-700">
                            Upload Thumbnail
                        </label>
                        <input
                            id="thumbnail-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setThumbnailFile(e.target.files[0]);
                                }
                            }}
                            className="hidden"
                        />
                        <label
                            htmlFor="thumbnail-upload"
                            className="cursor-pointer border px-3 py-2 rounded-md shadow-sm bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                            Choose Image
                        </label>
                        {thumbnailFile && (
                            <div className="mt-2 text-sm text-gray-500">
                                Selected: {thumbnailFile.name}
                            </div>
                        )}
                    </div>

                    {/* Dimension */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="dimension" className="text-sm font-medium text-gray-700">
                            Dimension
                        </label>
                        <input
                            id="dimension"
                            placeholder="100x100"
                            value={dimension}
                            onChange={(e) => setDimension(e.target.value)}
                            className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Validation message */}
                {(!name || !thumbnailFile || !dimension) && (
                    <p className="text-red-500 text-sm mt-4">
                        Please fill in all the fields
                    </p>
                )}

                {/* Map Editor Preview */}
                {name && thumbnailFile && dimension && (
                    <div className="mt-6">
                        <MapEditor name={name} thumbnailFile={thumbnailFile} dimensions={dimension} />
                    </div>
                )}
            </div>
        </div>
);
}