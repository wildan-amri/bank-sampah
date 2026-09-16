"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Gift,
  Award,
  User,
  X,
} from "lucide-react";
import {
  getAdminPenukaranList,
  updateStatusPenukaran,
  getNotaPenukaran,
} from "@/services/penukaran.service";
import { PenukaranTransaksi } from "@/types/penukaran";
import { formatPoin, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminPenukaranPage() {
  const [list, setList] = useState<PenukaranTransaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulanFilter, setBulanFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Nota Modal State
  const [selectedNota, setSelectedNota] = useState<PenukaranTransaksi | null>(
    null
  );
  const [loadingNota, setLoadingNota] = useState(false);

  const fetchPenukaran = async () => {
    try {
      setLoading(true);
      const res = await getAdminPenukaranList(bulanFilter || undefined);
      if (res.success) {
        setList(res.data || []);
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memuat transaksi penukaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenukaran();
  }, [bulanFilter]);

  const handleStatusChange = async (id: string, newStatus: "diproses" | "selesai") => {
    try {
      setUpdatingId(id);
      const res = await updateStatusPenukaran(id, newStatus);
      if (res.success) {
        toast.success(`Status penukaran berhasil diubah ke ${newStatus}!`);
        setList((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        toast.error(res.message || "Gagal mengubah status");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memperbarui status penukaran");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewNota = async (id: string) => {
    try {
      setLoadingNota(true);
      const res = await getNotaPenukaran(id);
      if (res.success && res.data) {
        setSelectedNota(res.data);
      } else {
        toast.error(res.message || "Gagal memuat nota");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal mengambil data nota");
    } finally {
      setLoadingNota(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Transaksi Penukaran Poin
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar permohonan klaim voucher / sembako oleh nasabah
          </p>
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <Calendar size={16} className="text-slate-400" />
          <input
            type="month"
            value={bulanFilter}
            onChange={(e) => setBulanFilter(e.target.value)}
            className="text-xs text-slate-700 bg-transparent outline-none"
          />
          {bulanFilter && (
            <button
              onClick={() => setBulanFilter("")}
              className="text-xs text-slate-400 hover:text-slate-600 underline ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Memuat daftar penukaran poin...
          </div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Belum ada transaksi penukaran poin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Kode Klaim</th>
                  <th className="py-3 px-4">Nasabah</th>
                  <th className="py-3 px-4">Hadiah / Voucher</th>
                  <th className="py-3 px-4">Poin Terpakai</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-purple-700">
                      {item.kodePenukaran}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">
                        {item.nasabah?.namaNasabah || "-"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {item.nasabah?.telp || ""}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Gift size={14} className="text-purple-600 shrink-0" />
                        <span>{item.hadiah?.namaHadiah || "Hadiah"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600">
                      -{formatPoin(item.poinTerpakai)}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDateTime(item.tanggal)}
                    </td>
                    <td className="py-3 px-4">
                      {item.status === "selesai" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={12} /> Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          <Clock size={12} /> Diproses
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewNota(item.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold transition cursor-pointer"
                        >
                          Nota
                        </button>
                        {item.status !== "selesai" ? (
                          <button
                            onClick={() =>
                              handleStatusChange(item.id, "selesai")
                            }
                            disabled={updatingId === item.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 cursor-pointer"
                          >
                            Tandai Selesai
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusChange(item.id, "diproses")
                            }
                            disabled={updatingId === item.id}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition cursor-pointer"
                          >
                            Set Diproses
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Nota Modal */}
      {selectedNota && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setSelectedNota(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 print:hidden"
            >
              <X size={20} />
            </button>

            {/* Struk Content */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <h3 className="font-extrabold text-base tracking-tight text-slate-900 uppercase">
                Bank Sampah Digital
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Bukti Klaim Penukaran Reward Poin
              </p>
              <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                {selectedNota.kodePenukaran}
              </p>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span className="font-medium text-slate-800">
                  {formatDateTime(selectedNota.tanggal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Nasabah:</span>
                <span className="font-semibold text-slate-800">
                  {selectedNota.nasabah?.namaNasabah || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>No. Telp:</span>
                <span>{selectedNota.nasabah?.telp || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Status Klaim:</span>
                <span className="font-bold uppercase text-emerald-700">
                  {selectedNota.status}
                </span>
              </div>
            </div>

            <div className="py-4 border-b border-dashed border-slate-300">
              <p className="text-[11px] font-bold text-slate-700 uppercase mb-2">
                Barang Yang Ditukarkan
              </p>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">
                  {selectedNota.hadiah?.namaHadiah}
                </span>
                <span className="font-bold text-rose-600">
                  -{selectedNota.poinTerpakai} Poin
                </span>
              </div>
            </div>

            <div className="mt-4 pt-2 text-center print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer size={14} /> Cetak Struk Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
