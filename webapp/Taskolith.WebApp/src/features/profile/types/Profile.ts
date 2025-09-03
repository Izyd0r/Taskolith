export interface UpdateProfileRequest {
    username?: string
    email?: string
    password?: string
}

export interface UserProfileResponse {
    userId: string
    username: string
    email: string
}
