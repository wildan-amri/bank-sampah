"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  Phone,
  MapPin,
  Award,
  KeyRound,
  LogOut,
  Sparkles,
} from "lucide-react";
import { getMe } from "@/services/auth.service";
import { getNasabahDashboard } from "@/services/dashboard.service";
import { getUser, getAppKey, logout, resetTenant, saveAuth, getToken, getRole } from "@/lib/auth";
import { UserAuthData, NasabahProfile } from "@/types/auth";
import { formatPoin, getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

export default function NasabahProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserAuthData | null>(null);
  const [saldoPoin, setSaldoPoin] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [appKey, setAppKey] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        // 1. Load initial user data from authenticated session
        const currentUser = getUser();
        if (currentUser) {
          setProfile(currentUser);
          if (currentUser.nasabah?.saldoPoin !== undefined) {
            setSaldoPoin(currentUser.nasabah.saldoPoin);
          }
        }

        // 2. Fetch fresh dashboard summary (accurately tracks current nasabah points)
        try {
          const dashRes = await getNasabahDashboard();
          if (dashRes.success && dashRes.data) {
            const currentPoints =
              (dashRes.data as any).saldoPoin ??
              dashRes.data.saldoPoinSaatIni ??
              0;
            setSaldoPoin(currentPoints);

            // Sync with local session
            if (currentUser && currentUser.nasabah) {
              currentUser.nasabah.saldoPoin = currentPoints;
              const token = getToken();
              const role = getRole();
              if (token && role) {
                saveAuth(token, role, currentUser);
              }
            }
          }
        } catch {
          // Dashboard summary optional fallback
        }

        // 3. Check getMe() API, but only accept if it actually matches current nasabah
        try {
          const res = await getMe();
          if (
            res.success &&
            res.data &&
            res.data.role === "NASABAH" &&
            (!currentUser || res.data.username === currentUser.username)
          ) {
            setProfile(res.data);
            if (res.data.nasabah?.saldoPoin !== undefined) {
              setSaldoPoin(res.data.nasabah.saldoPoin);
            }
          }
        } catch {
          // Keep currentUser from session
        }
      } catch (err: any) {
        toast.error(err.friendlyMessage || "Gagal memuat profil nasabah");
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
        "PERINGATAN: Mereset tenant akan menghapus App Key dan seluruh sesi browser ini. Lanjutkan?"
      )
    ) {
      resetTenant();
      toast.success("Tenant telah direset.");
      router.push("/");
    }
  };

  if (loading && !profile) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        Memuat profil nasabah...
      </div>
    );
  }

  const nasabah: NasabahProfile | undefined = profile?.nasabah || undefined;
  const displayName = nasabah?.namaNasabah || profile?.username || "Nasabah";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Informasi akun nasabah dan rincian saldo poin Bank Sampah
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-2xl border border-emerald-200 overflow-hidden shrink-0">
              {nasabah?.foto ? (
                <img
                  src={getImageUrl(nasabah.foto)}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              ) : null}
              <span className={nasabah?.foto ? "hidden" : "block"}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">
                  {displayName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Nasabah
                </span>
              </div>
              <p className="text-xs text-indigo-600 font-mono mt-0.5">
                @{profile?.username || "nasabah"}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
              <Award size={20} />
            </div>
            <div>
              <span className="text-[10px] text-emerald-700 font-medium block">
                Saldo Poin Reward
              </span>
              <span className="text-lg font-extrabold text-emerald-800">
                {formatPoin(saldoPoin)}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Informasi Kontak & Domisili
          </h3>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <Phone size={16} className="text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">
                  Nomor Telepon:
                </span>
                <span className="font-semibold text-slate-800 text-sm">
                  {nasabah?.telp || "-"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
              <UserCircle size={16} className="text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">
                  ID Akun / Nasabah:
                </span>
                <span className="font-mono text-slate-700 text-xs truncate block max-w-[180px]">
                  {nasabah?.id || profile?.id || "-"}
                </span>
              </div>
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px]">
                  Alamat Lengkap:
                </span>
                <span className="font-medium text-slate-800 text-xs">
                  {nasabah?.alamat || "Alamat belum diatur"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Key Info */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Kunci Tenant Sistem (x-app-key)
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                <KeyRound size={14} className="text-emerald-600" />
                App Key Terhubung:
              </p>
              <p className="font-mono text-xs font-semibold text-slate-800 mt-1 select-all break-all">
                {appKey || "Tidak ditemukan"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleResetTenant}
            className="text-xs text-slate-500 hover:text-rose-600 font-medium underline cursor-pointer"
          >
            Reset App Key / Ganti Akun Siswa
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <LogOut size={15} />
            Keluar Akun
          </button>
        </div>
      </div>
    </div>
  );
}
