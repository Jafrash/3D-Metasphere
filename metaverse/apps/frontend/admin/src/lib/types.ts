// Interface for game elements
export interface ElementInterface {
    id: string;
    name: string;
    imageUrl: string;
    width: number;
    height: number;
    static: boolean;
}

// Element with position information
export interface ElementWithPositionInterface extends ElementInterface {
    x: number;
    y: number;
}

// Interface for elements placed on a map
export interface MapElementInterface {
    id: string;
    x: number;
    y: number;
    element: ElementInterface;
}

// Interface for map data
export interface MapInterface {
    id: string;
    name: string;
    thumbnail: string;
    height: number;
    width: number;
    mapElements: MapElementInterface[];
}

// Interface for space data
export interface SpaceInterface {
    id: string;
    name: string;
    width: number;
    height: number;
    elements: MapElementInterface[];
}

// Interface for avatar data
export interface AvatarInterface {
    id: string;
    name: string;
    imageUrl: string;
}
