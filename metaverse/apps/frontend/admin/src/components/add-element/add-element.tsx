import { useState } from "react";
import { BACKEND_URL } from "../../lib/config";

export function CreateElement() {
    const [name, setName] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [isStatic, setIsStatic] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    async function handleImageUpload(file: File) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    resolve(e.target.result as string);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function handleSubmit() {
        if (!name || !width || !height || !imageFile) {
            alert("Please fill in all the fields");
            return;
        }

        try {
            const base64Image = await handleImageUpload(imageFile);
            const elementWidth = parseInt(width);
            const elementHeight = parseInt(height);
            
            if (isNaN(elementWidth) || elementWidth <= 0 || isNaN(elementHeight) || elementHeight <= 0) {
                alert("Please enter valid dimensions (greater than 0)");
                return;
            }

            const response = await fetch(`${BACKEND_URL}/admin/element`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name,
                    width: elementWidth,
                    height: elementHeight,
                    static: isStatic,
                    base64Image,
                }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create element');
            }
            
            const data = await response.json();
            console.log(data);
            alert("Element created successfully");
            // Reset form after successful submission
            setName("");
            setWidth("");
            setHeight("");
            setIsStatic(false);
            setImageFile(null);
        } catch (error) {
            console.error("Failed to create element:", error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Failed to create element");
            }
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
                                        <label htmlFor="image-upload" className="text-sm font-medium text-gray-700">
                                            Upload Element Image
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setImageFile(e.target.files[0]);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                            >
                                                Choose Image
                                            </label>
                                            {imageFile && (
                                                <span className="ml-4 text-sm text-gray-500">
                                                    {imageFile.name}
                                                </span>
                                            )}
                                        </div>
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
