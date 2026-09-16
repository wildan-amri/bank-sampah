import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  CreateSetorSampahDto,
  SetorTransaksi,
  VerifySetorSampahDto,
} from "@/types/setor";

// Nasabah: Ajukan Penyetoran Sampah
export async function ajukanSetoran(
  data: CreateSetorSampahDto
): Promise<ApiResponse<SetorTransaksi>> {
  const response = await api.post("/api/v1/setor-sampah/pengajuan", data);
  return response.data;
}

// Nasabah: Histori Penyetoran Sendiri
export async function getMySetoran(
  bulan?: string
): Promise<ApiResponse<SetorTransaksi[]>> {
  const response = await api.get("/api/v1/setor-sampah/my-setor", {
    params: bulan ? { bulan } : undefined,
  });
  return response.data;
}

// Nasabah & Admin: Get Detail Transaksi / Struk Nota Penyetoran
export async function getDetailSetoran(
  id: string
): Promise<ApiResponse<SetorTransaksi>> {
  const response = await api.get(`/api/v1/setor-sampah/${id}`);
  return response.data;
}

// Admin: Get Seluruh Pengajuan Penyetoran Sampah
export async function getAdminSetoranList(params?: {
  status?: string;
  bulan?: string;
}): Promise<ApiResponse<SetorTransaksi[]>> {
  const cleanParams: Record<string, string> = {};
  if (params?.status) cleanParams.status = params.status;
  if (params?.bulan) cleanParams.bulan = params.bulan;

  const response = await api.get("/api/v1/setor-sampah/admin/list", {
    params: cleanParams,
  });
  return response.data;
}

// Admin: Konfirmasi & Verifikasi Penimbangan Real Sampah
export async function verifySetoran(
  id: string,
  data: VerifySetorSampahDto
): Promise<ApiResponse<SetorTransaksi>> {
  const response = await api.put(
    `/api/v1/setor-sampah/admin/verify/${id}`,
    data
  );
  return response.data;
}
