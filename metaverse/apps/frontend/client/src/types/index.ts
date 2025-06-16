export interface User {
  id: string
  username: string
  avatarId: string | null
  role: 'User' | 'Admin'
}

export interface Space {
  id: string
  name: string
  width: number
  height: number
  thumbnail: string | null
  creatorId: string
}

export interface Element {
  id: string
  width: number
  height: number
  static: boolean
  imageUrl: string
}

export interface Position {
  x: number
  y: number
}

export interface Player {
  id: string
  position: Position
  avatarId: string | null
}
