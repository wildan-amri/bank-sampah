"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Recycle,
  Scale,
  Award,
  Calendar,
  FileText,
  Send,
} from "lucide-react";
import { getKategori } from "@/services/kategori.service";
import { ajukanSetoran } from "@/services/setor.service";
import { KategoriSampah } from "@/types/kategori";
import { CreateSetorSampahDto, ItemSetorDto } from "@/types/setor";
import { formatKg, formatPoin } from "@/lib/utils";
import toast from "react-hot-toast";

interface FormItemRow {
  kategoriSampahId: string;
  beratKg: number;
}

export default function NasabahAjukanSetorPage() {
  const router = useRouter();
  const [kategoriList, setKategoriList] = useState<KategoriSampah[]>([]);
  const [loadingKategori, setLoadingKategori] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [tanggal, setTanggal] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format for datetime-local
  });
  const [catatan, setCatatan] = useState("Sampah sudah dipilah rapi dalam karung");
  const [items, setItems] = useState<FormItemRow[]>([
    { kategoriSampahId: "", beratKg: 1 },
  ]);

  useEffect(() => {
    async function loadKategori() {
      try {
        setLoadingKategori(true);
        const res = await getKategori();
        if (res.success && res.data && res.data.length > 0) {
          setKategoriList(res.data);
          // Set first category as default for first item
          setItems([{ kategoriSampahId: res.data[0].id, beratKg: 1 }]);
        }
      } catch (err: any) {
        toast.error(err.friendlyMessage || "Gagal memuat kategori sampah");
      } finally {
        setLoadingKategori(false);
      }
    }

    loadKategori();
  }, []);

  const addItemRow = () => {
    const defaultCat = kategoriList[0]?.id || "";
    setItems((prev) => [...prev, { kategoriSampahId: defaultCat, beratKg: 1 }]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) {
      toast.error("Minimal harus ada 1 jenis sampah");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof FormItemRow, value: any) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  // Live estimation calculation
  const totalBerat = items.reduce((acc, it) => acc + (Number(it.beratKg) || 0), 0);
  const estimasiPoin = items.reduce((acc, it) => {
    const cat = kategoriList.find((k) => k.id === it.kategoriSampahId);
    const poinPerKg = cat?.poinPerKg || 0;
    return acc + (Number(it.beratKg) || 0) * poinPerKg;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const invalidItem = items.find(
      (it) => !it.kategoriSampahId || Number(it.beratKg) <= 0
    );
    if (invalidItem) {
      toast.error("Pastikan semua item memiliki kategori dan berat > 0 kg");
      return;
    }

    if (!catatan.trim()) {
      toast.error("Catatan wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      const isoDate = new Date(tanggal).toISOString();
      const payload: CreateSetorSampahDto = {
        tanggal: isoDate,
        catatan: catatan.trim(),
        items: items.map((it) => ({
          kategoriSampahId: it.kategoriSampahId,
          beratKg: Number(it.beratKg),
        })),
      };

      const res = await ajukanSetoran(payload);
      if (res.success) {
        toast.success(
          `Pengajuan setoran berhasil dibuat! Kode: ${res.data?.kodeSetor}`
        );
        router.push("/nasabah/setor");
      } else {
        toast.error(res.message || "Gagal mengajukan setoran");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal mengirim pengajuan setoran");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/nasabah/setor"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Pengajuan Penyetoran Sampah
          </h1>
          <p className="text-xs text-slate-500">
            Pilih jenis sampah, estimasi berat, dan tanggal penyerahan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dynamic Items Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Recycle size={18} className="text-emerald-600" />
              Daftar Sampah Yang Disetorkan
            </h2>

            <button
              type="button"
              onClick={addItemRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition cursor-pointer"
            >
              <Plus size={14} /> Tambah Item
            </button>
          </div>

          {loadingKategori ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              Memuat data jenis sampah...
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((it, idx) => {
                const selectedCat = kategoriList.find(
                  (k) => k.id === it.kategoriSampahId
                );
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  >
                    <div className="flex-1 w-full">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Jenis Kategori Sampah #{idx + 1}
                      </label>
                      <select
                        value={it.kategoriSampahId}
                        onChange={(e) =>
                          updateItem(idx, "kategoriSampahId", e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        {kategoriList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.namaKategori} ({k.poinPerKg} Poin/Kg)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full sm:w-36">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Estimasi Berat (Kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={it.beratKg || ""}
                        onChange={(e) =>
                          updateItem(idx, "beratKg", Number(e.target.value))
                        }
                        placeholder="1.5"
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div className="w-full sm:w-28 text-right sm:text-center self-center sm:self-end pb-1 sm:pb-2">
                      <span className="text-[10px] text-slate-400 block">
                        Est. Poin
                      </span>
                      <span className="font-bold text-emerald-700 text-xs">
                        +{(it.beratKg || 0) * (selectedCat?.poinPerKg || 0)} P
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition self-end sm:self-center cursor-pointer"
                      title="Hapus baris"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Estimation Summary Box */}
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
              <Scale size={18} className="text-emerald-600" />
              <span>Total Estimasi Berat: <b>{formatKg(totalBerat)}</b></span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
              <Award size={18} className="text-emerald-600" />
              <span>
                Total Estimasi Reward:{" "}
                <b className="text-sm text-emerald-800">
                  {formatPoin(estimasiPoin)}
                </b>
              </span>
            </div>
          </div>
        </div>

        {/* Date & Notes Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              Waktu & Tanggal Penyetoran
            </label>
            <input
              type="datetime-local"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText size={14} className="text-slate-400" />
              Catatan / Keterangan Penyetoran
            </label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Sampah sudah dipilah rapi dalam karung, siap diambil petugas."
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Send size={16} />
            {submitting ? "Mengirimkan Pengajuan..." : "Kirim Pengajuan Setor Sampah"}
          </button>
        </div>
      </form>
    </div>
  );
}
