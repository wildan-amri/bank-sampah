export type JenisSampah = "plastik" | "kertas" | "logam" | "kaca";

export interface KategoriSampah {
  id: string;
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  jenis: JenisSampah;
  foto?: string | null;
  createdAt?: string;
}

export interface CreateKategoriDto {
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  jenis: JenisSampah;
  foto?: File | null;
}

export interface UpdateKategoriDto {
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  jenis: JenisSampah;
  foto?: File | null;
}
