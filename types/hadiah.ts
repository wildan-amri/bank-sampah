export interface Hadiah {
  id: string;
  namaHadiah: string;
  poinDibutuhkan: number;
  stok: number;
  foto?: string | null;
  createdAt?: string;
}

export interface CreateHadiahDto {
  namaHadiah: string;
  poinDibutuhkan: number;
  stok: number;
  foto?: File | null;
}

export interface UpdateHadiahDto {
  namaHadiah: string;
  poinDibutuhkan: number;
  stok: number;
  foto?: File | null;
}
