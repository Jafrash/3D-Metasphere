import { BACKEND_URL } from "../../lib/config";
import { useEffect, useState } from 'react';

interface AvatarOption {
    id: string;
    imageUrl: string;
}

export default function Avatar() {
    const [token, setToken] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarOptions, setAvatarOptions] = useState<AvatarOption[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            getAvatar(storedToken);
            getAllAvatars(storedToken);
        } else {
            window.location.href = "/signin";
        }
    }, []);

    async function getAvatar(authToken: string) {
        const res = await fetch(`${BACKEND_URL}/user/metadata`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            }
        });
        const data = await res.json();
        if (data.avatarUrl) {
            setAvatarUrl(data.avatarUrl);
        }
    }

    async function getAllAvatars(authToken: string) {
        const res = await fetch(`${BACKEND_URL}/avatars`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            }
        });
        const data = await res.json();
        setAvatarOptions(data.avatars);
    }

    async function updateAvatar(avatar: AvatarOption) {
        if (!token) return;

        const res = await fetch(`${BACKEND_URL}/user/metadata`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ avatarId: avatar.id })
        });

        if (res.ok) {
            setAvatarUrl(avatar.imageUrl);
            setIsDialogOpen(false);
        } else {
            console.error("Failed to update avatar");
        }
    }

    return (
        <div className="border rounded-xl shadow-md p-6 mt-9">
            <div className="bg-blue-100 p-4 rounded-md">
                <h2 className="text-lg font-semibold">Avatar</h2>
                <p className="text-sm text-gray-600">
                    Here you can customize your avatar and view your profile.
                </p>
            </div>

            <div className="mt-4 flex flex-col items-center">
                {avatarUrl && (
                    <div
                        className="w-full h-32 bg-no-repeat bg-cover mb-2 rounded-md"
                        style={{
                            backgroundImage: `url(${avatarUrl})`,
                            backgroundPosition: '32px 0',
                            backgroundSize: 'cover',
                        }}
                    ></div>
                )}

                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    {avatarUrl ? "Change Avatar" : "Set Avatar"}
                </button>

                {isDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                            <h3 className="text-lg font-semibold mb-4">Choose an Avatar</h3>
                            <div className="grid grid-cols-4 gap-4 py-2">
                                {avatarOptions.map((avatar) => (
                                    <div
                                        key={avatar.id}
                                        className="w-full h-24 bg-no-repeat bg-cover border border-gray-300 rounded-md cursor-pointer hover:scale-105 transition-transform"
                                        style={{
                                            backgroundImage: `url(${avatar.imageUrl})`,
                                            backgroundPosition: '32px 0',
                                            backgroundSize: 'cover',
                                        }}
                                        onClick={() => updateAvatar(avatar)}
                                    ></div>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
