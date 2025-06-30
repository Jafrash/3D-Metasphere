import { ElementInterface, ElementWithPositionInterface } from "@/lib/types";
import { useEffect, useState,  useRef, useMemo } from "react";
import Phaser from "phaser";
import { BACKEND_URL } from "@/lib/config";

interface MapEditorProps {
  name: string;
  thumbnailFile?: File;
  dimensions: string;
}

const DEFAULT_DIMENSIONS = { width: 800, height: 600 };

export function MapEditor({ name, thumbnailFile, dimensions }: MapEditorProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [elements, setElements] = useState<ElementWithPositionInterface[]>([]);
  const [availableElements, setAvailableElements] = useState<ElementInterface[]>([]);
  const [base64Thumbnail, setBase64Thumbnail] = useState<string>('');
  const [dimensionError, setDimensionError] = useState<string | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const { width: gameWidth, height: gameHeight } = useMemo(() => {
    if (!dimensions || !dimensions.includes('x')) {
      setDimensionError('Invalid dimension format. Please use format: WIDTHxHEIGHT (e.g., 800x600)');
      return DEFAULT_DIMENSIONS;
    }
    
    const [w, h] = dimensions.split('x').map(Number);
    
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setDimensionError('Dimensions must be positive numbers');
      return DEFAULT_DIMENSIONS;
    }
    
    if (w > 2000 || h > 2000) {
      setDimensionError('Maximum dimension size is 2000x2000');
      return DEFAULT_DIMENSIONS;
    }
    
    setDimensionError(null);
    return { width: w, height: h };
  }, [dimensions]);

  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setBase64Thumbnail(e.target.result as string);
        }
      };
      reader.readAsDataURL(thumbnailFile);
    }
  }, [thumbnailFile]);

  const fetchElements = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/elements`);
      const data = await response.json();
      setAvailableElements(data.elements);
    } catch (error) {
      console.error("Failed to fetch elements:", error);
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  async function createMap() {
    try {
      const trimmedName = name.trim();
      if (!trimmedName) throw new Error('Map name is required');
      if (!base64Thumbnail) throw new Error('Thumbnail is required');
      if (elements.length === 0) throw new Error('Add at least one element');

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const mapData = {
        name: trimmedName,
        base64Thumbnail,
        thumbnail: '',
        dimensions: `${gameWidth}x${gameHeight}`,
        defaultElements: elements.map((e) => ({
          elementId: e.id,
          x: Math.floor(e.x / 32) * 32,
          y: Math.floor(e.y / 32),
          static: e.static || false
        }))
      };

      const res = await fetch(`${BACKEND_URL}/admin/map`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(mapData),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create map");
      }

      const data = await res.json();
      console.log("Map created:", data);
      alert("Map created successfully!");
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unexpected error");
    }
  }

  const handleElementSelect = (element: ElementInterface) => {
    if (!isEditMode) return;
    const newElement: ElementWithPositionInterface = {
      ...element,
      x: gameWidth / 2,
      y: gameHeight / 2,
      static: false,
    };
    setElements(prev => [...prev, newElement]);
  };

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    let gridGraphics: Phaser.GameObjects.Graphics | null = null;
    let draggedItem: Phaser.Physics.Arcade.Sprite | null = null;
    const gameElements: Phaser.Physics.Arcade.Sprite[] = [];

    class GameScene extends Phaser.Scene {
      constructor() {
        super("GameScene");
      }

      preload() {
        this.load.image("floor", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYSURBVFhH7cEBAQAAAIKg/q92gSAAAJ4ABgMAATJCrJkAAAAASUVORK5CYII=");
        [...elements, ...availableElements].forEach((item) => {
          if (item.imageUrl && item.name) {
            this.load.image(item.name, item.imageUrl);
          }
        });

        if (base64Thumbnail) {
          this.load.image("thumbnail", base64Thumbnail);
        }
      }

      create() {
        this.add.rectangle(0, 0, gameWidth, gameHeight, 0xffffff).setOrigin(0, 0);
        for (let x = 0; x < gameWidth; x += 32) {
          for (let y = 0; y < gameHeight; y += 32) {
            this.add.image(x, y, "floor").setOrigin(0, 0).setDisplaySize(32, 32);
          }
        }

        gridGraphics = this.add.graphics();
        this.drawGrid();
        this.addElements();
      }

      drawGrid() {
        if (!gridGraphics) return;
        gridGraphics.clear();
        if (!isEditMode) return;

        gridGraphics.lineStyle(1, 0x888888, 0.3);
        for (let x = 0; x <= gameWidth; x += 32) {
          gridGraphics.moveTo(x, 0);
          gridGraphics.lineTo(x, gameHeight);
        }
        for (let y = 0; y <= gameHeight; y += 32) {
          gridGraphics.moveTo(0, y);
          gridGraphics.lineTo(gameWidth, y);
        }
        gridGraphics.strokePath();
      }

      addElements() {
        gameElements.forEach(sprite => sprite.destroy());
        gameElements.length = 0;

        elements.forEach((item) => {
          const sprite = this.physics.add.sprite(item.x, item.y, item.name);
          sprite.setData("id", item.id);
          sprite.setData("static", item.static);
          sprite.setData("imageUrl", item.imageUrl);

          if (item.static) sprite.setImmovable(true);
          sprite.body?.setAllowGravity(false);
          sprite.setDepth(item.y);
          if (isEditMode) this.setupDrag(sprite);
          gameElements.push(sprite);
        });
      }

      setupDrag(sprite: Phaser.Physics.Arcade.Sprite) {
        sprite.setInteractive({ draggable: true });

        sprite.on("dragstart", () => {
          draggedItem = sprite;
        });

        sprite.on("drag", (pointer: Phaser.Input.Pointer) => {
          if (!draggedItem) return;
          const x = Math.round(pointer.x / 32) * 32;
          const y = Math.round(pointer.y / 32) * 32;
          draggedItem.setPosition(x, y);
        });

        sprite.on("dragend", () => {
          if (draggedItem) this.syncElements();
          draggedItem = null;
        });
      }

      syncElements() {
        const updated = gameElements.map(sprite => ({
          id: sprite.getData("id"),
          name: sprite.texture.key,
          imageUrl: sprite.getData("imageUrl"),
          static: sprite.getData("static"),
          width: sprite.width,
          height: sprite.height,
          x: sprite.x,
          y: sprite.y
        }));
        setElements(updated);
      }

      update() {
        this.drawGrid();
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: "phaser-game",
      backgroundColor: "#ffffff",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          gravity: { x: 0, y: 0 }
        }
      },
      audio: { disableWebAudio: true },
      scene: GameScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      pixelArt: true
    };

    try {
      gameRef.current = new Phaser.Game(config);
    } catch (err) {
      console.error("Phaser init error:", err);
    }

    }, [dimensions, isEditMode, elements, availableElements, base64Thumbnail]);

  return (
    <div className="w-full h-full flex flex-col">
      {dimensionError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Invalid Dimensions</p>
          <p>{dimensionError} Using default: {DEFAULT_DIMENSIONS.width}x{DEFAULT_DIMENSIONS.height}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-gray-600">
            Canvas: {gameWidth} x {gameHeight} px
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-md ${
              isEditMode ? 'bg-gray-200' : 'bg-blue-500 text-white'
            }`}
          >
            {isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
          </button>
          {isEditMode && (
            <button
              onClick={createMap}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save Map
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1">
        <div
          id="phaser-game"
          className="col-span-3 bg-gray-100 rounded-lg overflow-hidden border border-gray-300"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const elementId = e.dataTransfer.getData("elementId");
            const element = availableElements.find(el => el.id === elementId);
            if (element) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.floor((e.clientX - rect.left) / 32) * 32;
              const y = Math.floor((e.clientY - rect.top) / 32) * 32;
              handleElementSelect({ ...element, x, y });
            }
          }}
        >
          <div className="w-full h-full" />
        </div>

        {isEditMode && (
          <div className="w-64 bg-gray-800 p-4 overflow-y-auto rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">Available Elements</h2>
            <div className="space-y-2">
              {availableElements.map((element) => (
                <div
                  key={element.id}
                  className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleElementSelect(element)}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("elementId", element.id)}
                >
                  <img
                    src={element.imageUrl}
                    alt={element.name}
                    className="w-8 h-8 rounded"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div>
                    <div className="font-medium text-white">{element.name}</div>
                    <div className="text-xs text-gray-400">
                      {element.static ? "Static" : "Interactive"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
