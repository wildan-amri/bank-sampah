"use client";

import { useEffect, useState } from "react";
import {
  Recycle,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Sparkles,
  Award,
  Coins,
} from "lucide-react";
import {
  getKategori,
  createKategori,
  updateKategori,
  deleteKategori,
} from "@/services/kategori.service";
import { KategoriSampah, JenisSampah } from "@/types/kategori";
import { formatRupiah, formatPoin, getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminKategoriPage() {
  const [list, setList] = useState<KategoriSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJenis, setSelectedJenis] = useState<string>("semua");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<KategoriSampah | null>(null);
  const [formNama, setFormNama] = useState("");
  const [formHarga, setFormHarga] = useState<number>(0);
  const [formPoin, setFormPoin] = useState<number>(0);
  const [formJenis, setFormJenis] = useState<JenisSampah>("plastik");
  const [formFoto, setFormFoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchKategori = async () => {
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
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const openCreateModal = () => {
    setEditItem(null);
    setFormNama("");
    setFormHarga(0);
    setFormPoin(0);
    setFormJenis("plastik");
    setFormFoto(null);
    setModalOpen(true);
  };

  const openEditModal = (item: KategoriSampah) => {
    setEditItem(item);
    setFormNama(item.namaKategori);
    setFormHarga(item.hargaPerKg);
    setFormPoin(item.poinPerKg);
    setFormJenis(item.jenis);
    setFormFoto(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }
    if (formHarga <= 0) {
      toast.error("Harga per kg harus lebih dari 0");
      return;
    }
    if (formPoin <= 0) {
      toast.error("Poin per kg harus lebih dari 0");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("namaKategori", formNama.trim());
      formData.append("hargaPerKg", formHarga.toString());
      formData.append("poinPerKg", formPoin.toString());
      formData.append("jenis", formJenis);
      if (formFoto) {
        formData.append("foto", formFoto);
      }

      if (editItem) {
        const res = await updateKategori(editItem.id, formData);
        if (res.success) {
          toast.success("Kategori sampah berhasil diperbarui!");
          setModalOpen(false);
          fetchKategori();
        } else {
          toast.error(res.message || "Gagal update kategori");
        }
      } else {
        const res = await createKategori(formData);
        if (res.success) {
          toast.success("Kategori sampah baru berhasil disimpan!");
          setModalOpen(false);
          fetchKategori();
        } else {
          toast.error(res.message || "Gagal menyimpan kategori");
        }
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memproses kategori sampah");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    try {
      const res = await deleteKategori(id);
      if (res.success) {
        toast.success(`Kategori "${name}" berhasil dihapus`);
        setList((prev) => prev.filter((k) => k.id !== id));
      } else {
        toast.error(res.message || "Gagal menghapus kategori");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal menghapus kategori");
    }
  };

  const filtered = list.filter((k) => {
    if (selectedJenis === "semua") return true;
    return k.jenis === selectedJenis;
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
            Master Kategori Sampah
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar jenis sampah daur ulang beserta harga beli & nilai reward poin
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Tambah Kategori Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["semua", "plastik", "kertas", "logam", "kaca"].map((j) => (
          <button
            key={j}
            onClick={() => setSelectedJenis(j)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              selectedJenis === j
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {j}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
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
          Belum ada kategori sampah pada filter ini.
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

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                    title="Edit Kategori"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.namaKategori)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Hapus Kategori"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-slate-800 mb-1">
              {editItem ? "Edit Kategori Sampah" : "Tambah Kategori Sampah"}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Isi parameter kategori daur ulang dengan benar
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Spesifik Kategori
                </label>
                <input
                  type="text"
                  placeholder="Botol Plastik PET Bersih"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga / Kg (Rp)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="3500"
                    value={formHarga || ""}
                    onChange={(e) => setFormHarga(Number(e.target.value))}
                    className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Poin / Kg
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="10"
                    value={formPoin || ""}
                    onChange={(e) => setFormPoin(Number(e.target.value))}
                    className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Golongan
                </label>
                <select
                  value={formJenis}
                  onChange={(e) => setFormJenis(e.target.value as JenisSampah)}
                  className="text-black w-full border border-slate-300 px-3 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="plastik">Plastik</option>
                  <option value="kertas">Kertas</option>
                  <option value="logam">Logam</option>
                  <option value="kaca">Kaca</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Foto Sampah (Opsional)
                </label>
                {(formFoto || (editItem && editItem.foto)) && (
                  <div className="mb-2 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <img
                      src={
                        formFoto
                          ? URL.createObjectURL(formFoto)
                          : getImageUrl(editItem?.foto)
                      }
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-700">
                        {formFoto ? "Foto Baru Dipilih" : "Foto Saat Ini"}
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        {formFoto
                          ? formFoto.name
                          : "Pilih file baru jika ingin mengganti"}
                      </p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormFoto(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
