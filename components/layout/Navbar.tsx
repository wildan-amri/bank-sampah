"use client";

import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";

export default function Navbar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername =
      localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <div>
        <h2 className="font-semibold text-gray-800">
          Bank Sampah Digital
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <UserCircle size={32} />

        <div>
          <p className="text-sm font-medium">
            {username || "User"}
          </p>

          <p className="text-xs text-gray-500">
            Pengguna
          </p>
        </div>
      </div>

    </header>
  );
}