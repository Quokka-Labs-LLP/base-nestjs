export interface AuthPayload {
    userId: string,
    email: string
}

export interface AuthResponse {
    accessToken: string,
    refreshToken: string,
}