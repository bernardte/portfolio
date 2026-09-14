import { User } from "../interface/user.interface";
import { apiClient } from "./client";

export async function fetchUserApi(): Promise<User> {
  return apiClient("/auth", {
    method: "GET"
  });
}
