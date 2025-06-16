export interface Element {
  id: string
  name: string
  width: number
  height: number
  static: boolean
  imageUrl: string
}

export interface Space {
  id: string
  name: string
  width: number
  height: number
  thumbnail: string | null
  creatorId: string
}

export interface User {
  id: string
  username: string
  avatarId: string | null
  role: 'User' | 'Admin'
}
