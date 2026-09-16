"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Printer,
  Scale,
  Save,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { getDetailSetoran, verifySetoran } from "@/services/setor.service";
import { SetorTransaksi, VerifyItemSetorDto } from "@/types/setor";
import { formatKg, formatPoin, formatDateTime, formatRupiah } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminDetailSetorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<SetorTransaksi | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Verification Form State
  const [status, setStatus] = useState<"diverifikasi" | "ditolak" | "selesai">(
    "selesai"
  );
  const [catatanAdmin, setCatatanAdmin] = useState(
    "Berat sampah sesuai hasil timbangan real petugas."
  );
  const [realWeights, setRealWeights] = useState<Record<string, number>>({});

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getDetailSetoran(id);
      if (res.success && res.data) {
        setData(res.data);
        if (res.data.status && res.data.status !== "menunggu_konfirmasi") {
          setStatus(res.data.status as any);
        }
        if (res.data.catatanAdmin) {
          setCatatanAdmin(res.data.catatanAdmin);
        }

        // Initialize real weights from items
        const initial: Record<string, number> = {};
        res.data.detailSetors?.forEach((item: any, index: number) => {
          const key = item.kategoriSampahId || String(index);
          initial[key] = item.beratKgReal ?? item.beratKg ?? 0;
        });
        setRealWeights(initial);
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memuat detail setoran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catatanAdmin.trim()) {
      toast.error("Catatan admin wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      const itemsReal: VerifyItemSetorDto[] = (data?.detailSetors || []).map(
        (item: any, index: number) => {
          const key = item.kategoriSampahId || String(index);
          return {
            kategoriSampahId: item.kategoriSampahId || "",
            beratKgReal: Number(realWeights[key] ?? item.beratKg),
          };
        }
      );

      const payload = {
        status,
        catatanAdmin,
        itemsReal: itemsReal.filter((i) => !!i.kategoriSampahId),
      };

      const res = await verifySetoran(id, payload);
      if (res.success) {
        toast.success("Verifikasi setoran berhasil disimpan!");
        fetchDetail();
      } else {
        toast.error(res.message || "Gagal verifikasi setoran");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal menyimpan verifikasi setoran");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        Memuat detail setoran...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-slate-500 text-sm">Data transaksi tidak ditemukan.</p>
        <Link
          href="/admin/setor"
          className="mt-3 inline-block text-xs font-semibold text-indigo-600"
        >
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/setor"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Verifikasi & Struk Setoran
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Kode: {data.kodeSetor}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <Printer size={15} /> Cetak Struk Nota
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Verification Form (Col 1 & 2 or Left) */}
        <div className="md:col-span-2 space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Scale className="text-indigo-600" size={18} />
              Form Verifikasi & Timbangan Real
            </h2>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Pembaruan Berat Real Timbangan (Kg):
                </label>
                <div className="space-y-2.5">
                  {(data.detailSetors || []).map((item: any, idx: number) => {
                    const key = item.kategoriSampahId || String(idx);
                    const nama =
                      item.kategoriSampah?.namaKategori ||
                      item.kategori ||
                      item.namaKategori ||
                      `Item #${idx + 1}`;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{nama}</p>
                          <p className="text-[11px] text-slate-500">
                            Estimasi Pengajuan Nasabah: {formatKg(item.beratKg)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-slate-500 font-medium">
                            Real (Kg):
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={realWeights[key] ?? item.beratKg}
                            onChange={(e) =>
                              setRealWeights({
                                ...realWeights,
                                [key]: Number(e.target.value),
                              })
                            }
                            className="text-black w-24 border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Setoran
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="selesai">Selesai (Poin Masuk ke Saldo Nasabah)</option>
                  <option value="diverifikasi">Diverifikasi (Proses Pengambilan)</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Admin / Petugas Timbangan
                </label>
                <textarea
                  rows={3}
                  value={catatanAdmin}
                  onChange={(e) => setCatatanAdmin(e.target.value)}
                  placeholder="Catatan hasil penimbangan real petugas..."
                  className="text-black w-full border border-slate-300 px-3.5 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={16} />
                {submitting ? "Menyimpan Verifikasi..." : "Simpan & Perbarui Transaksi"}
              </button>
            </form>
          </div>
        </div>

        {/* Printable Struk Nota Preview (Col 3 or Full on Print) */}
        <div className="md:col-span-1 print:col-span-3">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">
            {/* Nota Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <h3 className="font-extrabold text-base tracking-tight text-slate-900 uppercase">
                Bank Sampah Digital
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Bukti Tanda Terima Penyetoran Sampah
              </p>
              <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                {data.kodeSetor}
              </p>
            </div>

            {/* Nasabah & Meta Info */}
            <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span className="font-medium text-slate-800">
                  {formatDateTime(data.tanggal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Nasabah:</span>
                <span className="font-semibold text-slate-800">
                  {data.nasabah?.namaNasabah || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Telp:</span>
                <span>{data.nasabah?.telp || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold uppercase text-indigo-700">
                  {data.status}
                </span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="py-3 border-b border-dashed border-slate-300">
              <p className="text-[11px] font-bold text-slate-700 uppercase mb-2">
                Rincian Sampah
              </p>
              <div className="space-y-2 text-xs">
                {(data.detailSetors || []).map((it: any, i: number) => {
                  const nama =
                    it.kategoriSampah?.namaKategori ||
                    it.kategori ||
                    it.namaKategori ||
                    `Item #${i + 1}`;
                  const berat = it.beratKgReal ?? it.beratKg;
                  return (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-800">{nama}</p>
                        <p className="text-[10px] text-slate-400">
                          {formatKg(berat)} @ {it.poinPerKg || 10} Poin/Kg
                        </p>
                      </div>
                      <span className="font-semibold text-emerald-700">
                        +{it.subtotalPoin || 0} P
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between font-medium text-slate-700">
                <span>Total Tonase:</span>
                <span className="font-bold">{formatKg(data.totalBeratKg)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-emerald-800 pt-1 border-t border-slate-200">
                <span>Total Poin Reward:</span>
                <span>{formatPoin(data.totalPoin ?? data.estimasiTotalPoin ?? 0)}</span>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-dashed border-slate-300 text-center text-[10px] text-slate-400">
              <p>Terima kasih telah berkontribusi menjaga kelestarian lingkungan!</p>
              <p className="mt-1 font-mono">www.banksampah.sch.id</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
