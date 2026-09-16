export type PenukaranStatus = "diproses" | "selesai";

export interface CreatePenukaranPoinDto {
  hadiahId: string;
}

export interface PenukaranTransaksi {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  hadiahId?: string;
  poinTerpakai: number;
  sisaSaldoPoin?: number;
  status: PenukaranStatus;
  hadiah?: {
    id?: string;
    namaHadiah: string;
    poinDibutuhkan?: number;
    foto?: string | null;
  };
  nasabah?: {
    id?: string;
    namaNasabah: string;
    telp: string;
    alamat?: string;
  };
}
