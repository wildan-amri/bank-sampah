"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Recycle,
  ShieldCheck,
  User,
  Database,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";
import { getToken, getRole } from "@/lib/auth";
import { seedDummyData } from "@/services/maker.service";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
    setUserRole(getRole());
  }, []);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      toast.loading("Membuat data awal (seed data)...", { id: "seed" });
      const res = await seedDummyData();
      if (res.success) {
        toast.success(
          "Dummy sample data berhasil dibuat! Akun default siap digunakan.",
          { id: "seed" }
        );
      } else {
        toast.error(res.message || "Gagal membuat sample data", { id: "seed" });
      }
    } catch (err: any) {
      toast.error(
        err.friendlyMessage || "Gagal menjalankan seed dummy data",
        { id: "seed" }
      );
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-emerald-100/30">
      {/* Top Navbar */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-800 tracking-tight">
                Bank Sampah <span className="text-emerald-600">Digital</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                UKK RPL Paket A
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href={userRole === "ADMIN" ? "/admin/dashboard" : "/nasabah/dashboard"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-sm transition"
              >
                Dashboard {userRole === "ADMIN" ? "Admin" : "Nasabah"}
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm text-sm"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition shadow-sm text-sm"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={14} /> Eco-Waste Management System
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Solusi Digital Penyetoran & Daur Ulang Sampah
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Platform modern pengelolaan bank sampah multi-tenant: setorkan sampah daur ulang, kumpulkan poin reward, tukarkan dengan voucher dan sembako, serta pantau tonase bulanan secara real-time.
          </p>

          {/* Quick CTA */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition"
            >
              Mulai Masuk Aplikasi
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 font-semibold hover:bg-slate-50 border border-slate-200 shadow-sm transition"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </div>

        {/* Portals Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Nasabah Portal Card */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User size={26} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Portal Nasabah</h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Khusus siswa dan masyarakat penyetor sampah. Ajukan penjemputan sampah, lihat daftar harga kategori, kumpulkan poin, dan tukarkan voucher.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Pengajuan setor sampah multi-item & estimasi bobot</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Katalog hadiah voucher pulsa & sembako</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Histori transaksi & cetak struk nota resmi</span>
              </li>
            </ul>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Masuk sebagai Nasabah <ArrowRight size={16} />
            </Link>
          </div>

          {/* Admin Portal Card */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={26} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Panel Admin Bank</h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Pengelolaan operasional unit bank sampah: verifikasi penimbangan real, kelola master kategori sampah, data nasabah, dan pelaporan tonase.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-500" />
                <span>Verifikasi timbangan riil & approval setoran</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-500" />
                <span>CRUD Kategori Sampah, Nasabah & Katalog Hadiah</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-500" />
                <span>Rekapitulasi total tonase sampah & estimasi rupiah</span>
              </li>
            </ul>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Masuk sebagai Admin <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Demo Accounts Quick Guide */}
        <div className="mt-12 p-6 rounded-2xl bg-white/70 border border-slate-200/80 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Award className="text-amber-500" size={18} />
              Panduan Akun Demo Ujian
            </h3>
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold shadow-xs transition self-start sm:self-auto cursor-pointer"
            >
              <Database size={13} />
              {isSeeding ? "Memproses Data..." : "Inisialisasi Sample Data (1-Klik)"}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-medium text-slate-700">Akun Admin Bank Sampah:</p>
              <p className="text-slate-500 mt-1">Username: <span className="font-mono text-slate-800 font-semibold">admin_banksampah</span></p>
              <p className="text-slate-500">Password: <span className="font-mono text-slate-800 font-semibold">admin123</span></p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-medium text-slate-700">Akun Nasabah:</p>
              <p className="text-slate-500 mt-1">Username: <span className="font-mono text-slate-800 font-semibold">nasabah_budi</span> / <span className="font-mono text-slate-800 font-semibold">nasabah_siti</span></p>
              <p className="text-slate-500">Password: <span className="font-mono text-slate-800 font-semibold">password123</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
