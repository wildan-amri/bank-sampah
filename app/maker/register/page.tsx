"use client";

import { useForm } from "react-hook-form";
import { registerMaker } from "@/services/maker.service";

interface FormData {
  email: string;
  password: string;
  namaSiswa: string;
  kelas: string;
  namaApp: string;
}

export default function MakerRegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    try {
      const result = await registerMaker(data);

      console.log(result);

      alert("Registrasi berhasil");
    } catch (error) {
      console.error(error);

      alert("Registrasi gagal");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold">
          Registrasi Maker
        </h1>

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border p-3 rounded"
        />

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
        />

        <input
          {...register("namaSiswa")}
          placeholder="Nama Siswa"
          className="w-full border p-3 rounded"
        />

        <input
          {...register("kelas")}
          placeholder="Kelas"
          className="w-full border p-3 rounded"
        />

        <input
          {...register("namaApp")}
          placeholder="Nama Aplikasi"
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          Daftar
        </button>
      </form>
    </main>
  );
}