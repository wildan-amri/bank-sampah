import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  AdminDashboardStats,
  NasabahDashboardSummary,
} from "@/types/dashboard";

export async function getAdminStats(): Promise<ApiResponse<AdminDashboardStats>> {
  const response = await api.get("/api/v1/dashboard/stats");
  return response.data;
}

export async function getNasabahDashboard(): Promise<
  ApiResponse<NasabahDashboardSummary>
> {
  const response = await api.get("/api/v1/dashboard/summary");
  return response.data;
}