import { useState } from "react";
import { BACKEND_URL } from "../../lib/config"

export function CreateAvatar() {
    const [name, setName] = useState("");
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
        if (!name || !imageFile) {
            alert("Please fill in all the fields");
            return;
        }

        try {
            const base64Image = await handleImageUpload(imageFile);
            const trimmedName = name.trim();
            
            if (trimmedName === '') {
                alert("Please enter a valid name");
                return;
            }

            const response = await fetch(`${BACKEND_URL}/admin/avatar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: trimmedName,
                    base64Image,
                }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create avatar');
            }
            
            const data = await response.json();
            console.log(data);
            alert("Avatar created successfully");
            // Reset form after successful submission
            setName("");
            setImageFile(null);
        } catch (error) {
            console.error("Failed to create avatar:", error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Failed to create avatar");
            }
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

                    {/* Image Upload */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="image-upload" className="text-sm font-medium text-gray-700">
                            Upload Avatar Image
                        </label>
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
                            className="cursor-pointer border px-3 py-2 rounded-md shadow-sm bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                            Choose Image
                        </label>
                        {imageFile && (
                            <div className="mt-2 text-sm text-gray-500">
                                Selected: {imageFile.name}
                            </div>
                        )}
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
