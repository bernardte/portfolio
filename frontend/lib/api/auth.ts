import { apiClient } from "./client";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string,
    email: string,
    password: string,
}

export function login(data: LoginRequest){
    return apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export function register(data: RegisterRequest){
    return apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export function logout(){
    return apiClient("/auth/logout", {
        method: "POST"
    })
}