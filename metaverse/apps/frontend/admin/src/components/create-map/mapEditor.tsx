import { ElementInterface, ElementWithPositionInterface } from "../../lib/types"
import { useEffect, useState, useCallback } from "react";
import Phaser from "phaser";
import { BACKEND_URL } from "../../lib/config";
import { useNavigate } from "react-router-dom";

interface MapEditorProps {
  width: number;
  height: number;
  onMapDataChange: (data: any) => void;
}

export function MapEditor({ width, height, onMapDataChange }: MapEditorProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [elements, setElements] = useState<ElementWithPositionInterface[]>([]);
  const [availableElements, setAvailableElements] = useState<ElementInterface[]>([]);
  const navigate = useNavigate();

  const fetchElements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${BACKEND_URL}/admin/elements`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.elements) {
        setAvailableElements(data.elements);
      } else {
        console.error('Invalid response format:', data);
        setAvailableElements([]);
      }
    } catch (error) {
      console.error("Failed to fetch elements:", error);
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  const handleElementDrop = useCallback((element: ElementInterface) => {
    if (isEditMode) {
      const newElement: ElementWithPositionInterface = {
        ...element,
        x: 400,
        y: 400,
      };
      setElements(prev => [...prev, newElement]);
    }
  }, [isEditMode]);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width,
      height,
      backgroundColor: '#ffffff',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false
        }
      },
      scene: {
        preload: function(this: Phaser.Scene) {
          this.load.image('floor', '/assets/floor.png');
        },
        create: function(this: Phaser.Scene) {
          const width = config.width as number;
          const height = config.height as number;
          
          // Add white background
          this.add.rectangle(0, 0, width, height, 0xffffff).setOrigin(0, 0);
          
          // Add floor
          this.add.image(0, 0, 'floor').setOrigin(0, 0);
          drawGrid.call(this);

          elements.forEach((item) => {
            const element = this.physics.add.sprite(item.x, item.y, item.name);
            element.setData('id', item.id);
            element.setData('static', item.static);
            element.setData('imageUrl', item.imageUrl);
            if (item.static) element.setImmovable(true);
            element.body.setAllowGravity(false);
            element.setDepth(item.y);
            if (isEditMode) setupDragEvents(element);
          });
        },
        update: function(this: Phaser.Scene) {
          drawGrid.call(this);
        }
      }
    };

    const game = new Phaser.Game(config);
    const scene = game.scene.getScene('Scene');

    let gridGraphics: Phaser.GameObjects.Graphics;
    let draggedItem: Phaser.Physics.Arcade.Sprite | null = null;

    // Create game elements array
    const gameElements: Phaser.Physics.Arcade.Sprite[] = [];

    const bodies = scene.physics.world.bodies as Phaser.Structs.Set<Phaser.Physics.Arcade.Body>;
    const sprites: Phaser.Physics.Arcade.Sprite[] = [];
    if (bodies) {
      const bodyArray = Array.from(bodies as any);
      bodyArray.forEach((body: any) => {
        const sprite = body.gameObject as Phaser.Physics.Arcade.Sprite;
        sprites.push(sprite);
        gameElements.push(sprite);
      });
      setElements(sprites.map(sprite => ({
        id: sprite.getData('id'),
        name: sprite.texture.key,
        imageUrl: sprite.getData('imageUrl'),
        static: sprite.getData('static'),
        width: sprite.width,
        height: sprite.height,
        x: sprite.x,
        y: sprite.y,
      })));
    }

    function drawGrid(this: Phaser.Scene) {
      if (gridGraphics) gridGraphics.clear();
      else gridGraphics = this.add.graphics();

      if (isEditMode) {
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
      }
    }

    function setupDragEvents(sprite: Phaser.Physics.Arcade.Sprite) {
      sprite.setInteractive({ draggable: true });
      sprite.on('dragstart', () => { draggedItem = sprite; });
      sprite.on('drag', (pointer: Phaser.Input.Pointer) => {
        if (draggedItem && isEditMode) {
          const gridSize = 32;
          const x = Math.round(pointer.x / gridSize) * gridSize;
          const y = Math.round(pointer.y / gridSize) * gridSize;
          draggedItem.setPosition(x, y);
        }
      });
      sprite.on('dragend', () => {
        if (draggedItem && isEditMode) {
          const updatedElements = sprites.map(sprite => ({
            id: sprite.getData('id'),
            name: sprite.texture.key,
            imageUrl: sprite.getData('imageUrl'),
            static: sprite.getData('static'),
            width: sprite.width,
            height: sprite.height,
            x: sprite.x,
            y: sprite.y,
          }));
          setElements(updatedElements);
        }
        draggedItem = null;
      });
    }

    return () => {
      try {
        game.destroy(true);
      } catch (error) {
        console.error("Error destroying Phaser game:", error);
      }
    };
  }, [isEditMode, elements, availableElements]);

  return (
    <div className="flex flex-col gap-4 mt-8 border-t pt-4">
      <div className="space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${isEditMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition`}
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        </button>
        {!isEditMode && elements.length !== 0 && (
          <button
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
            onClick={() => {
              onMapDataChange({
                elements,
                width,
                height
              });
            }}
          >
            Save Map
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div id="phaser-game" className="p-3 col-span-3 bg-gray-100 rounded-lg overflow-scroll" style={{ width, height }} />

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
                  className={`relative bg-gray-700 p-4 rounded cursor-pointer hover:bg-gray-600 transition-colors border-2 ${element.static ? 'border-red-500' : 'border-green-500'}`}
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
