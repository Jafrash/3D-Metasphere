import { ElementWithPositionInterface, MapElementInterface } from "../../types"
import { useEffect, useState } from "react";
import Phaser from "phaser";
import { BACKEND_URL } from "../../lib/config"
import  Navbar  from "../nav/navbar";

export function MapViaId({ id }: { id: string }) {
    const [elements, setElements] = useState<ElementWithPositionInterface[]>([]);
    const [dimension, setDimension] = useState("");
    const [name, setName] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    const fetchMap = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/admin/map/${id}`, {
                headers: {
                    content: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setElements(
                data.mapElements.map((element: MapElementInterface) => ({
                    ...element.element,
                    x: element.x,
                    y: element.y,
                }))
            );
            setDimension(`${data.width}x${data.height}`);
            setThumbnail(data.thumbnail);
        } catch (error) {
            console.error("Failed to fetch map:", error);
        }
    };

    async function createSpace() {
        const res = await fetch(`${BACKEND_URL}/space`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                name,
                dimension,
                mapId: id,
                thumbnail,
            }),
        });

        const data = await res.json();
        alert(data.spaceId ? "Space created successfully" : "Failed to create space");
    }

    useEffect(() => {
        fetchMap();
    }, []);

    useEffect(() => {
        if (!dimension) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: parseInt(dimension.split("x")[0]),
            height: parseInt(dimension.split("x")[1]),
            parent: "phaser-game",
            physics: {
                default: "arcade",
                arcade: { debug: false },
            },
            scene: {
                preload,
                create,
            },
        };

        const game = new Phaser.Game(config);

        function preload(this: Phaser.Scene) {
            this.load.image("floor", "/assets/floor.png");
            elements.forEach((item) => {
                this.load.image(item.name, item.imageUrl);
            });
        }

        function create(this: Phaser.Scene) {
            const width = config.width as number;
            const height = config.height as number;

            for (let i = 0; i <= width; i += 32) {
                for (let j = 0; j <= height; j += 32) {
                    this.add.image(i, j, "floor");
                }
            }

            elements.forEach((item) => {
                const element = this.physics.add.sprite(item.x, item.y, item.name);
                element.setImmovable(true);
                element.body.setAllowGravity(false);
                element.setDepth(item.y);
            });
        }

        return () => {
            game.destroy(true);
        };
    }, [elements, dimension]);

    const isButtonDisabled = !name || !dimension || !thumbnail;

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
            <header className="relative overflow-hidden">
                <Navbar />
                <div className="container mx-auto px-4 flex flex-row gap-2 lg:px-8">
                    <div className="mt-9 w-full border rounded-xl shadow-md bg-white">
                        <div className="border-b bg-indigo-50 px-6 py-4 rounded-t-xl">
                            <h2 className="text-xl font-semibold text-gray-800">View Map</h2>
                            <p className="text-sm text-gray-600">Enter the map name to save</p>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Map Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter map name (e.g., New Map)"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div
                                    id="phaser-game"
                                    className="bg-indigo-100 border border-gray-300 rounded-lg overflow-scroll w-full"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t">
                            <button
                                onClick={createSpace}
                                disabled={isButtonDisabled}
                                className={`w-full px-4 py-2 rounded-md text-white transition-colors ${
                                    isButtonDisabled
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                Create Space
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
