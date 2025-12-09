export interface User {
  userId: string
  userName: string
  email: string
  role: "User" | "Admin"
  firstName: string
  lastName: string
  fullName: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    refreshToken: string
    userId: string
    userName: string
    email: string
    role: "User" | "Admin"
    firstName: string
    lastName: string
    fullName: string
    expiresAt: string
  }
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  statusCode?: number
  data?: {
    token: string
    refreshToken: string
    expiresAt: string
  }
}

export enum ReadingStatus {
  NotStarted = 0,
  Reading = 1,
  Completed = 2,
}

export interface Book {
  id: number
  title: string
  author: string
  genre: string
  price: number
  readingStatus: ReadingStatus
  publicationYear: number
  rating?: number
  coverImageUrl?: string
}

export interface CreateBookDTO {
  title: string
  author: string
  genre: string
  price: number
  readingStatus: ReadingStatus
  publicationYear: number
  rating?: number
  coverImageUrl?: string
}

export interface UpdateBookDTO {
  title?: string
  author?: string
  genre?: string
  price?: number
  readingStatus?: ReadingStatus
  publicationYear: number
  rating?: number
  coverImageUrl?: string
}
