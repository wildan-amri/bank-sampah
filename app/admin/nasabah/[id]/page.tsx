"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { getNasabahById, updateNasabah } from "@/services/nasabah.service";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Award } from "lucide-react";
import { formatPoin, getImageUrl } from "@/lib/utils";

export default function AdminEditNasabahPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState<string | null>(null);
  const [saldoPoin, setSaldoPoin] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      namaNasabah: "",
      alamat: "",
      telp: "",
    },
  });

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getNasabahById(id);
        if (res.success && res.data) {
          reset({
            namaNasabah: res.data.namaNasabah || "",
            alamat: res.data.alamat || "",
            telp: res.data.telp || "",
          });
          setCurrentFoto(res.data.foto || null);
          setSaldoPoin(res.data.saldoPoin || 0);
        }
      } catch (err: any) {
        toast.error(err.friendlyMessage || "Gagal memuat detail nasabah");
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id, reset]);

  async function onSubmit(data: any) {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("namaNasabah", data.namaNasabah);
      formData.append("namaLengkap", data.namaNasabah);
      formData.append("alamat", data.alamat);
      formData.append("telp", data.telp);
      formData.append("noTelepon", data.telp);
      if (foto) {
        formData.append("foto", foto);
      }

      const res = await updateNasabah(id, formData);
      if (res.success) {
        toast.success("Data nasabah berhasil diperbarui!");
        router.push("/admin/nasabah");
      } else {
        toast.error(res.message || "Gagal memperbarui nasabah");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memperbarui data nasabah");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        Memuat data nasabah...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/nasabah"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Data Nasabah</h1>
            <p className="text-xs text-slate-500">ID: {id}</p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
          <Award size={14} /> {formatPoin(saldoPoin)}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Nasabah
            </label>
            <input
              {...register("namaNasabah", { required: "Nama wajib diisi" })}
              placeholder="Nama Nasabah"
              className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
              placeholder="08xxxxxxxxxx"
              className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.telp && (
              <p className="text-xs text-red-500 mt-1">{errors.telp.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Domisili
            </label>
            <textarea
              {...register("alamat", { required: "Alamat wajib diisi" })}
              rows={3}
              placeholder="Alamat lengkap"
              className="text-black w-full border border-slate-300 px-3.5 py-2 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
            {errors.alamat && (
              <p className="text-xs text-red-500 mt-1">{errors.alamat.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ganti Foto Profil (Opsional)
            </label>
            {(foto || currentFoto) && (
              <div className="mb-2 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                <img
                  src={foto ? URL.createObjectURL(foto) : getImageUrl(currentFoto)}
                  alt="Foto Profil"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
                <div className="text-xs">
                  <p className="font-semibold text-slate-700">
                    {foto ? "Foto Baru Dipilih" : "Foto Profil Saat Ini"}
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    {foto ? foto.name : "Akan tetap digunakan jika tidak diganti"}
                  </p>
                </div>
              </div>
            )}
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
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save size={14} />
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
