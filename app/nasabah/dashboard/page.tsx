"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  Scale,
  ArrowDownToLine,
  ArrowLeftRight,
  TrendingUp,
  Gift,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Inbox,
} from "lucide-react";
import { getNasabahDashboard } from "@/services/dashboard.service";
import { getMySetoran } from "@/services/setor.service";
import { getMyPenukaran } from "@/services/penukaran.service";
import { getUser } from "@/lib/auth";
import { NasabahDashboardSummary } from "@/types/dashboard";
import { SetorTransaksi } from "@/types/setor";
import { PenukaranTransaksi } from "@/types/penukaran";
import { formatKg, formatPoin, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NasabahDashboardPage() {
  const [dashboardData, setDashboardData] =
    useState<NasabahDashboardSummary | null>(null);
  const [setoranList, setSetoranList] = useState<SetorTransaksi[]>([]);
  const [penukaranList, setPenukaranList] = useState<PenukaranTransaksi[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, setorRes, tukarRes] = await Promise.allSettled([
        getNasabahDashboard(),
        getMySetoran(),
        getMyPenukaran(),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value.success) {
        setDashboardData(dashRes.value.data);
      }
      if (setorRes.status === "fulfilled" && setorRes.value.success) {
        setSetoranList(setorRes.value.data || []);
      }
      if (tukarRes.status === "fulfilled" && tukarRes.value.success) {
        setPenukaranList(tukarRes.value.data || []);
      }
    } catch (err: any) {
      console.error("Dashboard error:", err);
      toast.error(err.friendlyMessage || "Gagal memuat ringkasan dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={12} /> Selesai
          </span>
        );
      case "diverifikasi":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            <CheckCircle2 size={12} /> Diverifikasi
          </span>
        );
      case "ditolak":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
            <XCircle size={12} /> Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <Clock size={12} /> Menunggu Konfirmasi
          </span>
        );
    }
  };

  // 1. Saldo Poin: from dashboard summary or authenticated user session
  const currentUser = getUser();
  const saldoPoin =
    dashboardData?.saldoPoin ??
    dashboardData?.saldoPoinSaatIni ??
    currentUser?.nasabah?.saldoPoin ??
    0;

  // 2. Total Tonase Sampah Disetor: calculated accurately from setoranList
  const totalSampahKg = setoranList.reduce(
    (acc, s) => acc + (Number(s.totalBeratKg) || 0),
    0
  );

  // 3. Total Pengajuan Setoran Count
  const totalPengajuan =
    dashboardData?.totalPengajuanSetor ?? setoranList.length;

  // 4. Total Poin Diperoleh (Approved / Selesai)
  const poinDisetujui = setoranList
    .filter((s) => s.status === "selesai")
    .reduce((acc, s) => acc + (s.totalPoin || s.estimasiTotalPoin || 0), 0);

  const totalPoinDiperoleh =
    dashboardData?.totalPoinDiperoleh ??
    dashboardData?.totalPoinDidapat ??
    poinDisetujui;

  // Pending estimated points waiting for admin confirmation
  const poinMenunggu = setoranList
    .filter((s) => s.status === "menunggu_konfirmasi" || s.status === "diverifikasi")
    .reduce((acc, s) => acc + (s.estimasiTotalPoin || s.totalPoin || 0), 0);

  // 5. Total Poin Ditukar
  const poinDitukarList = penukaranList.reduce(
    (acc, p) => acc + (Number(p.poinTerpakai) || 0),
    0
  );
  const totalPoinDitukar =
    dashboardData?.totalPoinDitukar ??
    poinDitukarList;

  // 6. Transaksi Terakhir Setor: prioritize setoranList[0] or backend array
  const lastSetorFromDash = Array.isArray(dashboardData?.setorTerakhir)
    ? dashboardData?.setorTerakhir[0]
    : dashboardData?.setorTerakhir;

  const transaksiTerakhirSetor =
    setoranList[0] ||
    lastSetorFromDash ||
    dashboardData?.transaksiTerakhirSetor ||
    null;

  // 7. Transaksi Terakhir Tukar: prioritize penukaranList[0] or backend array
  const lastTukarFromDash = Array.isArray(dashboardData?.penukaranTerakhir)
    ? dashboardData?.penukaranTerakhir[0]
    : dashboardData?.penukaranTerakhir;

  const transaksiTerakhirTukar =
    penukaranList[0] ||
    lastTukarFromDash ||
    dashboardData?.transaksiTerakhirTukar ||
    null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-36 bg-white rounded-3xl border border-slate-200 animate-pulse p-6" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saldo Poin Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-lg shadow-emerald-700/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-xs mb-3">
              <Sparkles size={14} /> Saldo Reward Aktif
            </span>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Total Saldo Poin Anda Saat Ini
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-1">
              {formatPoin(saldoPoin)}
            </h2>

            {poinMenunggu > 0 && (
              <p className="text-xs text-amber-200 mt-2 flex items-center gap-1.5">
                <Clock size={13} />
                <span>
                  +<b>{formatPoin(poinMenunggu)}</b> sedang menunggu konfirmasi admin
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/nasabah/setor/ajukan"
              className="px-5 py-3 rounded-2xl bg-white text-emerald-800 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <ArrowDownToLine size={18} />
              Setor Sampah Baru
            </Link>
            <Link
              href="/nasabah/hadiah"
              className="px-5 py-3 rounded-2xl bg-emerald-500/40 hover:bg-emerald-500/50 text-white border border-white/20 font-bold text-xs sm:text-sm transition inline-flex items-center gap-2 backdrop-blur-xs"
            >
              <Gift size={18} />
              Tukar Hadiah
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sampah Disetor */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Scale size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Sampah Disetor
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">
              {formatKg(totalSampahKg)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Dari <b>{totalPengajuan}</b> kali pengajuan
            </p>
          </div>
        </div>

        {/* Total Poin Diperoleh */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Poin Diperoleh
            </p>
            <p className="text-2xl font-bold text-emerald-700 mt-0.5">
              +{formatPoin(totalPoinDiperoleh)}
            </p>
            <p className="text-[11px] text-emerald-600 mt-0.5">
              Telah disetujui & masuk saldo
            </p>
          </div>
        </div>

        {/* Total Poin Ditukar */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ArrowLeftRight size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Poin Ditukar
            </p>
            <p className="text-2xl font-bold text-purple-700 mt-0.5">
              {formatPoin(totalPoinDitukar)}
            </p>
            <p className="text-[11px] text-purple-600 mt-0.5">
              Dari <b>{penukaranList.length}</b> penukaran voucher
            </p>
          </div>
        </div>
      </div>

      {/* Latest Activity Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Latest Setor */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <ArrowDownToLine size={18} className="text-emerald-600" />
                Penyetoran Sampah Terakhir
              </h3>
              <Link
                href="/nasabah/setor"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>

            {transaksiTerakhirSetor ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-indigo-700">
                    {transaksiTerakhirSetor.kodeSetor}
                  </span>
                  {getStatusBadge(transaksiTerakhirSetor.status)}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Waktu Pengajuan:</span>
                  <span className="font-medium text-slate-800">
                    {formatDateTime(transaksiTerakhirSetor.tanggal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Total Berat:</span>
                  <span className="font-bold text-slate-800">
                    {formatKg(
                      (transaksiTerakhirSetor as any).totalBeratKg ??
                        (transaksiTerakhirSetor as any).beratKg ??
                        0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="font-medium text-slate-700">
                    {transaksiTerakhirSetor.status === "selesai"
                      ? "Poin Diperoleh:"
                      : "Estimasi Poin:"}
                  </span>
                  <span className="font-bold text-emerald-700 text-sm">
                    +{formatPoin(
                      (transaksiTerakhirSetor as any).totalPoin ??
                        (transaksiTerakhirSetor as any).estimasiTotalPoin ??
                        (transaksiTerakhirSetor as any).poin ??
                        0
                    )}
                  </span>
                </div>

                {transaksiTerakhirSetor.status === "menunggu_konfirmasi" && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                    <Clock size={14} className="shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      Setoran Anda sedang menunggu penimbangan & konfirmasi petugas admin. Poin akan masuk ke saldo begitu diverifikasi.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada transaksi penyetoran sampah.
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/nasabah/setor/ajukan"
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <ArrowDownToLine size={14} />
              Ajukan Penyetoran Baru
            </Link>
          </div>
        </div>

        {/* Latest Tukar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Gift size={18} className="text-purple-600" />
                Penukaran Poin Terakhir
              </h3>
              <Link
                href="/nasabah/penukaran"
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
              >
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>

            {transaksiTerakhirTukar ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-purple-700">
                    {transaksiTerakhirTukar.kodePenukaran}
                  </span>
                  {getStatusBadge(transaksiTerakhirTukar.status)}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Waktu:</span>
                  <span className="font-medium text-slate-800">
                    {formatDateTime(transaksiTerakhirTukar.tanggal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Hadiah:</span>
                  <span className="font-bold text-slate-800">
                    {typeof transaksiTerakhirTukar.hadiah === "object" && transaksiTerakhirTukar.hadiah !== null
                      ? transaksiTerakhirTukar.hadiah.namaHadiah
                      : String(transaksiTerakhirTukar.hadiah || "Hadiah")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="font-medium text-slate-700">Poin Terpakai:</span>
                  <span className="font-bold text-rose-600 text-sm">
                    -{formatPoin(
                      (transaksiTerakhirTukar as any).poinTerpakai ??
                        (transaksiTerakhirTukar as any).poin ??
                        0
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum pernah menukarkan poin reward.
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/nasabah/hadiah"
              className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Gift size={14} />
              Katalog Hadiah & Voucher
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}