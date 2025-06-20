import { ElementInterface, ElementWithPositionInterface, MapElementInterface } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import Phaser from "phaser";
import { BACKEND_URL } from "@/lib/config";

export function MapViaId({ id }: { id: string }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [elements, setElements] = useState<ElementWithPositionInterface[]>([]);
    const [availableElements, setAvailableElements] = useState<ElementInterface[]>([]);
    const [dimension, setDimension] = useState("");

    const fetchMap = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/admin/map/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }

            const data = await response.json();
            if (!data || !data.mapElements || !data.width || !data.height) {
                throw new Error('Invalid map data format');
            }

            setElements(data.mapElements.map((element: MapElementInterface) => ({
                ...element.element,
                x: element.x,
                y: element.y
            })));
            setDimension(`${data.width}x${data.height}`);
        } catch (error) {
            console.error("Failed to fetch map:", error);
            alert(error instanceof Error ? error.message : 'Unknown error occurred');
            return null;
        }
    };

    const fetchElements = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/elements`);
            const data = await response.json();
            setAvailableElements(data.elements);
        } catch (error) {
            console.error("Failed to fetch elements:", error);
        }
    };

    async function updateMap() {
        try {
            const response = await fetch(`${BACKEND_URL}/admin/map/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    defaultElements: elements.map((element) => ({
                        elementId: element.id,
                        x: element.x,
                        y: element.y,
                    })),
                }),
            });
            const data = await response.json();
            console.log(data);
            alert("Map updated successfully");
        } catch (error) {
            console.error("Failed to update map:", error);
            alert("Failed to update map");
        }
    }

    useEffect(() => {
        fetchMap();
        fetchElements();
    }, []);

    const handleElementDrop = useCallback((element: ElementInterface) => {
        if (isEditMode) {
            const newElement: ElementWithPositionInterface = {
                ...element,
                x: parseInt(dimension.split("x")[0]) / 2,
                y: parseInt(dimension.split("x")[1]) / 2,
            };
            setElements(prev => [...prev, newElement]);
        }
    }, [isEditMode, dimension]);

    useEffect(() => {
        if (!id || !dimension) {
            return;
        }

        try {
            const [width, height] = dimension.split('x').map(Number);
            if (isNaN(width) || isNaN(height)) {
                throw new Error('Invalid dimension format');
            }

            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width,
                height,
                parent: "phaser-game",
                backgroundColor: 0x000000,
                physics: {
                    default: "arcade",
                    arcade: {
                        debug: false,
                        gravity: { x: 0, y: 0 },
                        fixedStep: true
                    }
                },
                audio: {
                    disableWebAudio: true
                },
                render: {
                    pixelArt: true,
                    antialias: false,
                    roundPixels: true,
                    transparent: false
                },
                scene: {
                    preload: function(this: Phaser.Scene) {
                        try {
                            this.load.image("floor", "/assets/floor.png");
                            [...elements, ...availableElements].forEach((item: ElementInterface) => {
                                this.load.image(item.name, item.imageUrl);
                            });
                        } catch (error) {
                            console.error('Failed to load assets:', error);
                        }
                    },
                    create: function(this: Phaser.Scene) {
                        try {
                            const width = config.width as number;
                            const height = config.height as number;
                            const gameElements: Phaser.Physics.Arcade.Sprite[] = [];

                            // Draw floor tiles
                            for (let i = 0; i <= width; i += 32) {
                                for (let j = 0; j <= height; j += 32) {
                                    this.add.image(i, j, "floor").setOrigin(0);
                                }
                            }

                            // Create elements
                            elements.forEach((item: ElementWithPositionInterface) => {
                                const element = this.physics.add.sprite(item.x, item.y, item.name);
                                element.setData('id', item.id);
                                element.setData('static', item.static);
                                element.setData('imageUrl', item.imageUrl);
                                element.setOrigin(0);

                                if (item.static) {
                                    element.setImmovable(true);
                                }
                                element.body.setAllowGravity(false);
                                element.setDepth(item.y);

                                if (isEditMode) {
                                    element.setInteractive({ draggable: true });
                                    element.on('dragstart', function () {
                                        element.setData('dragging', true);
                                    });
                                    element.on('drag', function (pointer: Phaser.Input.Pointer) {
                                        if (element.getData('dragging') && isEditMode) {
                                            const gridSize = 32;
                                            const x = Math.round(pointer.x / gridSize) * gridSize;
                                            const y = Math.round(pointer.y / gridSize) * gridSize;
                                            element.setPosition(x, y);
                                        }
                                    });
                                    element.on('dragend', function () {
                                        if (element.getData('dragging') && isEditMode) {
                                            const updatedElements = gameElements.map(sprite => ({
                                                id: sprite.getData('id'),
                                                name: sprite.texture.key,
                                                imageUrl: sprite.getData('imageUrl'),
                                                static: sprite.getData('static'),
                                                width: sprite.width,
                                                height: sprite.height,
                                                x: sprite.x,
                                                y: sprite.y
                                            }));
                                            setElements(updatedElements);
                                        }
                                        element.setData('dragging', false);
                                    });
                                }
                                gameElements.push(element);
                            });

                            // Draw grid
                            const gridGraphics = this.add.graphics();
                            if (isEditMode) {
                                gridGraphics.lineStyle(1, 0xffffff, 0.3);
                                const cellSize = 32;

                                for (let x = 0; x <= width; x += cellSize) {
                                    gridGraphics.moveTo(x, 0);
                                    gridGraphics.lineTo(x, height);
                                }

                                for (let y = 0; y <= height; y += cellSize) {
                                    gridGraphics.moveTo(0, y);
                                    gridGraphics.lineTo(width, y);
                                }

                                gridGraphics.strokePath();
                            }
                        } catch (error) {
                            console.error('Failed to create scene:', error);
                        }
                    },
                    update: function(this: Phaser.Scene) {
                        if (isEditMode) {
                            try {
                                const gridGraphics = this.add.graphics();
                                gridGraphics.lineStyle(1, 0xffffff, 0.3);
                                const cellSize = 32;
                                const width = config.width as number;
                                const height = config.height as number;

                                for (let x = 0; x <= width; x += cellSize) {
                                    gridGraphics.moveTo(x, 0);
                                    gridGraphics.lineTo(x, height);
                                }

                                for (let y = 0; y <= height; y += cellSize) {
                                    gridGraphics.moveTo(0, y);
                                    gridGraphics.lineTo(width, y);
                                }

                                gridGraphics.strokePath();
                            } catch (error) {
                                console.error('Failed to update scene:', error);
                            }
                        }
                    }
                }
            };

            const game = new Phaser.Game(config);

            return () => {
                try {
                    if (game) {
                        game.destroy(true);
                    }
                } catch (error) {
                    console.error('Failed to destroy game:', error);
                }
            };
        } catch (error) {
            console.error('Failed to initialize Phaser:', error);
            return () => {};
        }
    }, [id, dimension, isEditMode, elements, availableElements]);

    return (
        <div className="flex flex-col gap-4">
            <div className="space-x-4">
                <button
                    className={`px-4 py-2 rounded ${isEditMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
                    onClick={() => setIsEditMode(!isEditMode)}
                >
                    {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                </button>
                {!isEditMode && (elements.length !== 0) && (
                    <button
                        className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                        onClick={updateMap}
                    >
                        Update Map
                    </button>
                )}
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div id="phaser-game" className="p-3 col-span-3 bg-gray-800 rounded-lg overflow-scroll" />

                {isEditMode && (
                    <div className="w-64 bg-gray-800 p-4 overflow-y-auto col-span-1 rounded-lg">
                        <h2 className="text-xl font-bold text-white mb-4">Available Elements</h2>
                        <div className="text-sm text-gray-300 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>Walkable (player can move through)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>Obstacle (blocks player movement)</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {availableElements.map((element) => (
                                <div
                                    key={element.id}
                                    className={`relative bg-gray-700 p-4 rounded cursor-pointer hover:bg-gray-600 transition-colors ${element.static ? 'border-red-500' : 'border-green-500'} border-2`}
                                    onClick={() => handleElementDrop(element)}
                                >
                                    <div
                                        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${element.static ? 'bg-red-500' : 'bg-green-500'}`}
                                    />
                                    <img
                                        src={element.imageUrl}
                                        alt={element.name}
                                        className="w-full h-32 object-contain mb-2"
                                    />
                                    <p className="text-white text-center">{element.name}</p>
                                    <p className="text-gray-400 text-xs text-center mt-1">
                                        {element.static ? 'Blocks movement' : 'Walkable'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
