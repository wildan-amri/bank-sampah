"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { getAppKey, saveAuth } from "@/lib/auth";
import { LoginUserDto } from "@/types/auth";
import toast from "react-hot-toast";
import { LogIn, KeyRound, AlertCircle, ShieldCheck, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasAppKey, setHasAppKey] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginUserDto>();

  useEffect(() => {
    const key = getAppKey();
    setHasAppKey(!!key);
  }, []);

  async function onSubmit(data: LoginUserDto) {
    const key = getAppKey();
    if (!key) {
      toast.error("App Key belum dikonfigurasi! Harap pasang App Key terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(data);
      if (res.success && res.data?.token) {
        saveAuth(res.data.token, res.data.role, res.data);
        toast.success(`Login berhasil! Selamat datang, ${res.data.username}`);

        if (res.data.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/nasabah/dashboard");
        }
      } else {
        toast.error(res.message || "Username atau password salah");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal masuk. Periksa username & password.");
    } finally {
      setLoading(false);
    }
  }

  const fillCredentials = (username: string, pass: string) => {
    setValue("username", username);
    setValue("password", pass);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <LogIn size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Masuk Akun</h1>
          <p className="text-sm text-slate-500 mt-1">
            Masuk untuk mengakses panel Nasabah atau Admin Bank Sampah.
          </p>
        </div>

        {/* Warning if no App Key */}
        {!hasAppKey && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">App Key Belum Dipasang!</p>
              <p className="mt-0.5 text-amber-700">
                Aplikasi memerlukan App Key untuk menghubungi server. Silakan hubungkan App Key Anda.
              </p>
              <Link
                href="/maker/register"
                className="mt-2 inline-flex items-center gap-1 font-semibold text-amber-900 underline hover:no-underline"
              >
                Daftar Maker & Dapatkan Key <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username
            </label>
            <input
              {...register("username", { required: "Username wajib diisi" })}
              type="text"
              placeholder="Username akun Anda"
              className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              {...register("password", { required: "Password wajib diisi" })}
              type="password"
              placeholder="••••••••"
              className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
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
            {loading ? "Memverifikasi..." : "Masuk ke Aplikasi"}
          </button>
        </form>

        {/* Quick Fill Test Accounts */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-500 mb-2.5 text-center uppercase tracking-wider">
            Akun Cepat untuk Uji Coba (Demo)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("admin_banksampah", "admin123")}
              className="px-3 py-2 text-xs rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck size={14} /> Isi Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("nasabah_budi", "password123")}
              className="px-3 py-2 text-xs rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium flex items-center justify-center gap-1.5 transition"
            >
              <User size={14} /> Isi Nasabah
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1.5">
          <div>
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-emerald-600 font-semibold hover:underline">
              Daftar Sekarang
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
