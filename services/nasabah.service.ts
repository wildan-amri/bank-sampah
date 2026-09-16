import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { NasabahItem } from "@/types/nasabah";

export async function getNasabah(): Promise<ApiResponse<NasabahItem[]>> {
  const response = await api.get("/api/v1/admin/nasabah");
  return response.data;
}

export async function getNasabahById(
  id: string
): Promise<ApiResponse<NasabahItem>> {
  const response = await api.get(`/api/v1/admin/nasabah/${id}`);
  return response.data;
}

export async function createNasabah(
  data: FormData | any
): Promise<ApiResponse<NasabahItem>> {
  const response = await api.post("/api/v1/admin/nasabah", data);
  return response.data;
}

export async function updateNasabah(
  id: string,
  data: FormData | any
): Promise<ApiResponse<NasabahItem>> {
  const response = await api.put(`/api/v1/admin/nasabah/${id}`, data);
  return response.data;
}

export async function deleteNasabah(
  id: string
): Promise<ApiResponse<any>> {
  const response = await api.delete(`/api/v1/admin/nasabah/${id}`);
  return response.data;
}