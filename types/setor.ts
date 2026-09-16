export type SetorStatus =
  | "menunggu_konfirmasi"
  | "diverifikasi"
  | "selesai"
  | "ditolak";

export interface ItemSetorDto {
  kategoriSampahId: string;
  beratKg: number;
}

export interface CreateSetorSampahDto {
  tanggal: string;
  catatan: string;
  items: ItemSetorDto[];
}

export interface VerifyItemSetorDto {
  kategoriSampahId: string;
  beratKgReal: number;
}

export interface VerifySetorSampahDto {
  status: "diverifikasi" | "ditolak" | "selesai";
  catatanAdmin: string;
  itemsReal?: VerifyItemSetorDto[];
}

export interface DetailSetorItem {
  kategoriSampahId?: string;
  kategori?: string;
  namaKategori?: string;
  jenis?: string;
  beratKg: number;
  beratKgReal?: number;
  poinPerKg?: number;
  subtotalPoin?: number;
  kategoriSampah?: {
    namaKategori: string;
    jenis: string;
    hargaPerKg?: number;
    poinPerKg?: number;
  };
}

export interface SetorTransaksi {
  id: string;
  kodeSetor: string;
  tanggal: string;
  status: SetorStatus;
  totalBeratKg: number;
  totalPoin?: number;
  estimasiTotalPoin?: number;
  catatan?: string;
  catatanAdmin?: string;
  nasabah?: {
    id?: string;
    namaNasabah: string;
    alamat?: string;
    telp: string;
  };
  detailSetors?: DetailSetorItem[];
  createdAt?: string;
}
