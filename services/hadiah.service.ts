import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Hadiah } from "@/types/hadiah";

export async function getHadiah(): Promise<ApiResponse<Hadiah[]>> {
  const response = await api.get("/api/v1/hadiah");
  return response.data;
}

export async function getHadiahById(id: string): Promise<ApiResponse<Hadiah>> {
  const response = await api.get(`/api/v1/hadiah/${id}`);
  return response.data;
}

export async function createHadiah(
  data: FormData | any
): Promise<ApiResponse<Hadiah>> {
  const response = await api.post("/api/v1/hadiah", data);
  return response.data;
}

export async function updateHadiah(
  id: string,
  data: FormData | any
): Promise<ApiResponse<Hadiah>> {
  const response = await api.put(`/api/v1/hadiah/${id}`, data);
  return response.data;
}

export async function deleteHadiah(id: string): Promise<ApiResponse<any>> {
  const response = await api.delete(`/api/v1/hadiah/${id}`);
  return response.data;
}
