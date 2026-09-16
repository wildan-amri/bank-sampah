"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Recycle, ArrowRight, Award, Coins } from "lucide-react";
import { getKategori } from "@/services/kategori.service";
import { KategoriSampah } from "@/types/kategori";
import { formatRupiah, formatPoin, getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NasabahKategoriPage() {
  const [list, setList] = useState<KategoriSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterJenis, setFilterJenis] = useState("semua");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getKategori();
        if (res.success) {
          setList(res.data || []);
        }
      } catch (err: any) {
        toast.error(err.friendlyMessage || "Gagal memuat kategori sampah");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filtered = list.filter((item) => {
    if (filterJenis === "semua") return true;
    return item.jenis === filterJenis;
  });

  const getJenisBadgeColor = (jenis: string) => {
    switch (jenis) {
      case "plastik":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "kertas":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "logam":
        return "bg-slate-100 text-slate-800 border-slate-300";
      case "kaca":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Daftar Jenis Sampah Daur Ulang
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Informasi estimasi harga beli dan perolehan poin reward per kilogram
          </p>
        </div>

        <Link
          href="/nasabah/setor/ajukan"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition self-start sm:self-auto"
        >
          Setor Sampah Sekarang <ArrowRight size={16} />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["semua", "plastik", "kertas", "logam", "kaca"].map((j) => (
          <button
            key={j}
            onClick={() => setFilterJenis(j)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
              filterJenis === j
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {j}
          </button>
        ))}
      </div>

      {/* Grid of Categories */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-44 bg-white rounded-3xl border border-slate-200 animate-pulse p-4"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          Tidak ada jenis sampah pada kategori ini.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col"
            >
              <div className="h-36 bg-slate-100 relative overflow-hidden">
                {item.foto ? (
                  <img
                    src={getImageUrl(item.foto)}
                    alt={item.namaKategori}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                      const fallback = e.currentTarget.parentElement?.querySelector(".fallback-icon");
                      if (fallback) (fallback as HTMLElement).classList.remove("hidden");
                      if (fallback) (fallback as HTMLElement).classList.add("flex");
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full fallback-icon items-center justify-center text-slate-400 ${
                    item.foto ? "hidden" : "flex"
                  }`}
                >
                  <Recycle size={40} />
                </div>
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${getJenisBadgeColor(
                    item.jenis
                  )}`}
                >
                  {item.jenis}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {item.namaKategori}
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Harga Beli / Kg
                      </span>
                      <span className="font-bold text-slate-800 text-sm">
                        {formatRupiah(item.hargaPerKg)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <span className="text-[10px] text-emerald-600 block font-medium">
                        Reward Poin / Kg
                      </span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {item.poinPerKg} Poin
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link
                    href="/nasabah/setor/ajukan"
                    className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    Ajukan Setor Ini <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
