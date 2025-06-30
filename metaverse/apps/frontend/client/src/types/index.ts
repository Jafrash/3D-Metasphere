export interface User {
  id: string;
  username: string;
  avatarId: string | null;
  role: 'User' | 'Admin';
  email?: string;
  name?: string;
  avatarUrl?: string;
}

export interface Space {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnail: string | null;
  creatorId: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Element {
  id: string;
  width: number;
  height: number;
  static: boolean;
  imageUrl: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  [key: string]: any; // For any additional properties
}

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  position: Position;
  avatarId: string | null;
  name?: string;
  userName?: string;
  avatarUrl?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  isTyping?: boolean;
  lastActive?: string;
}

export interface Avatar {
  id: string;
  name: string;
  avatarUrl: string;
  userId: string;
  isDefault: boolean;
}

export interface MapElementInterface {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  [key: string]: any;
}

export interface SpaceElement {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  [key: string]: any;
}

export interface OtherUser extends Player {
  userId: string;
  userName: string;
  x: number;
  y: number;
  position: Position;
  // Other properties can be added as needed
}

export interface ElementWithPositionInterface {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  [key: string]: any;
}

export interface AvatarInterface extends Avatar {}

export interface SpaceCardProps {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  creator?: string;
  createdAt?: string;
  updatedAt?: string;
  width: number;
  height: number;
}

export interface MapInterface {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  width: number;
  height: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpaceElementsState {
  [key: string]: SpaceElement;
}
