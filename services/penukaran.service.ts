import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { PenukaranTransaksi } from "@/types/penukaran";

// Nasabah: Tukar Poin dengan Hadiah
export async function tukarPoin(
  hadiahId: string
): Promise<ApiResponse<PenukaranTransaksi>> {
  const response = await api.post("/api/v1/penukaran-poin/tukar", {
    hadiahId,
  });
  return response.data;
}

// Nasabah: Histori Penukaran Poin Milik Sendiri
export async function getMyPenukaran(): Promise<
  ApiResponse<PenukaranTransaksi[]>
> {
  const response = await api.get("/api/v1/penukaran-poin/my-penukaran");
  return response.data;
}

// Nasabah & Admin: Detail Nota / Struk Bukti Transaksi Penukaran
export async function getNotaPenukaran(
  id: string
): Promise<ApiResponse<PenukaranTransaksi>> {
  const response = await api.get(`/api/v1/penukaran-poin/nota/${id}`);
  return response.data;
}

// Admin: Semua Transaksi Penukaran Poin Nasabah
export async function getAdminPenukaranList(
  bulan?: string
): Promise<ApiResponse<PenukaranTransaksi[]>> {
  const response = await api.get("/api/v1/penukaran-poin/admin/list", {
    params: bulan ? { bulan } : undefined,
  });
  return response.data;
}

// Admin: Update Status Penukaran Poin (diproses / selesai)
export async function updateStatusPenukaran(
  id: string,
  status: "diproses" | "selesai"
): Promise<ApiResponse<PenukaranTransaksi>> {
  const response = await api.put(
    `/api/v1/penukaran-poin/admin/status/${id}`,
    { status }
  );
  return response.data;
}
