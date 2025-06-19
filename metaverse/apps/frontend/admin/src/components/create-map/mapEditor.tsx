import { ElementInterface, ElementWithPositionInterface } from "@/lib/types";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Phaser from "phaser";
import { BACKEND_URL } from "@/lib/config";

interface MapEditorProps {
  name: string;
  thumbnail: string;
  dimension: string;
}

export function MapEditor({ name, thumbnail, dimension = '800x600' }: MapEditorProps) {
  if (!dimension || typeof dimension !== 'string' || !dimension.includes('x')) {
    console.error('Invalid dimension format:', dimension);
    return null;
  }
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [elements, setElements] = useState<ElementWithPositionInterface[]>([]);
  const [availableElements, setAvailableElements] = useState<ElementInterface[]>([]);
  const gameRef = useRef<Phaser.Game | null>(null);

  // Calculate game dimensions from props
  const [gameWidth, gameHeight] = useMemo(() => {
    const [width, height] = dimension.split('x').map(Number);
    return [width, height];
  }, [dimension]);

  // Remove unused functions
  // const handleElementDrag = (element: ElementWithPositionInterface, x: number, y: number) => {
  //   setElements(prev => 
  //     prev.map(e => 
  //       e.id === element.id ? { ...e, x, y } : e
  //     )
  //   );
  // };

  // Remove unused function
  // const handleElementDrop = useCallback((element: ElementInterface) => {
  //   if (isEditMode) {
  //     const newElement: ElementWithPositionInterface = {
  //       ...element,
  //       x: 400,
  //       y: 400,
  //     };
  //     setElements(prev => [...prev, newElement]);
  //   }
  // }, [isEditMode]);

  const fetchElements = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/elements`);
      const data = await response.json();
      setAvailableElements(data.elements);
    } catch (error) {
      console.error("Failed to fetch elements:", error);
    }
  };

  async function createMap() {
    try {
      // Validate inputs
      if (!name || name.trim() === '') {
        throw new Error('Map name is required');
      }

      // Parse dimension
      const [width, height] = dimension.split('x').map(Number);
      if (!width || !height || width <= 0 || height <= 0) {
        throw new Error('Invalid dimension format. Please use format: WIDTHxHEIGHT');
      }

      // Validate elements
      if (elements.length === 0) {
        throw new Error('At least one element must be added to the map');
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Format the request data
      const mapData = {
        name: name.trim(),
        thumbnail,
        dimension,
        defaultElements: elements.map((element) => ({
          elementId: element.id,
          x: Math.floor(element.x / 32) * 32, // Snap to grid
          y: Math.floor(element.y / 32) * 32,
          static: element.static || false
        }))
      };

      const response = await fetch(`${BACKEND_URL}/admin/map`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mapData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create map");
      }

      const data = await response.json();
      console.log('Map created successfully:', data);
      alert("Map created successfully!");
      setIsEditMode(false); // Exit edit mode after successful creation
    } catch (error) {
      console.error("Failed to create map:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An error occurred while creating the map");
      }
    }
  }

  useEffect(() => {
    fetchElements();
  }, []);

  // Handle element selection
  const handleElementSelect = (element: ElementInterface) => {
    if (!isEditMode) return;
    
    // Create a new element with initial position at the center
    const newElement: ElementWithPositionInterface = {
      ...element,
      x: gameWidth / 2,
      y: gameHeight / 2,
      static: false
    };
    
    setElements(prev => [...prev, newElement]);
  };

  // Handle element drag
  const handleElementDrag = (element: ElementWithPositionInterface, x: number, y: number) => {
    setElements(prev => 
      prev.map(e => 
        e.id === element.id ? { ...e, x, y } : e
      )
    );
  };

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
    // Clean up previous game instance
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const gameWidth = parseInt(dimension.split("x")[0], 10);
    const gameHeight = parseInt(dimension.split("x")[1], 10);

    // Declare variables that will be used across scene methods
    let gridGraphics: Phaser.GameObjects.Graphics | null = null;
    let draggedItem: Phaser.Physics.Arcade.Sprite | null = null;
    const gameElements: Phaser.Physics.Arcade.Sprite[] = [];

    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: 'GameScene' });
      }

      preload() {
        try {
          // Create a simple colored rectangle as fallback floor
          this.load.image('floor', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYSURBVFhH7cEBAQAAAIKg/q92gSAAAJ4ABgMAATJCrJkAAAAASUVORK5CYII=');
          
          // Load element images with error handling
          [...elements, ...availableElements].forEach((item) => {
            if (item.imageUrl && item.name) {
              this.load.image(item.name, item.imageUrl).on('error', (error: any) => {
                console.error(`Failed to load image ${item.name}:`, error);
                // Add a fallback texture if loading fails
                this.load.image(item.name, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYSURBVFhH7cEBAQAAAIKg/q92gSAAAJ4ABgMAATJCrJkAAAAASUVORK5CYII=');
              });
            }
          });
        } catch (error) {
          console.error('Error loading assets:', error);
        }
      }

      create() {
        try {
          // Add white background
          this.add.rectangle(0, 0, gameWidth, gameHeight, 0xffffff).setOrigin(0, 0);
          
          // Add floor tiles with error handling
          for (let i = 0; i < gameWidth; i += 32) {
            for (let j = 0; j < gameHeight; j += 32) {
              try {
                this.add.image(i, j, "floor").setOrigin(0, 0).setDisplaySize(32, 32);
              } catch (error) {
                // If floor image fails, create a simple rectangle
                this.add.rectangle(i, j, 32, 32, 0xf0f0f0).setOrigin(0, 0);
              }
            }
          }
          
          // Initialize grid graphics
          gridGraphics = this.add.graphics();
          
          // Draw initial grid if in edit mode
          this.drawGrid();
          
          // Add existing elements
          this.addElements();
          
        } catch (error) {
          console.error('Error in create:', error);
        }
      }

      drawGrid() {
        if (!gridGraphics) return;
        
        gridGraphics.clear();
        
        if (isEditMode) {
          gridGraphics.lineStyle(1, 0x888888, 0.3);
          const cellSize = 32;

          // Draw vertical lines
          for (let x = 0; x <= gameWidth; x += cellSize) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, gameHeight);
          }
          
          // Draw horizontal lines
          for (let y = 0; y <= gameHeight; y += cellSize) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(gameWidth, y);
          }
          
          gridGraphics.strokePath();
        }
      }

      addElements() {
        // Clear existing game elements
        gameElements.forEach(sprite => sprite.destroy());
        gameElements.length = 0;

        elements.forEach((item) => {
          try {
            // Check if physics is initialized before using it
            if (!this.physics) {
              console.error('Physics not initialized');
              return;
            }

            const element = this.physics.add.sprite(item.x, item.y, item.name);
            element.setData('id', item.id);
            element.setData('static', item.static);
            element.setData('imageUrl', item.imageUrl);
            
            if (item.static) {
              element.setImmovable(true);
            }
            
            if (element.body) {
              element.body.setAllowGravity(false);
            }
            
            element.setDepth(item.y);
            
            if (isEditMode) {
              this.setupDragEvents(element);
            }
            
            gameElements.push(element);
          } catch (error) {
            console.error(`Error adding element ${item.name}:`, error);
          }
        });
      }

      setupDragEvents(sprite: Phaser.Physics.Arcade.Sprite) {
        sprite.setInteractive({ draggable: true });
        
        sprite.on('dragstart', () => {
          draggedItem = sprite;
        });
        
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
            this.updateElementsState();
          }
          draggedItem = null;
        });
      }

      updateElementsState() {
        const updatedElements = gameElements.map(sprite => ({
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

      update() {
        // Redraw grid if needed
        if (gridGraphics) {
          this.drawGrid();
        }
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: "phaser-game",
      backgroundColor: '#ffffff',
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          gravity: { x: 0, y: 0 }
        }
      },
      audio: {
        disableWebAudio: true
      },
      scene: GameScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      pixelArt: true
    };

    try {
      gameRef.current = new Phaser.Game(config);
    } catch (error) {
      console.error('Error creating Phaser game:', error);
    }

    // Cleanup function
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [dimension, isEditMode, elements, availableElements]);

  return (
    <div className="flex flex-col gap-4 mt-8 border-t pt-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        </button>
        {isEditMode && (
          <button
            onClick={createMap}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Map
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div id="phaser-game" className="col-span-3 bg-gray-100 rounded-lg overflow-hidden" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
          e.preventDefault();
          const elementId = e.dataTransfer.getData('elementId');
          const element = availableElements.find(e => e.id === elementId);
          if (element) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / 32) * 32;
            const y = Math.floor((e.clientY - rect.top) / 32) * 32;
            handleElementSelect({ ...element, x, y });
          }
        }}>
          <div className="w-full h-full" />
        </div>

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
              {availableElements && Array.isArray(availableElements) ? availableElements.map((element) => (
                <div
                  key={element.id}
                  className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleElementSelect(element)}
                  draggable={true}
                  onDrag={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.floor((e.clientX - rect.left) / 32) * 32;
                    const y = Math.floor((e.clientY - rect.top) / 32) * 32;
                    handleElementSelect({ ...element, x, y });
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('elementId', element.id);
                  }}
                >
                  <img
                    src={element.imageUrl}
                    alt={element.name}
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                  <div>
                    <div className="font-medium text-white">{element.name}</div>
                    <div className="text-xs text-gray-400">
                      {element.static ? 'Static' : 'Interactive'}
                    </div>
                  </div>
                </div>
              )) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}