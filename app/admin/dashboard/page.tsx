"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Recycle,
  Gift,
  ArrowDownToLine,
  Scale,
  Award,
  Database,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { getAdminStats } from "@/services/dashboard.service";
import { getAdminSetoranList } from "@/services/setor.service";
import { seedDummyData } from "@/services/maker.service";
import { AdminDashboardStats } from "@/types/dashboard";
import { SetorTransaksi } from "@/types/setor";
import { formatKg, formatPoin, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentSetoran, setRecentSetoran] = useState<SetorTransaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, setoranRes] = await Promise.allSettled([
        getAdminStats(),
        getAdminSetoranList(),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (setoranRes.status === "fulfilled" && setoranRes.value.success) {
        setRecentSetoran(setoranRes.value.data.slice(0, 5));
      }
    } catch (error: any) {
      toast.error(error.friendlyMessage || "Gagal memuat statistik admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      toast.loading("Menginisialisasi dummy data...", { id: "seed" });
      const res = await seedDummyData();
      if (res.success) {
        toast.success("Dummy data berhasil diperbarui!", { id: "seed" });
        loadDashboardData();
      } else {
        toast.error(res.message || "Gagal seed data", { id: "seed" });
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal inisialisasi dummy data", {
        id: "seed",
      });
    } finally {
      setSeeding(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={12} /> Selesai
          </span>
        );
      case "diverifikasi":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            <CheckCircle2 size={12} /> Diverifikasi
          </span>
        );
      case "ditolak":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            <XCircle size={12} /> Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <Clock size={12} /> Menunggu
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ringkasan operasional dan statistik Bank Sampah
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <Database size={14} />
            {seeding ? "Seeding..." : "Refresh Sample Data"}
          </button>
          <Link
            href="/admin/setor"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
          >
            <ArrowDownToLine size={14} />
            Kelola Setoran
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse p-4"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Nasabah */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <Users size={16} />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Nasabah</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {stats?.totalNasabah ?? 0}
            </p>
          </div>

          {/* Total Kategori */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Recycle size={16} />
            </div>
            <p className="text-xs font-medium text-slate-500">Kategori Sampah</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {stats?.totalKategoriSampah ?? 0}
            </p>
          </div>

          {/* Total Transaksi */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <ArrowDownToLine size={16} />
            </div>
            <p className="text-xs font-medium text-slate-500">Total Setoran</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {stats?.totalTransaksiSetor ?? 0}
            </p>
          </div>

          {/* Total Hadiah */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <Gift size={16} />
            </div>
            <p className="text-xs font-medium text-slate-500">Katalog Hadiah</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {stats?.totalHadiah ?? 0}
            </p>
          </div>

          {/* Total Berat Sampah */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
              <Scale size={16} />
            </div>
            <p className="text-xs font-medium text-slate-500">Tonase Sampah</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {formatKg(stats?.totalBeratSampahKg ?? 0)}
            </p>
          </div>

          {/* Total Poin Tersalurkan */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
              <Award size={16} />
            </div>
            <p className="text-xs font-medium text-slate-500">Poin Tersalurkan</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {formatPoin(stats?.totalPoinTersalurkan ?? 0)}
            </p>
          </div>
        </div>
      )}

      {/* Recent Submissions Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-800 text-base">
              Pengajuan Setoran Sampah Terbaru
            </h2>
            <p className="text-xs text-slate-500">
              Transaksi setoran sampah terakhir dari nasabah
            </p>
          </div>
          <Link
            href="/admin/setor"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {recentSetoran.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Belum ada data transaksi penyetoran.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Kode Setor</th>
                  <th className="py-2.5 px-3">Nasabah</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Berat Total</th>
                  <th className="py-2.5 px-3">Poin</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {recentSetoran.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-semibold text-indigo-600">
                      {item.kodeSetor}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">
                        {item.nasabah?.namaNasabah || "-"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {item.nasabah?.telp || ""}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatDateTime(item.tanggal)}
                    </td>
                    <td className="py-3 px-3">{formatKg(item.totalBeratKg)}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-600">
                      {formatPoin(item.totalPoin ?? item.estimasiTotalPoin ?? 0)}
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/setor/${item.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold transition"
                      >
                        Verifikasi
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}