export type UserRole = "NASABAH" | "ADMIN";

export interface RegisterMakerDto {
  email: string;
  password: string;
  namaSiswa: string;
  kelas: string;
  namaApp: string;
}

export interface LoginMakerDto {
  email: string;
  password: string;
}

export interface MakerData {
  id: string;
  email: string;
  namaSiswa: string;
  kelas: string;
  namaApp: string;
  appKey: string;
  token?: string;
  createdAt?: string;
  stats?: {
    totalNasabah: number;
    totalKategoriSampah: number;
    totalTransaksiSetor: number;
    totalHadiah: number;
  };
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface RegisterNasabahDto {
  username: string;
  password: string;
  namaNasabah: string;
  alamat: string;
  telp: string;
  foto?: File | null;
}

export interface RegisterAdminDto {
  username: string;
  password: string;
  namaUnit: string;
  namaPengelola: string;
  telp: string;
}

export interface NasabahProfile {
  id: string;
  namaNasabah: string;
  alamat: string;
  telp: string;
  saldoPoin: number;
  foto?: string | null;
}

export interface AdminProfile {
  id: string;
  namaUnit: string;
  namaPengelola: string;
  telp: string;
}

export interface UserAuthData {
  id: string;
  username: string;
  role: UserRole;
  token?: string;
  nasabah?: NasabahProfile | null;
  adminBank?: AdminProfile | null;
}
