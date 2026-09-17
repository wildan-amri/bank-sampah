"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerNasabah, registerAdmin } from "@/services/auth.service";
import { getAppKey, saveAuth } from "@/lib/auth";
import toast from "react-hot-toast";
import { UserPlus, User, Building2, Upload, AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"nasabah" | "admin">("nasabah");
  const [loading, setLoading] = useState(false);
  const [nasabahFoto, setNasabahFoto] = useState<File | null>(null);

  // Nasabah Form
  const {
    register: regNasabah,
    handleSubmit: handleNasabahSubmit,
    formState: { errors: errorsNasabah },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      namaNasabah: "",
      alamat: "",
      telp: "",
    },
  });

  // Admin Form
  const {
    register: regAdmin,
    handleSubmit: handleAdminSubmit,
    formState: { errors: errorsAdmin },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      namaUnit: "",
      namaPengelola: "",
      telp: "",
    },
  });

  const checkKey = () => {
    const key = getAppKey();
    if (!key) {
      toast.error("Koneksi ke server belum siap. Silakan muat ulang halaman.");
      return false;
    }
    return true;
  };

  async function onNasabahSubmit(data: any) {
    if (!checkKey()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("namaNasabah", data.namaNasabah);
      formData.append("alamat", data.alamat);
      formData.append("telp", data.telp);
      if (nasabahFoto) {
        formData.append("foto", nasabahFoto);
      }

      const res = await registerNasabah(formData);
      if (res.success) {
        toast.success("Pendaftaran Nasabah berhasil! Silakan login.");
        router.push("/auth/login");
      } else {
        toast.error(res.message || "Pendaftaran gagal");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal mendaftar nasabah");
    } finally {
      setLoading(false);
    }
  }

  async function onAdminSubmit(data: any) {
    if (!checkKey()) return;
    try {
      setLoading(true);
      const res = await registerAdmin(data);
      if (res.success) {
        toast.success("Pendaftaran Unit Bank Sampah berhasil! Silakan login.");
        router.push("/auth/login");
      } else {
        toast.error(res.message || "Pendaftaran admin gagal");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal mendaftar admin unit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <UserPlus size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Akun Baru</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pilih jenis akun yang ingin didaftarkan.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setTab("nasabah")}
            className={`py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              tab === "nasabah"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User size={16} /> Sebagai Nasabah
          </button>
          <button
            type="button"
            onClick={() => setTab("admin")}
            className={`py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              tab === "admin"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 size={16} /> Admin Unit Bank
          </button>
        </div>

        {/* Nasabah Registration Form */}
        {tab === "nasabah" && (
          <form onSubmit={handleNasabahSubmit(onNasabahSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Nasabah
                </label>
                <input
                  {...regNasabah("username", { required: "Wajib diisi" })}
                  placeholder="nasabah_budi"
                  className=" text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                {errorsNasabah.username && (
                  <p className="text-xs text-red-500 mt-1">{errorsNasabah.username.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  {...regNasabah("password", {
                    required: "Wajib diisi",
                    minLength: { value: 6, message: "Min 6 karakter" },
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                {errorsNasabah.password && (
                  <p className="text-xs text-red-500 mt-1">{errorsNasabah.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className=" block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Nasabah
              </label>
              <input
                {...regNasabah("namaNasabah", { required: "Wajib diisi" })}
                placeholder="Budi Santoso"
                className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              {errorsNasabah.namaNasabah && (
                <p className="text-xs text-red-500 mt-1">{errorsNasabah.namaNasabah.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                {...regNasabah("telp", { required: "Wajib diisi" })}
                placeholder="081234567890"
                className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              {errorsNasabah.telp && (
                <p className="text-xs text-red-500 mt-1">{errorsNasabah.telp.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Domisili
              </label>
              <textarea
                {...regNasabah("alamat", { required: "Wajib diisi" })}
                rows={2}
                placeholder="Jl. Merdeka No. 10, RT 01/02"
                className="text-black w-full border border-slate-300 px-3.5 py-2 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
              {errorsNasabah.alamat && (
                <p className="text-xs text-red-500 mt-1">{errorsNasabah.alamat.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Foto Profil (Opsional)
              </label>
              {nasabahFoto && (
                <div className="mb-2 flex items-center gap-3 p-2 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                  <img
                    src={URL.createObjectURL(nasabahFoto)}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-200"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-emerald-800">Foto Dipilih</p>
                    <p className="text-emerald-600 text-[10px]">{nasabahFoto.name}</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNasabahFoto(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Mendaftarkan..." : "Daftar sebagai Nasabah"}
            </button>
          </form>
        )}

        {/* Admin Registration Form */}
        {tab === "admin" && (
          <form onSubmit={handleAdminSubmit(onAdminSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Admin
                </label>
                <input
                  {...regAdmin("username", { required: "Wajib diisi" })}
                  placeholder="admin_banksampah"
                  className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {errorsAdmin.username && (
                  <p className="text-xs text-red-500 mt-1">{errorsAdmin.username.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  {...regAdmin("password", {
                    required: "Wajib diisi",
                    minLength: { value: 6, message: "Min 6 karakter" },
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {errorsAdmin.password && (
                  <p className="text-xs text-red-500 mt-1">{errorsAdmin.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Unit Bank Sampah
              </label>
              <input
                {...regAdmin("namaUnit", { required: "Wajib diisi" })}
                placeholder="Bank Sampah Asri Jaya"
                className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errorsAdmin.namaUnit && (
                <p className="text-xs text-red-500 mt-1">{errorsAdmin.namaUnit.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Penanggung Jawab / Pengelola
              </label>
              <input
                {...regAdmin("namaPengelola", { required: "Wajib diisi" })}
                placeholder="Bapak H. Sukirman"
                className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errorsAdmin.namaPengelola && (
                <p className="text-xs text-red-500 mt-1">{errorsAdmin.namaPengelola.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Kontak Operasional
              </label>
              <input
                {...regAdmin("telp", { required: "Wajib diisi" })}
                placeholder="081234567890"
                className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errorsAdmin.telp && (
                <p className="text-xs text-red-500 mt-1">{errorsAdmin.telp.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Mendaftarkan..." : "Daftar Unit Bank Sampah"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <div>
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="text-emerald-600 font-semibold hover:underline">
              Masuk di Sini
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
