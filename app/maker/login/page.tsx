"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginMaker, checkMakerKey } from "@/services/maker.service";
import { setAppKey } from "@/lib/auth";
import { LoginMakerDto } from "@/types/auth";
import toast from "react-hot-toast";
import { KeyRound, Search, CheckCircle2, ArrowRight } from "lucide-react";

export default function MakerLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundKey, setFoundKey] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginMakerDto>();

  async function onLogin(data: LoginMakerDto) {
    try {
      setLoading(true);
      const res = await loginMaker(data);
      if (res.success && res.data?.appKey) {
        setAppKey(res.data.appKey);
        toast.success(`Berhasil login! App Key untuk "${res.data.namaApp}" aktif.`);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(res.message || "Email atau password maker salah");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal login maker");
    } finally {
      setLoading(false);
    }
  }

  async function onCheckKey(e: React.FormEvent) {
    e.preventDefault();
    if (!searchEmail.trim()) {
      toast.error("Masukkan email siswa");
      return;
    }

    try {
      setSearching(true);
      const res = await checkMakerKey(searchEmail.trim());
      if (res.success && res.data?.appKey) {
        setFoundKey(res.data);
        setAppKey(res.data.appKey);
        toast.success("App Key ditemukan & otomatis disimpan!");
      } else {
        toast.error(res.message || "App Key tidak ditemukan untuk email ini");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "App Maker tidak ditemukan dengan email tersebut");
    } finally {
      setSearching(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Login Siswa (App Maker)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Masuk untuk memulihkan atau menyinkronkan App Key tenant database Anda.
          </p>
        </div>

        {/* Found Key Alert */}
        {foundKey && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <CheckCircle2 size={18} className="text-emerald-600" />
              App Key Ditemukan & Disimpan!
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              Nama: <b>{foundKey.namaSiswa}</b> | App: <b>{foundKey.namaApp}</b>
            </p>
            <div className="mt-2 p-2 bg-white rounded font-mono text-xs text-slate-800 break-all select-all font-semibold border border-emerald-300">
              {foundKey.appKey}
            </div>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Kembali ke Beranda <ArrowRight size={14} />
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Siswa
            </label>
            <input
              {...register("email", { required: "Email wajib diisi" })}
              type="email"
              placeholder="siswa@smk.sch.id"
              className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password Akun Maker
            </label>
            <input
              {...register("password", { required: "Password wajib diisi" })}
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk & Muat App Key"}
          </button>
        </form>

        {/* Lupa App Key Quick Lookup */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Search size={14} /> Lupa App Key? Cari Berdasarkan Email
          </h3>
          <form onSubmit={onCheckKey} className="flex gap-2">
            <input
              type="email"
              placeholder="Ketik email siswa..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 border border-slate-300 px-3 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
            >
              {searching ? "Mencari..." : "Cari Key"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <div>
            Belum punya akun App Maker?{" "}
            <Link href="/maker/register" className="text-emerald-600 font-semibold hover:underline">
              Daftar Maker Baru
            </Link>
          </div>
          <div>
            <Link href="/" className="text-slate-500 hover:underline">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
