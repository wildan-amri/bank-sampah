"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  Printer,
  Scale,
  Coins,
  Award,
  ArrowLeftRight,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { getRekapitulasiBulanan } from "@/services/rekapitulasi.service";
import { getAdminSetoranList } from "@/services/setor.service";
import { getAdminPenukaranList } from "@/services/penukaran.service";
import { getKategori } from "@/services/kategori.service";
import { RekapitulasiBulanan, KategoriRekapItem } from "@/types/rekapitulasi";
import { SetorTransaksi } from "@/types/setor";
import { PenukaranTransaksi } from "@/types/penukaran";
import { KategoriSampah } from "@/types/kategori";
import {
  formatKg,
  formatRupiah,
  formatPoin,
  formatDateTime,
} from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminRekapitulasiPage() {
  // Default to current month YYYY-MM (e.g. 2026-09)
  const [bulan, setBulan] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [allSetoran, setAllSetoran] = useState<SetorTransaksi[]>([]);
  const [allPenukaran, setAllPenukaran] = useState<PenukaranTransaksi[]>([]);
  const [kategoriList, setKategoriList] = useState<KategoriSampah[]>([]);
  const [serverData, setServerData] = useState<RekapitulasiBulanan | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all foundational data & server rekapitulasi
  const fetchAllData = async (targetBulan: string) => {
    try {
      setLoading(true);
      const [rekapRes, setoranRes, penukaranRes, kategoriRes] =
        await Promise.allSettled([
          getRekapitulasiBulanan(targetBulan),
          getAdminSetoranList(),
          getAdminPenukaranList(),
          getKategori(),
        ]);

      if (rekapRes.status === "fulfilled" && rekapRes.value.success) {
        setServerData(rekapRes.value.data);
      } else {
        setServerData(null);
      }

      if (setoranRes.status === "fulfilled" && setoranRes.value.success) {
        setAllSetoran(setoranRes.value.data || []);
      } else {
        setAllSetoran([]);
      }

      if (penukaranRes.status === "fulfilled" && penukaranRes.value.success) {
        setAllPenukaran(penukaranRes.value.data || []);
      } else {
        setAllPenukaran([]);
      }

      if (kategoriRes.status === "fulfilled" && kategoriRes.value.success) {
        setKategoriList(kategoriRes.value.data || []);
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memuat rekapitulasi data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(bulan);
  }, [bulan]);

  // Extract all available months from all existing transactions (so user can 1-click navigate)
  const availableMonths = useMemo(() => {
    const monthCounts: Record<string, number> = {};

    allSetoran.forEach((s) => {
      const mTanggal = s.tanggal ? s.tanggal.slice(0, 7) : null;
      const mCreated = s.createdAt ? s.createdAt.slice(0, 7) : null;

      const m = mTanggal || mCreated;
      if (m && /^\d{4}-\d{2}$/.test(m)) {
        monthCounts[m] = (monthCounts[m] || 0) + 1;
      }
    });

    // Ensure current month is always present
    const currentM = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;
    if (!monthCounts[currentM]) {
      monthCounts[currentM] = 0;
    }

    return Object.entries(monthCounts)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([m, count]) => ({ month: m, count }));
  }, [allSetoran]);

  // Filter transactions for the selected month (matches tanggal OR createdAt)
  const monthlySetoran = useMemo(() => {
    return allSetoran.filter((s) => {
      const mTanggal = s.tanggal ? s.tanggal.slice(0, 7) : "";
      const mCreated = s.createdAt ? s.createdAt.slice(0, 7) : "";
      return mTanggal === bulan || mCreated === bulan;
    });
  }, [allSetoran, bulan]);

  // Filter penukaran for the selected month
  const monthlyPenukaran = useMemo(() => {
    return allPenukaran.filter((p) => {
      const mTanggal = p.tanggal ? p.tanggal.slice(0, 7) : "";
      const mCreated = (p as any).createdAt ? (p as any).createdAt.slice(0, 7) : "";
      return mTanggal === bulan || mCreated === bulan;
    });
  }, [allPenukaran, bulan]);

  // Count pending submissions in this month
  const pendingSetoran = useMemo(() => {
    return monthlySetoran.filter(
      (s) => s.status === "menunggu_konfirmasi" || (s.status as string) === "menunggu"
    );
  }, [monthlySetoran]);

  // Calculate comprehensive stats from monthly transactions
  const calculatedStats = useMemo(() => {
    let totalKg = 0;
    let totalRupiah = 0;
    let totalPoin = 0;

    const breakdown: Record<string, KategoriRekapItem> = {
      plastik: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kertas: { tonaseKg: 0, rupiah: 0, poin: 0 },
      logam: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kaca: { tonaseKg: 0, rupiah: 0, poin: 0 },
    };

    monthlySetoran.forEach((tr) => {
      const trBerat = Number(tr.totalBeratKg) || 0;
      const trPoin = Number(tr.totalPoin ?? tr.estimasiTotalPoin ?? 0);

      totalKg += trBerat;
      totalPoin += trPoin;

      if (tr.detailSetors && tr.detailSetors.length > 0) {
        tr.detailSetors.forEach((d) => {
          const berat = Number(d.beratKgReal ?? d.beratKg) || 0;
          const jenis = (
            d.kategoriSampah?.jenis ||
            d.jenis ||
            "plastik"
          ).toLowerCase();

          // Find category details
          const cat =
            d.kategoriSampah ||
            kategoriList.find((k) => k.id === d.kategoriSampahId);

          const harga = Number(cat?.hargaPerKg) || 2000;
          const poinRate = Number(cat?.poinPerKg) || 5;
          const subRupiah = berat * harga;
          const subPoin = Number(d.subtotalPoin) || berat * poinRate;

          totalRupiah += subRupiah;

          const key = ["plastik", "kertas", "logam", "kaca"].includes(jenis)
            ? jenis
            : "plastik";

          breakdown[key].tonaseKg += berat;
          breakdown[key].rupiah += subRupiah;
          breakdown[key].poin += subPoin;
        });
      } else {
        totalRupiah += trBerat * 2500;
        breakdown.plastik.tonaseKg += trBerat;
        breakdown.plastik.rupiah += trBerat * 2500;
        breakdown.plastik.poin += trPoin;
      }
    });

    const totalPoinTerpakai = monthlyPenukaran.reduce(
      (acc, p) => acc + (Number(p.poinTerpakai) || 0),
      0
    );

    return {
      totalKg,
      totalTon: Number((totalKg / 1000).toFixed(3)),
      totalEstimasiPembayaranRupiah: totalRupiah,
      totalPoinDiterbitkan: totalPoin,
      breakdown,
      totalTransaksiPenukaran: monthlyPenukaran.length,
      totalPoinTerpakai,
    };
  }, [monthlySetoran, monthlyPenukaran, kategoriList]);

  // Harmonize with server data: Never display empty (0) if user has inputted data!
  const finalRekap = useMemo<RekapitulasiBulanan>(() => {
    const s = serverData;

    const totalKg = Math.max(
      Number(s?.rekapitulasiTonase?.totalKg) || 0,
      calculatedStats.totalKg
    );
    const totalTon = Number((totalKg / 1000).toFixed(3));
    const totalEstimasiPembayaranRupiah = Math.max(
      Number(s?.rekapitulasiTonase?.totalEstimasiPembayaranRupiah) || 0,
      calculatedStats.totalEstimasiPembayaranRupiah
    );
    const totalPoinDiterbitkan = Math.max(
      Number(s?.rekapitulasiTonase?.totalPoinDiterbitkan) || 0,
      calculatedStats.totalPoinDiterbitkan
    );

    const totalTransaksiPenukaran = Math.max(
      Number(s?.rekapitulasiPenukaranPoin?.totalTransaksiPenukaran) || 0,
      calculatedStats.totalTransaksiPenukaran
    );
    const totalPoinTerpakai = Math.max(
      Number(s?.rekapitulasiPenukaranPoin?.totalPoinTerpakai) || 0,
      calculatedStats.totalPoinTerpakai
    );

    const breakdownJenisSampah: Record<string, KategoriRekapItem> = {
      plastik: {
        tonaseKg: Math.max(
          Number(s?.breakdownJenisSampah?.plastik?.tonaseKg) || 0,
          calculatedStats.breakdown.plastik.tonaseKg
        ),
        rupiah: Math.max(
          Number(s?.breakdownJenisSampah?.plastik?.rupiah) || 0,
          calculatedStats.breakdown.plastik.rupiah
        ),
        poin: Math.max(
          Number(s?.breakdownJenisSampah?.plastik?.poin) || 0,
          calculatedStats.breakdown.plastik.poin
        ),
      },
      kertas: {
        tonaseKg: Math.max(
          Number(s?.breakdownJenisSampah?.kertas?.tonaseKg) || 0,
          calculatedStats.breakdown.kertas.tonaseKg
        ),
        rupiah: Math.max(
          Number(s?.breakdownJenisSampah?.kertas?.rupiah) || 0,
          calculatedStats.breakdown.kertas.rupiah
        ),
        poin: Math.max(
          Number(s?.breakdownJenisSampah?.kertas?.poin) || 0,
          calculatedStats.breakdown.kertas.poin
        ),
      },
      logam: {
        tonaseKg: Math.max(
          Number(s?.breakdownJenisSampah?.logam?.tonaseKg) || 0,
          calculatedStats.breakdown.logam.tonaseKg
        ),
        rupiah: Math.max(
          Number(s?.breakdownJenisSampah?.logam?.rupiah) || 0,
          calculatedStats.breakdown.logam.rupiah
        ),
        poin: Math.max(
          Number(s?.breakdownJenisSampah?.logam?.poin) || 0,
          calculatedStats.breakdown.logam.poin
        ),
      },
      kaca: {
        tonaseKg: Math.max(
          Number(s?.breakdownJenisSampah?.kaca?.tonaseKg) || 0,
          calculatedStats.breakdown.kaca.tonaseKg
        ),
        rupiah: Math.max(
          Number(s?.breakdownJenisSampah?.kaca?.rupiah) || 0,
          calculatedStats.breakdown.kaca.rupiah
        ),
        poin: Math.max(
          Number(s?.breakdownJenisSampah?.kaca?.poin) || 0,
          calculatedStats.breakdown.kaca.poin
        ),
      },
    };

    return {
      periode: bulan,
      rekapitulasiTonase: {
        totalKg,
        totalTon,
        totalEstimasiPembayaranRupiah,
        totalPoinDiterbitkan,
      },
      breakdownJenisSampah: breakdownJenisSampah as any,
      rekapitulasiPenukaranPoin: {
        totalTransaksiPenukaran,
        totalPoinTerpakai,
      },
    };
  }, [serverData, calculatedStats, bulan]);

  // Format YYYY-MM to Indonesian readable format (e.g. "September 2026")
  const formatMonthName = (m: string) => {
    try {
      const [year, month] = m.split("-");
      const date = new Date(Number(year), Number(month) - 1, 1);
      return new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return m;
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

  const hasAnyData =
    finalRekap.rekapitulasiTonase.totalKg > 0 ||
    monthlySetoran.length > 0 ||
    monthlyPenukaran.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={24} />
            Rekapitulasi & Laporan Bulanan
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Laporan tonase sampah terkumpul, estimasi rupiah, dan perputaran poin
            berdasarkan waktu transaksi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Picker */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-xs">
            <Calendar size={16} className="text-slate-400" />
            <input
              type="month"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="text-xs text-slate-800 font-semibold bg-transparent outline-none cursor-pointer"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAllData(bulan)}
            disabled={loading}
            title="Muat Ulang Data"
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 transition disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
          >
            <Printer size={15} />
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Available Months Quick Selector Chips */}
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <span className="text-xs font-semibold text-slate-400 mr-1">
          Periode Tersedia:
        </span>
        {availableMonths.map((item) => (
          <button
            key={item.month}
            onClick={() => setBulan(item.month)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              bulan === item.month
                ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{formatMonthName(item.month)}</span>
            {item.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  bulan === item.month
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pending Transactions Alert Banner */}
      {pendingSetoran.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 print:hidden">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold">
                {pendingSetoran.length} Penyetoran Menunggu Verifikasi
              </span>{" "}
              pada periode {formatMonthName(bulan)} (Total:{" "}
              <span className="font-bold font-mono">
                {formatKg(
                  pendingSetoran.reduce((acc, s) => acc + (s.totalBeratKg || 0), 0)
                )}
              </span>
              ). Verifikasi timbangan agar resmi tercatat dalam kas.
            </div>
          </div>
          <Link
            href="/admin/setor"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs shrink-0 self-start sm:self-auto transition"
          >
            Buka Setoran Sampah <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Official Report Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs print:border-none print:shadow-none print:p-0">
        {/* Printable Header */}
        <div className="text-center pb-6 border-b border-slate-200 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            Bank Sampah Digital (Eco-Waste)
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Laporan Rekapitulasi Penyetoran, Tonase & Pembayaran Periode:{" "}
            <span className="font-bold text-indigo-700 font-mono text-sm">
              {formatMonthName(bulan)} ({bulan})
            </span>
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw
              size={28}
              className="animate-spin text-indigo-600 mx-auto"
            />
            <p className="text-slate-500 text-sm font-medium">
              Menyiapkan laporan rekapitulasi data...
            </p>
          </div>
        ) : !hasAnyData ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <p className="text-slate-700 font-semibold text-sm">
              Tidak ada transaksi pada periode {formatMonthName(bulan)}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Belum ada transaksi penyetoran atau penukaran pada bulan ini. Anda
              dapat memilih bulan lain di atas atau menginputkan setoran baru.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-700 block">
                  Total Tonase (Kg)
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 mt-1 block">
                  {formatKg(finalRekap.rekapitulasiTonase.totalKg)}
                </span>
                <span className="text-[10px] text-emerald-600 mt-0.5 block">
                  ≈ {finalRekap.rekapitulasiTonase.totalTon} Ton
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100">
                <span className="text-[11px] font-semibold text-indigo-700 block">
                  Estimasi Nilai Sampah
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-indigo-900 mt-1 block">
                  {formatRupiah(
                    finalRekap.rekapitulasiTonase.totalEstimasiPembayaranRupiah
                  )}
                </span>
                <span className="text-[10px] text-indigo-600 mt-0.5 block">
                  Estimasi rupiah sampah nasabah
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
                <span className="text-[11px] font-semibold text-amber-700 block">
                  Poin Diterbitkan
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-amber-900 mt-1 block">
                  {formatPoin(finalRekap.rekapitulasiTonase.totalPoinDiterbitkan)}
                </span>
                <span className="text-[10px] text-amber-600 mt-0.5 block">
                  Disalurkan ke saldo nasabah
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100">
                <span className="text-[11px] font-semibold text-purple-700 block">
                  Poin Ditukar Hadiah
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-purple-900 mt-1 block">
                  {formatPoin(
                    finalRekap.rekapitulasiPenukaranPoin.totalPoinTerpakai
                  )}
                </span>
                <span className="text-[10px] text-purple-600 mt-0.5 block">
                  Dari{" "}
                  {finalRekap.rekapitulasiPenukaranPoin.totalTransaksiPenukaran}{" "}
                  penukaran
                </span>
              </div>
            </div>

            {/* Breakdown Table by Waste Category */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Rincian Tonase Berdasarkan Jenis Sampah
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  Periode {formatMonthName(bulan)}
                </span>
              </div>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Jenis Sampah</th>
                      <th className="py-3 px-4">Tonase (Kg)</th>
                      <th className="py-3 px-4">Estimasi Rupiah</th>
                      <th className="py-3 px-4">Poin Diterbitkan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {Object.entries(finalRekap.breakdownJenisSampah || {}).map(
                      ([key, val]: [string, any]) => (
                        <tr key={key} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold capitalize text-slate-800">
                            {key}
                          </td>
                          <td className="py-3.5 px-4 font-semibold">
                            {formatKg(val.tonaseKg || 0)}
                          </td>
                          <td className="py-3.5 px-4 text-indigo-600 font-semibold">
                            {formatRupiah(val.rupiah || 0)}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-600 font-bold">
                            {formatPoin(val.poin || 0)} Poin
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monthly Transaction History Detail Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Daftar Penyetoran Sampah Periode {formatMonthName(bulan)}
                </h3>
                <span className="text-xs text-slate-500 font-normal">
                  Total: <b>{monthlySetoran.length}</b> Transaksi
                </span>
              </div>

              {monthlySetoran.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                  Tidak ada data penyetoran pada bulan ini.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3">Kode Setor</th>
                        <th className="py-3 px-3">Nasabah</th>
                        <th className="py-3 px-3">Waktu</th>
                        <th className="py-3 px-3">Rincian Sampah</th>
                        <th className="py-3 px-3">Berat</th>
                        <th className="py-3 px-3">Poin</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {monthlySetoran.map((tr) => (
                        <tr key={tr.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                            <Link
                              href={`/admin/setor/${tr.id}`}
                              className="hover:underline"
                            >
                              {tr.kodeSetor}
                            </Link>
                          </td>
                          <td className="py-3 px-3 font-medium">
                            {tr.nasabah?.namaNasabah || "-"}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {formatDateTime(tr.tanggal || tr.createdAt || "")}
                          </td>
                          <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">
                            {tr.detailSetors && tr.detailSetors.length > 0
                              ? tr.detailSetors
                                  .map(
                                    (d) =>
                                      `${d.kategoriSampah?.namaKategori || d.namaKategori || "Sampah"} (${d.beratKgReal ?? d.beratKg} Kg)`
                                  )
                                  .join(", ")
                              : "-"}
                          </td>
                          <td className="py-3 px-3 font-semibold">
                            {formatKg(tr.totalBeratKg)}
                          </td>
                          <td className="py-3 px-3 font-bold text-emerald-700">
                            +{formatPoin(tr.totalPoin ?? tr.estimasiTotalPoin ?? 0)}
                          </td>
                          <td className="py-3 px-3">{getStatusBadge(tr.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Signature Area for Official Printing */}
            <div className="pt-8 border-t border-slate-200 flex justify-between text-xs text-slate-600 print:flex">
              <div>
                <p>Mengetahui,</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  Pengelola Bank Sampah
                </p>
                <div className="h-16" />
                <p className="border-t border-slate-400 pt-1 font-bold">
                  ( ............................................ )
                </p>
              </div>
              <div className="text-right">
                <p>Tanggal Cetak: {new Date().toLocaleDateString("id-ID")}</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  Petugas Administrator
                </p>
                <div className="h-16" />
                <p className="border-t border-slate-400 pt-1 font-bold">
                  ( ............................................ )
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
