"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  Recycle,
  Award,
  Scale,
} from "lucide-react";
import { getDetailSetoran } from "@/services/setor.service";
import { SetorTransaksi, SetorStatus } from "@/types/setor";
import { formatKg, formatPoin, formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NasabahDetailSetorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<SetorTransaksi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getDetailSetoran(id);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err: any) {
        toast.error(err.friendlyMessage || "Gagal memuat struk setoran");
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [id]);

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

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        Memuat struk setoran...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-slate-500 text-sm">Struk transaksi tidak ditemukan.</p>
        <Link
          href="/nasabah/setor"
          className="mt-3 inline-block text-xs font-semibold text-emerald-600"
        >
          Kembali ke Riwayat
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/nasabah/setor"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition inline-flex items-center gap-2 text-xs font-semibold"
        >
          <ArrowLeft size={16} /> Riwayat
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Printer size={15} /> Cetak Nota
        </button>
      </div>

      {/* Official Printable Struk */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="text-center pb-5 border-b border-dashed border-slate-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 print:hidden">
            <Recycle size={20} />
          </div>
          <h2 className="font-extrabold text-lg tracking-tight text-slate-900 uppercase">
            Bank Sampah Digital
          </h2>
          <p className="text-xs text-slate-500">
            Tanda Terima Resmi Penyetoran Sampah Daur Ulang
          </p>
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-100 font-mono text-xs font-bold text-slate-800">
            {data.kodeSetor}
          </div>
        </div>

        {/* Metadata */}
        <div className="py-4 border-b border-dashed border-slate-300 text-xs space-y-2 text-slate-600">
          <div className="flex justify-between">
            <span>Tanggal Pengajuan:</span>
            <span className="font-medium text-slate-800">
              {formatDateTime(data.tanggal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Nama Nasabah:</span>
            <span className="font-semibold text-slate-800">
              {data.nasabah?.namaNasabah || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Kontak:</span>
            <span>{data.nasabah?.telp || "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Status Transaksi:</span>
            <span>{getStatusBadge(data.status)}</span>
          </div>
        </div>

        {/* Detail Sampah */}
        <div className="py-4 border-b border-dashed border-slate-300">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Rincian Sampah Daur Ulang
          </h3>
          <div className="space-y-2.5 text-xs">
            {(data.detailSetors || []).map((it: any, idx: number) => {
              const nama =
                it.kategoriSampah?.namaKategori ||
                it.kategori ||
                it.namaKategori ||
                `Sampah #${idx + 1}`;
              const berat = it.beratKgReal ?? it.beratKg;
              return (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800">{nama}</p>
                    <p className="text-[11px] text-slate-400">
                      {formatKg(berat)} @ {it.poinPerKg || 10} Poin/Kg
                    </p>
                  </div>
                  <span className="font-bold text-emerald-700">
                    +{it.subtotalPoin || 0} Poin
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Catatan Admin / Catatan Nasabah */}
        {(data.catatan || data.catatanAdmin) && (
          <div className="py-3 border-b border-dashed border-slate-300 text-xs text-slate-600 space-y-1">
            {data.catatan && (
              <p>
                <span className="font-medium text-slate-700">Catatan Nasabah:</span>{" "}
                {data.catatan}
              </p>
            )}
            {data.catatanAdmin && (
              <p className="text-indigo-800">
                <span className="font-medium">Catatan Verifikasi Admin:</span>{" "}
                {data.catatanAdmin}
              </p>
            )}
          </div>
        )}

        {/* Totals */}
        <div className="pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Total Tonase Sampah:</span>
            <span className="font-bold text-slate-800">
              {formatKg(data.totalBeratKg)}
            </span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-emerald-800 pt-2 border-t border-slate-200">
            <span>Total Poin Diperoleh:</span>
            <span>{formatPoin(data.totalPoin ?? data.estimasiTotalPoin ?? 0)}</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-dashed border-slate-300 text-center text-[10px] text-slate-400">
          <p>
            Simpan bukti tanda terima ini sebagai bukti penyetoran sampah resmi.
          </p>
          <p className="mt-1 font-mono">Bank Sampah Digital • Eco-Waste System</p>
        </div>
      </div>
    </div>
  );
}
