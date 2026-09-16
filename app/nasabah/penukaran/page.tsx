"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  Gift,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  X,
  FileText,
} from "lucide-react";
import { getMyPenukaran, getNotaPenukaran } from "@/services/penukaran.service";
import { PenukaranTransaksi } from "@/types/penukaran";
import { formatPoin, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NasabahPenukaranPage() {
  const [list, setList] = useState<PenukaranTransaksi[]>([]);
  const [loading, setLoading] = useState(true);

  // Nota Modal State
  const [selectedNota, setSelectedNota] = useState<PenukaranTransaksi | null>(
    null
  );
  const [loadingNota, setLoadingNota] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getMyPenukaran();
      if (res.success) {
        setList(res.data || []);
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memuat histori penukaran poin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenNota = async (id: string) => {
    try {
      setLoadingNota(true);
      const res = await getNotaPenukaran(id);
      if (res.success && res.data) {
        setSelectedNota(res.data);
      } else {
        toast.error(res.message || "Gagal mengambil nota");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal membuka nota penukaran");
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
            Riwayat Penukaran Hadiah
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar klaim hadiah dan voucher reward yang pernah Anda lakukan
          </p>
        </div>

        <Link
          href="/nasabah/hadiah"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition self-start sm:self-auto"
        >
          <Gift size={16} />
          Tukar Hadiah Lainnya
        </Link>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Memuat riwayat penukaran...
          </div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Anda belum pernah menukarkan poin reward.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Kode Klaim</th>
                  <th className="py-3 px-4">Hadiah / Voucher</th>
                  <th className="py-3 px-4">Poin Terpakai</th>
                  <th className="py-3 px-4">Waktu Penukaran</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                      {item.kodePenukaran}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.hadiah?.namaHadiah || "Hadiah"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">
                      -{formatPoin(item.poinTerpakai)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDateTime(item.tanggal)}
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenNota(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                      >
                        <FileText size={13} />
                        Struk Nota
                      </button>
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
                Bukti Tanda Terima Klaim Reward Hadiah
              </p>
              <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                {selectedNota.kodePenukaran}
              </p>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Waktu Penukaran:</span>
                <span className="font-medium text-slate-800">
                  {formatDateTime(selectedNota.tanggal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Nama Nasabah:</span>
                <span className="font-semibold text-slate-800">
                  {selectedNota.nasabah?.namaNasabah || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status Klaim:</span>
                <span className="font-bold uppercase text-emerald-700">
                  {selectedNota.status}
                </span>
              </div>
            </div>

            <div className="py-4 border-b border-dashed border-slate-300">
              <p className="text-[11px] font-bold text-slate-700 uppercase mb-2">
                Rincian Barang Hadiah
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
