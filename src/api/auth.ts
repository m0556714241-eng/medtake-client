import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types"
import { api } from "./api"

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
}

export async function getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
}
