import { useState } from "react";
import { BACKEND_URL } from "../../lib/config"

export function CreateAvatar() {
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    async function handleSubmit() {
        if (!name || !imageUrl) {
            alert("Please fill in all the fields");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/admin/avatar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name,
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
        <div className="border rounded-xl shadow-lg bg-white w-full max-w-4xl mx-auto">
            <div className="border-b p-4 bg-blue-100 rounded-t-xl">
                <h2 className="text-xl font-semibold">Create a new Avatar</h2>
                <p className="text-sm text-gray-600">
                    Fill in the form below to create a new avatar
                </p>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Element Name */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Element Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="New Element"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Image URL */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
                            Image URL
                        </label>
                        <input
                            id="imageUrl"
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
            <div className="p-4 border-t flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Create Avatar
                </button>
            </div>
        </div>
    );
}
