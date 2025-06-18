import { useState } from "react";
import { BACKEND_URL } from "../../lib/config";

export function CreateElement() {
    const [name, setName] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [isStatic, setIsStatic] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    async function handleSubmit() {
        if (!name || !width || !height || !imageUrl) {
            alert("Please fill in all the fields");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/admin/element`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name,
                    width: parseInt(width),
                    height: parseInt(height),
                    static: isStatic,
                    imageUrl,
                }),
            });
            const data = await response.json();
            console.log(data);
            alert("Element created successfully");
        } catch (error) {
            console.error("Failed to create element:", error);
            alert("Failed to create element");
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
                                <h1 className="text-3xl font-bold text-center mb-8">Create New Element</h1>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Element name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            autoComplete="element-name"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                                                placeholder="Element width"
                                                value={width}
                                                onChange={(e) => setWidth(e.target.value)}
                                                required
                                                autoComplete="element-width"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="height" className="text-sm font-medium text-gray-700">
                                                Height
                                            </label>
                                            <input
                                                id="height"
                                                type="number"
                                                placeholder="Element height"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                required
                                                autoComplete="element-height"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
                                            Image URL
                                        </label>
                                        <input
                                            id="imageUrl"
                                            type="text"
                                            placeholder="https://example.com/image.jpg"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            required
                                            autoComplete="element-image-url"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <select
                                            id="static"
                                            value={isStatic ? "true" : "false"}
                                            onChange={(e) => setIsStatic(e.target.value === "true")}
                                            className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="" disabled>
                                                Element is Static or not
                                            </option>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Create Element
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Create Element
                </button>
            </div>
        </div>
    );
}
