"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createNasabah } from "@/services/nasabah.service";
import toast from "react-hot-toast";
import { ArrowLeft, UserPlus, Upload } from "lucide-react";

export default function AdminTambahNasabahPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      namaNasabah: "",
      alamat: "",
      telp: "",
    },
  });

  async function onSubmit(data: any) {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("namaNasabah", data.namaNasabah);
      formData.append("alamat", data.alamat);
      formData.append("telp", data.telp);
      if (foto) {
        formData.append("foto", foto);
      }

      const res = await createNasabah(formData);
      if (res.success) {
        toast.success("Nasabah baru berhasil ditambahkan!");
        router.push("/admin/nasabah");
      } else {
        toast.error(res.message || "Gagal menambah nasabah");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal menambah data nasabah");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/nasabah"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tambah Nasabah Baru</h1>
          <p className="text-xs text-slate-500">
            Daftarkan nasabah baru secara manual oleh Admin
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username Baru
              </label>
              <input
                {...register("username", { required: "Username wajib diisi" })}
                placeholder="nasabah_dewi"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
                {...register("password", {
                  required: "Password wajib diisi",
                  minLength: { value: 6, message: "Min 6 karakter" },
                })}
                type="password"
                placeholder="••••••••"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Nasabah
            </label>
            <input
              {...register("namaNasabah", { required: "Nama wajib diisi" })}
              placeholder="Dewi Lestari"
              className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.namaNasabah && (
              <p className="text-xs text-red-500 mt-1">{errors.namaNasabah.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Telepon
            </label>
            <input
              {...register("telp", { required: "Nomor telepon wajib diisi" })}
              placeholder="081987654321"
              className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.telp && (
              <p className="text-xs text-red-500 mt-1">{errors.telp.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              {...register("alamat", { required: "Alamat wajib diisi" })}
              rows={2}
              placeholder="Jl. Kenanga No. 5"
              className="w-full border border-slate-300 px-3.5 py-2 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
            {errors.alamat && (
              <p className="text-xs text-red-500 mt-1">{errors.alamat.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Foto Profil Nasabah (Opsional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Link
              href="/admin/nasabah"
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Nasabah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
