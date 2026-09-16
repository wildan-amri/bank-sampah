"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Recycle,
  Gift,
  ArrowDownToLine,
  ArrowLeftRight,
  BarChart3,
  UserCircle,
  LogOut,
  Sparkles,
} from "lucide-react";
import { logout } from "@/lib/auth";
import toast from "react-hot-toast";

const menus = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Data Nasabah",
    href: "/admin/nasabah",
    icon: Users,
  },
  {
    name: "Kategori Sampah",
    href: "/admin/kategori",
    icon: Recycle,
  },
  {
    name: "Katalog Hadiah",
    href: "/admin/hadiah",
    icon: Gift,
  },
  {
    name: "Setoran Sampah",
    href: "/admin/setor",
    icon: ArrowDownToLine,
  },
  {
    name: "Penukaran Poin",
    href: "/admin/penukaran",
    icon: ArrowLeftRight,
  },
  {
    name: "Rekapitulasi",
    href: "/admin/rekapitulasi",
    icon: BarChart3,
  },
  {
    name: "Profil Unit",
    href: "/admin/profile",
    icon: UserCircle,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar.");
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-indigo-500/30">
          <Recycle size={20} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-tight">
            Bank Sampah
          </h1>
          <p className="text-[11px] font-medium text-indigo-600">Panel Administrator</p>
        </div>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active =
            pathname === menu.href ||
            (menu.href !== "/admin/dashboard" && pathname.startsWith(menu.href));

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                active
                  ? "bg-indigo-50 text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} className={active ? "text-indigo-600" : "text-slate-400"} />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut size={18} />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}