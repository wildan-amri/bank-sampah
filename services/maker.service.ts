import axios from "axios";
import { api, API_BASE_URL } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  RegisterMakerDto,
  LoginMakerDto,
  MakerData,
} from "@/types/auth";

export async function registerMaker(
  payload: RegisterMakerDto
): Promise<ApiResponse<MakerData>> {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/maker/register`,
    payload
  );
  return response.data;
}

export async function loginMaker(
  payload: LoginMakerDto
): Promise<ApiResponse<MakerData>> {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/maker/login`,
    payload
  );
  return response.data;
}

export async function getMakerProfile(): Promise<ApiResponse<MakerData>> {
  const response = await api.get("/api/v1/maker/profile");
  return response.data;
}

export async function checkMakerKey(
  email: string
): Promise<ApiResponse<{ email: string; namaSiswa: string; namaApp: string; appKey: string }>> {
  const response = await axios.get(
    `${API_BASE_URL}/api/v1/maker/check-key`,
    {
      params: { email },
    }
  );
  return response.data;
}

export async function seedDummyData(): Promise<ApiResponse<any>> {
  const response = await api.post("/api/v1/seed");
  return response.data;
}