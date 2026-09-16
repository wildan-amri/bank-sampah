import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  LoginUserDto,
  RegisterNasabahDto,
  RegisterAdminDto,
  UserAuthData,
} from "@/types/auth";

export async function loginUser(
  payload: LoginUserDto
): Promise<ApiResponse<UserAuthData>> {
  const response = await api.post("/api/v1/auth/login", payload);
  return response.data;
}

export async function registerNasabah(
  payload: FormData | RegisterNasabahDto
): Promise<ApiResponse<UserAuthData>> {
  const response = await api.post("/api/v1/auth/nasabah/register", payload);
  return response.data;
}

export async function registerAdmin(
  payload: RegisterAdminDto
): Promise<ApiResponse<UserAuthData>> {
  const response = await api.post("/api/v1/auth/admin/register", payload);
  return response.data;
}

export async function getMe(): Promise<ApiResponse<UserAuthData>> {
  const response = await api.get("/api/v1/auth/me");
  return response.data;
}
