"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gift,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  FileText,
} from "lucide-react";
import { getHadiah } from "@/services/hadiah.service";
import { tukarPoin } from "@/services/penukaran.service";
import { getNasabahDashboard } from "@/services/dashboard.service";
import { getUser } from "@/lib/auth";
import { Hadiah } from "@/types/hadiah";
import { formatPoin, getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NasabahHadiahPage() {
  const router = useRouter();
  const [list, setList] = useState<Hadiah[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPoin, setUserPoin] = useState<number>(() => {
    const user = getUser();
    return user?.nasabah?.saldoPoin || 0;
  });

  // Redeem Confirmation Modal State
  const [selectedHadiah, setSelectedHadiah] = useState<Hadiah | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hadiahRes, dashRes] = await Promise.allSettled([
        getHadiah(),
        getNasabahDashboard(),
      ]);

      if (hadiahRes.status === "fulfilled" && hadiahRes.value.success) {
        setList(hadiahRes.value.data || []);
      }
      if (dashRes.status === "fulfilled" && dashRes.value.success && dashRes.value.data) {
        const points =
          (dashRes.value.data as any).saldoPoin ??
          dashRes.value.data.saldoPoinSaatIni ??
          0;
        setUserPoin(points);
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memuat katalog hadiah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTukar = async () => {
    if (!selectedHadiah) return;

    if (userPoin < selectedHadiah.poinDibutuhkan) {
      toast.error(
        `Saldo poin Anda (${userPoin}) tidak mencukupi untuk menukar hadiah ini (${selectedHadiah.poinDibutuhkan} poin).`
      );
      return;
    }

    try {
      setSubmitting(true);
      const res = await tukarPoin(selectedHadiah.id);
      if (res.success && res.data) {
        toast.success("Penukaran hadiah berhasil diajukan!");
        setSelectedHadiah(null);
        fetchData(); // refresh saldo & stock
        router.push("/nasabah/penukaran");
      } else {
        toast.error(res.message || "Penukaran hadiah gagal");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal mengajukan penukaran poin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Balance Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Katalog Penukaran Hadiah
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tukarkan saldo reward daur ulang Anda dengan voucher pulsa dan produk menarik
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[11px] text-emerald-700 font-medium block">
              Saldo Poin Tersedia
            </span>
            <span className="text-lg font-extrabold text-emerald-800">
              {formatPoin(userPoin)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Hadiah */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white rounded-3xl border border-slate-200 animate-pulse p-4"
            />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          Belum ada barang / voucher hadiah yang tersedia.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((item) => {
            const canAfford = userPoin >= item.poinDibutuhkan;
            const hasStock = item.stok > 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    {item.foto ? (
                      <img
                        src={getImageUrl(item.foto)}
                        alt={item.namaHadiah}
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
                      <Gift size={40} />
                    </div>
                    <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs border border-slate-200">
                      Stok: <b>{item.stok}</b>
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 text-base">
                      {item.namaHadiah}
                    </h3>
                    <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <span className="text-xs text-emerald-700 font-medium">
                        Dibutuhkan
                      </span>
                      <span className="font-bold text-emerald-800 text-sm flex items-center gap-1">
                        <Award size={16} /> {item.poinDibutuhkan} Poin
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedHadiah(item)}
                    disabled={!hasStock || !canAfford}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                      !hasStock
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : !canAfford
                        ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20"
                    }`}
                  >
                    {!hasStock
                      ? "Stok Habis"
                      : !canAfford
                      ? `Kurang ${item.poinDibutuhkan - userPoin} Poin`
                      : "Tukar Sekarang"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedHadiah && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 relative animate-in fade-in zoom-in duration-150 text-center">
            <button
              onClick={() => setSelectedHadiah(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Gift size={26} />
            </div>

            <h3 className="font-bold text-slate-800 text-lg">Konfirmasi Penukaran</h3>
            <p className="text-xs text-slate-500 mt-1">
              Apakah Anda yakin ingin menukarkan saldo poin dengan hadiah ini?
            </p>

            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Hadiah:</span>
                <span className="font-bold text-slate-800">
                  {selectedHadiah.namaHadiah}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Poin Dibutuhkan:</span>
                <span className="font-bold text-rose-600">
                  -{selectedHadiah.poinDibutuhkan} Poin
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Sisa Poin Anda:</span>
                <span className="font-bold text-emerald-700">
                  {userPoin - selectedHadiah.poinDibutuhkan} Poin
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedHadiah(null)}
                className="py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleTukar}
                disabled={submitting}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {submitting ? "Memproses..." : "Ya, Tukar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
