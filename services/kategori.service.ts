import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { KategoriSampah } from "@/types/kategori";

export async function getKategori(): Promise<ApiResponse<KategoriSampah[]>> {
  const response = await api.get("/api/v1/kategori-sampah");
  return response.data;
}

export async function getKategoriById(
  id: string
): Promise<ApiResponse<KategoriSampah>> {
  const response = await api.get(`/api/v1/kategori-sampah/${id}`);
  return response.data;
}

export async function createKategori(
  data: FormData | any
): Promise<ApiResponse<KategoriSampah>> {
  const response = await api.post("/api/v1/kategori-sampah", data);
  return response.data;
}

export async function updateKategori(
  id: string,
  data: FormData | any
): Promise<ApiResponse<KategoriSampah>> {
  const response = await api.put(`/api/v1/kategori-sampah/${id}`, data);
  return response.data;
}

export async function deleteKategori(id: string): Promise<ApiResponse<any>> {
  const response = await api.delete(`/api/v1/kategori-sampah/${id}`);
  return response.data;
}
