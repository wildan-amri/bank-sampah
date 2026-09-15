"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Nasabah",
    href: "/admin/nasabah",
    icon: Users,
  },
  {
    name: "Kategori Sampah",
    href: "/admin/kategori",
    icon: Recycle,
  },
  {
    name: "Hadiah",
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
    name: "Profil",
    href: "/admin/profile",
    icon: UserCircle,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r">

      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-green-700">
          🌱 Bank Sampah
        </h1>

        <p className="text-sm text-gray-500">
          Panel Admin
        </p>
      </div>

      <nav className="p-4 space-y-1">

        {menus.map((menu) => {
          const Icon = menu.icon;

          const active =
            pathname === menu.href ||
            pathname.startsWith(menu.href + "/");

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active
                  ? "bg-green-100 text-green-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />

              <span>{menu.name}</span>
            </Link>
          );
        })}

      </nav>

      <div className="px-4 mt-4">
        <button
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}