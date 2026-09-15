"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Recycle,
  History,
  Gift,
  ArrowLeftRight,
  UserCircle,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/nasabah/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Kategori Sampah",
    href: "/nasabah/kategori",
    icon: Recycle,
  },
  {
    name: "Setor Sampah",
    href: "/nasabah/setor",
    icon: History,
  },
  {
    name: "Hadiah",
    href: "/nasabah/hadiah",
    icon: Gift,
  },
  {
    name: "Penukaran Poin",
    href: "/nasabah/penukaran",
    icon: ArrowLeftRight,
  },
  {
    name: "Profil",
    href: "/nasabah/profile",
    icon: UserCircle,
  },
];

export default function NasabahSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r">

      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-green-700">
          🌱 Bank Sampah
        </h1>

        <p className="text-sm text-gray-500">
          Panel Nasabah
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
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

    </aside>
  );
}