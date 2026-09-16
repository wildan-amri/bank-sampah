"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  Building2,
  Phone,
  KeyRound,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { getMe } from "@/services/auth.service";
import { getUser, getAppKey, logout, resetTenant } from "@/lib/auth";
import { UserAuthData, AdminProfile } from "@/types/auth";
import toast from "react-hot-toast";

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserAuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [appKey, setAppKey] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        // 1. Prioritize authenticated admin session from login/register
        const currentUser = getUser();
        if (currentUser) {
          setProfile(currentUser);
        }

        // 2. Fetch getMe() from backend, but verify it matches the current logged in admin
        try {
          const res = await getMe();
          if (
            res.success &&
            res.data &&
            res.data.role === "ADMIN" &&
            (!currentUser || res.data.username === currentUser.username)
          ) {
            setProfile(res.data);
          }
        } catch {
          // Backend getMe failure or mismatch, keep authenticated session
        }
      } catch (err: any) {
        toast.error(err.friendlyMessage || "Gagal memuat profil admin");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    setAppKey(getAppKey());
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar.");
    router.push("/auth/login");
  };

  const handleResetTenant = () => {
    if (
      confirm(
        "PERINGATAN: Mereset tenant akan menghapus App Key dan seluruh sesi di browser ini. Lanjutkan?"
      )
    ) {
      resetTenant();
      toast.success("Tenant telah direset. Silakan daftarkan atau pasang key baru.");
      router.push("/");
    }
  };

  if (loading && !profile) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        Memuat profil admin...
      </div>
    );
  }

  const adminBank: AdminProfile | undefined = profile?.adminBank || undefined;
  const unitName = adminBank?.namaUnit || "Unit Bank Sampah";
  const pengelolaName = adminBank?.namaPengelola || profile?.username || "Administrator";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profil Administrator</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Informasi akun dan identitas unit Bank Sampah terdaftar
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl border border-indigo-200">
            {profile?.username?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">
                @{profile?.username || "admin"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 flex items-center gap-1">
                <ShieldCheck size={12} /> Administrator
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Penanggung Jawab: <b>{pengelolaName}</b>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              User ID: {profile?.id || "-"}
            </p>
          </div>
        </div>

        {/* Bank Unit Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Informasi Unit Bank Sampah
          </h3>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Nama Unit:</span>
              <span className="font-bold text-slate-800 text-sm">
                {unitName}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Penanggung Jawab:</span>
              <span className="font-bold text-slate-800 text-sm">
                {pengelolaName}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Kontak Operasional:</span>
              <span className="font-bold text-slate-800 text-sm">
                {adminBank?.telp || "-"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">ID Admin Unit:</span>
              <span className="font-mono text-slate-600 text-[11px] truncate block">
                {adminBank?.id || profile?.id || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Tenant Key Info */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Konfigurasi Kunci Tenant (x-app-key)
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                <KeyRound size={14} className="text-emerald-600" />
                App Key Aktif
              </p>
              <p className="font-mono text-xs font-semibold text-slate-800 mt-1 select-all break-all">
                {appKey || "Tidak ditemukan"}
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone / Logout */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleResetTenant}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
          >
            Reset App Key / Ganti Siswa
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <LogOut size={15} />
            Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  );
}
