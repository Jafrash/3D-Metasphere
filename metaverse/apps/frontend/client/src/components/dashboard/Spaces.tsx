import { BACKEND_URL } from '../../lib/config';
import { useEffect, useState } from 'react';
import { SpaceCardProps } from '../../lib/types';
import { useNavigate } from 'react-router-dom';

export default function Spaces() {
    const navigate = useNavigate();
    const [spaces, setSpaces] = useState<SpaceCardProps[]>([]);

    async function fetchSpaces() {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await fetch(`${BACKEND_URL}/space/all`, {
            method: "GET",
            headers: {
                contentType: "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        const jsonData = await data.json();
        console.log(jsonData);
        setSpaces(jsonData.spaces);
    }

    useEffect(() => {
        fetchSpaces();
    }, []);

    return (
        <div className="border rounded-xl shadow-md p-6 mt-9 w-full">
            <div className="bg-blue-100 p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Your Spaces</h2>
                    <p className="text-sm text-gray-600">
                        Here are the virtual spaces you have created. You can create new spaces and manage them here.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/new-space')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Create New Space
                </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {spaces.length === 0 && (
                    <div className="text-center col-span-3 h-full border-2 border-dashed border-blue-200 rounded-lg p-4">
                        <h2 className="text-blue-500">
                            You have not created any spaces yet.
                        </h2>
                    </div>
                )}
                {spaces.map(space => <SpaceCard key={space.id} {...space} />)}
            </div>
        </div>
    );
}

function SpaceCard({ ...props }: SpaceCardProps) {
    return (
        <div className="shadow-lg border rounded-lg p-4 flex flex-col justify-between h-full">
            <div>
                <img
                    src={props.thumbnail || "https://via.placeholder.com/150"}
                    alt={props.id}
                    className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold mb-1">{props.name}</h3>
                <p className="text-sm text-gray-500">
                    {props.width}x{props.height}
                </p>
            </div>
            <div className="flex flex-row justify-between mt-4">
                <button
                    onClick={() => { window.location.href = `/space/${props.id}` }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                    Open
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                    Delete
                </button>
            </div>
        </div>
    );
}
