"use client";

import { useEffect, useState } from "react";
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  X,
  Award,
  PackageCheck,
} from "lucide-react";
import {
  getHadiah,
  createHadiah,
  updateHadiah,
  deleteHadiah,
} from "@/services/hadiah.service";
import { Hadiah } from "@/types/hadiah";
import { formatPoin, getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminHadiahPage() {
  const [list, setList] = useState<Hadiah[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Hadiah | null>(null);
  const [formNama, setFormNama] = useState("");
  const [formPoin, setFormPoin] = useState<number>(0);
  const [formStok, setFormStok] = useState<number>(0);
  const [formFoto, setFormFoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchHadiah = async () => {
    try {
      setLoading(true);
      const res = await getHadiah();
      if (res.success) {
        setList(res.data || []);
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memuat katalog hadiah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHadiah();
  }, []);

  const openCreateModal = () => {
    setEditItem(null);
    setFormNama("");
    setFormPoin(0);
    setFormStok(10);
    setFormFoto(null);
    setModalOpen(true);
  };

  const openEditModal = (item: Hadiah) => {
    setEditItem(item);
    setFormNama(item.namaHadiah);
    setFormPoin(item.poinDibutuhkan);
    setFormStok(item.stok);
    setFormFoto(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) {
      toast.error("Nama barang/voucher wajib diisi");
      return;
    }
    if (formPoin <= 0) {
      toast.error("Poin dibutuhkan harus lebih dari 0");
      return;
    }
    if (formStok < 0) {
      toast.error("Stok tidak boleh negatif");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("namaHadiah", formNama.trim());
      formData.append("poinDibutuhkan", formPoin.toString());
      formData.append("stok", formStok.toString());
      if (formFoto) {
        formData.append("foto", formFoto);
      }

      if (editItem) {
        const res = await updateHadiah(editItem.id, formData);
        if (res.success) {
          toast.success("Data hadiah berhasil diperbarui!");
          setModalOpen(false);
          fetchHadiah();
        } else {
          toast.error(res.message || "Gagal update hadiah");
        }
      } else {
        const res = await createHadiah(formData);
        if (res.success) {
          toast.success("Hadiah baru berhasil ditambahkan!");
          setModalOpen(false);
          fetchHadiah();
        } else {
          toast.error(res.message || "Gagal menambah hadiah");
        }
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal memproses data hadiah");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus hadiah "${name}"?`)) return;
    try {
      const res = await deleteHadiah(id);
      if (res.success) {
        toast.success(`Hadiah "${name}" berhasil dihapus`);
        setList((prev) => prev.filter((h) => h.id !== id));
      } else {
        toast.error(res.message || "Gagal menghapus hadiah");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal menghapus hadiah");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Katalog Barang & Voucher Hadiah
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar reward yang dapat ditukarkan nasabah dengan saldo poin
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Tambah Hadiah Baru
        </button>
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
          Belum ada data barang / voucher hadiah.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col"
            >
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

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {item.namaHadiah}
                  </h3>
                  <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <span className="text-xs text-indigo-700 font-medium">
                      Poin Dibutuhkan
                    </span>
                    <span className="font-bold text-indigo-800 text-sm flex items-center gap-1">
                      <Award size={16} /> {item.poinDibutuhkan} Poin
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                    title="Edit Hadiah"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.namaHadiah)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Hapus Hadiah"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
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
              {editItem ? "Edit Hadiah / Voucher" : "Tambah Hadiah Baru"}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Pengaturan barang atau voucher reward penukaran poin
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Barang / Voucher Hadiah
                </label>
                <input
                  type="text"
                  placeholder="Voucher Pulsa Rp 25.000 / Minyak Goreng 1L"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Poin Dibutuhkan
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={formPoin || ""}
                    onChange={(e) => setFormPoin(Number(e.target.value))}
                    className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ketersediaan Stok
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="50"
                    value={formStok || ""}
                    onChange={(e) => setFormStok(Number(e.target.value))}
                    className="text-black w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Foto Produk Hadiah (Opsional)
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
                  {submitting ? "Menyimpan..." : "Simpan Hadiah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
