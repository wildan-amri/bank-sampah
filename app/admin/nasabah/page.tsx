"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Edit2,
  Award,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { getNasabah, deleteNasabah } from "@/services/nasabah.service";
import { NasabahItem } from "@/types/nasabah";
import { formatPoin, getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminNasabahPage() {
  const [list, setList] = useState<NasabahItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNasabah = async () => {
    try {
      setLoading(true);
      const res = await getNasabah();
      if (res.success) {
        setList(res.data || []);
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal mengambil daftar nasabah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNasabah();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus data nasabah "${name}"?`)) return;

    try {
      const res = await deleteNasabah(id);
      if (res.success) {
        toast.success(`Nasabah ${name} berhasil dihapus`);
        setList((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(res.message || "Gagal menghapus nasabah");
      }
    } catch (err: any) {
      toast.error(err.friendlyMessage || "Gagal menghapus nasabah");
    }
  };

  const filtered = list.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.namaNasabah?.toLowerCase().includes(q) ||
      item.user?.username?.toLowerCase().includes(q) ||
      item.telp?.includes(q) ||
      item.alamat?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kelola Data Nasabah</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar seluruh nasabah terdaftar di unit Bank Sampah
          </p>
        </div>

        <Link
          href="/admin/nasabah/tambah"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition self-start sm:self-auto"
        >
          <UserPlus size={16} />
          Tambah Nasabah Baru
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
        <Search size={18} className="text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama nasabah, username, telepon, atau alamat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-black flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-slate-400 hover:text-slate-600 px-2"
          >
            Reset
          </button>
        )}
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Memuat data nasabah...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Tidak ada data nasabah yang cocok.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nasabah</th>
                  <th className="py-3 px-4">Kontak</th>
                  <th className="py-3 px-4">Alamat Domisili</th>
                  <th className="py-3 px-4">Saldo Poin</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
                          {item.foto ? (
                            <img
                              src={getImageUrl(item.foto)}
                              alt={item.namaNasabah}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                                const fallback = e.currentTarget.parentElement?.querySelector(".fallback-text");
                                if (fallback) (fallback as HTMLElement).classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <span
                            className={`font-bold text-slate-500 text-sm fallback-text ${
                              item.foto ? "hidden" : "block"
                            }`}
                          >
                            {item.namaNasabah?.charAt(0) || "N"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {item.namaNasabah}
                          </p>
                          <p className="text-[11px] text-indigo-600 font-mono">
                            @{item.user?.username || "nasabah"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone size={13} className="text-slate-400" />
                        <span>{item.telp || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{item.alamat || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Award size={13} /> {formatPoin(item.saldoPoin)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/nasabah/${item.id}`}
                          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Edit Nasabah"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.namaNasabah)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus Nasabah"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
