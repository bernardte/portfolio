import { apiClient } from "./client";
import { ProfileInformationRequest, ProfileInformationResponse, updateProfileInformationRequest } from "../interface/profile.interface";

export function createProfileDetail(data: ProfileInformationRequest){
    return apiClient("/profile", {
        method: "POST",
        body: JSON.stringify(data)
    })
}

export function updateProfileDetail(profileId: string, data: updateProfileInformationRequest){
    return apiClient(`/profile/${profileId}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    })
}

export function fetchProfile(): Promise<ProfileInformationResponse>{
    return apiClient("/profile", {
        method: "GET"
    })
}
