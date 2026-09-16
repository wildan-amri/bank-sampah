"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ArrowRight,
  FileText,
} from "lucide-react";
import { getMySetoran } from "@/services/setor.service";
import { SetorTransaksi, SetorStatus } from "@/types/setor";
import { formatKg, formatPoin, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NasabahSetorPage() {
  const [list, setList] = useState<SetorTransaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulanFilter, setBulanFilter] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getMySetoran(bulanFilter || undefined);
      if (res.success) {
        setList(res.data || []);
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memuat riwayat penyetoran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [bulanFilter]);

  const getStatusBadge = (status: SetorStatus) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Riwayat Penyetoran Sampah
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pantau status verifikasi dan cetak nota transaksi penyetoran Anda
          </p>
        </div>

        <Link
          href="/nasabah/setor/ajukan"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition self-start sm:self-auto"
        >
          <Plus size={16} />
          Ajukan Penyetoran Baru
        </Link>
      </div>

      {/* Month Filter */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">
          Filter Bulan Transaksi:
        </span>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <input
            type="month"
            value={bulanFilter}
            onChange={(e) => setBulanFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {bulanFilter && (
            <button
              onClick={() => setBulanFilter("")}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Memuat histori penyetoran sampah...
          </div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Belum ada data penyetoran pada periode ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Kode Setor</th>
                  <th className="py-3 px-4">Waktu Penyetoran</th>
                  <th className="py-3 px-4">Total Berat</th>
                  <th className="py-3 px-4">Poin Diperoleh</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {item.kodeSetor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {formatDateTime(item.tanggal)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {formatKg(item.totalBeratKg)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      +{formatPoin(item.totalPoin ?? item.estimasiTotalPoin ?? 0)}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/nasabah/setor/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition"
                      >
                        <FileText size={13} />
                        Struk Nota
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
