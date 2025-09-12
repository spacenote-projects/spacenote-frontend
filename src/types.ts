export interface User {
  id: string // UUID
  username: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  authToken: string
}
