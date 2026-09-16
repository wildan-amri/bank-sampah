"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
} from "lucide-react";
import { getAdminSetoranList } from "@/services/setor.service";
import { SetorTransaksi, SetorStatus } from "@/types/setor";
import { formatKg, formatPoin, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminSetorPage() {
  const [list, setList] = useState<SetorTransaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [bulanFilter, setBulanFilter] = useState<string>("");

  const fetchSetoran = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== "semua") params.status = statusFilter;
      if (bulanFilter) params.bulan = bulanFilter;

      const res = await getAdminSetoranList(params);
      if (res.success) {
        setList(res.data || []);
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memuat daftar setoran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetoran();
  }, [statusFilter, bulanFilter]);

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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Kelola Penyetoran Sampah
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Verifikasi timbangan real dan ubah status pengajuan penyetoran sampah
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "Semua", value: "semua" },
            { label: "Menunggu Konfirmasi", value: "menunggu_konfirmasi" },
            { label: "Diverifikasi", value: "diverifikasi" },
            { label: "Selesai", value: "selesai" },
            { label: "Ditolak", value: "ditolak" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <input
            type="month"
            value={bulanFilter}
            onChange={(e) => setBulanFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Memuat daftar transaksi setoran...
          </div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Tidak ada transaksi setoran pada filter ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Kode Setor</th>
                  <th className="py-3 px-4">Nasabah</th>
                  <th className="py-3 px-4">Waktu Pengajuan</th>
                  <th className="py-3 px-4">Total Berat</th>
                  <th className="py-3 px-4">Total Poin</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-600">
                      {item.kodeSetor}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">
                        {item.nasabah?.namaNasabah || "-"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {item.nasabah?.telp || ""}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDateTime(item.tanggal)}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {formatKg(item.totalBeratKg)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">
                      {formatPoin(item.totalPoin ?? item.estimasiTotalPoin ?? 0)}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/setor/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold transition"
                      >
                        <Eye size={13} />
                        Periksa & Verifikasi
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
