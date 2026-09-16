import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { RekapitulasiBulanan } from "@/types/rekapitulasi";

// Admin: Rekap Total Tonase Sampah & Estimasi Pembayaran (?bulan=YYYY-MM)
export async function getRekapitulasiBulanan(
  bulan: string
): Promise<ApiResponse<RekapitulasiBulanan>> {
  const response = await api.get("/api/v1/rekapitulasi/bulanan", {
    params: { bulan },
  });
  return response.data;
}
