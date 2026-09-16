"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerMaker, seedDummyData } from "@/services/maker.service";
import { setAppKey } from "@/lib/auth";
import { RegisterMakerDto } from "@/types/auth";
import toast from "react-hot-toast";
import { KeyRound, Sparkles, CheckCircle2, ArrowRight, Database } from "lucide-react";

export default function MakerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterMakerDto>({
    defaultValues: {
      email: "",
      password: "",
      namaSiswa: "",
      kelas: "XII RPL 1",
      namaApp: "Bank Sampah Digital Hub",
    },
  });

  async function onSubmit(data: RegisterMakerDto) {
    try {
      setLoading(true);
      const res = await registerMaker(data);
      if (res.success && res.data?.appKey) {
        setAppKey(res.data.appKey);
        setCreatedKey(res.data.appKey);
        toast.success("Registrasi App Maker berhasil! Kunci tenant tersimpan.");
      } else {
        toast.error(res.message || "Registrasi gagal");
      }
    } catch (error: any) {
      toast.error(error.friendlyMessage || "Gagal melakukan registrasi App Maker");
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedAndContinue() {
    try {
      setIsSeeding(true);
      toast.loading("Membuat data awal demo...", { id: "seed" });
      await seedDummyData();
      toast.success("Dummy data berhasil dibuat! Mengalihkan ke login...", {
        id: "seed",
      });
      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal seed data", { id: "seed" });
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Registrasi App Maker</h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftarkan diri Anda untuk mendapatkan <span className="font-semibold text-emerald-600">App Key Unik</span> isolasi data tenant UKK.
          </p>
        </div>

        {createdKey ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-semibold text-emerald-900">App Key Berhasil Diterbitkan!</h3>
              <p className="text-xs text-emerald-700 mt-1">
                Kunci ini telah otomatis tersimpan di browser Anda untuk mengisolasi data database Anda.
              </p>
              <div className="mt-3 p-2.5 rounded-lg bg-white border border-emerald-300 font-mono text-xs text-slate-800 break-all select-all font-semibold">
                {createdKey}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Langkah Selanjutnya:</p>
              <p>1. Klik <b>Isi Dummy Data Otomatis</b> agar database Anda langsung terisi akun Admin, Nasabah, Kategori, dan Hadiah.</p>
              <p>2. Atau langsung menuju halaman login untuk mencoba akun Anda sendiri.</p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={handleSeedAndContinue}
                disabled={isSeeding}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
              >
                <Database size={16} />
                {isSeeding ? "Sedang Mengisi Dummy Data..." : "Isi Dummy Data Otomatis & Lanjut Login"}
              </button>
              <Link
                href="/auth/login"
                className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                Lanjut ke Halaman Login <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Siswa (Unik)
              </label>
              <input
                {...register("email", { required: "Email wajib diisi" })}
                type="email"
                placeholder="contoh: budi@smk.sch.id"
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
                {...register("password", {
                  required: "Password wajib diisi",
                  minLength: { value: 6, message: "Minimal 6 karakter" },
                })}
                type="password"
                placeholder="Minimal 6 karakter"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Siswa
                </label>
                <input
                  {...register("namaSiswa", { required: "Nama siswa wajib diisi" })}
                  placeholder="Nama Lengkap"
                  className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                {errors.namaSiswa && (
                  <p className="text-xs text-red-500 mt-1">{errors.namaSiswa.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelas / Rombel
                </label>
                <input
                  {...register("kelas", { required: "Kelas wajib diisi" })}
                  placeholder="XII RPL 1"
                  className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                {errors.kelas && (
                  <p className="text-xs text-red-500 mt-1">{errors.kelas.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Aplikasi / Branding
              </label>
              <input
                {...register("namaApp", { required: "Nama aplikasi wajib diisi" })}
                placeholder="Bank Sampah Digital Hub"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              {errors.namaApp && (
                <p className="text-xs text-red-500 mt-1">{errors.namaApp.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Mendaftarkan..." : "Daftar & Dapatkan App Key"}
            </button>

            <div className="pt-3 border-t text-center text-xs text-slate-500 flex flex-col gap-1.5">
              <div>
                Sudah pernah mendaftar maker?{" "}
                <Link href="/maker/login" className="text-emerald-600 font-semibold hover:underline">
                  Login Maker atau Cek Key
                </Link>
              </div>
              <div>
                <Link href="/" className="text-slate-500 hover:underline">
                  ← Kembali ke Beranda
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}