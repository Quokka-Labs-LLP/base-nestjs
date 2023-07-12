export interface AuthPayload {
    userId: string,
}

export interface AuthResponse {
    accessToken: string,
    refreshToken: string,
}