export interface NasabahItem {
  id: string;
  namaNasabah: string;
  alamat: string;
  telp: string;
  saldoPoin: number;
  foto?: string | null;
  user?: {
    username: string;
    role: string;
  };
  createdAt?: string;
}

export interface CreateNasabahDto {
  username: string;
  password: string;
  namaNasabah: string;
  alamat: string;
  telp: string;
  foto?: File | null;
}

export interface UpdateNasabahDto {
  namaNasabah?: string;
  namaLengkap?: string;
  alamat: string;
  telp?: string;
  noTelepon?: string;
  tanggalLahir?: string;
  foto?: File | null;
}
