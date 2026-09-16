export interface NasabahDashboardSummary {
  // Support both live backend and PDF mock field names
  saldoPoin?: number;
  saldoPoinSaatIni?: number;
  totalSampahDisetorKg?: number;
  totalPengajuanSetor?: number;
  totalPoinDiperoleh?: number;
  totalPoinDidapat?: number;
  totalPenukaranHadiah?: number;
  totalPoinDitukar?: number;
  setorTerakhir?: any[] | any;
  transaksiTerakhirSetor?: any;
  penukaranTerakhir?: any[] | any;
  transaksiTerakhirTukar?: any;
}

export interface AdminDashboardStats {
  totalNasabah: number;
  totalKategoriSampah: number;
  totalTransaksiSetor: number;
  totalHadiah: number;
  totalBeratSampahKg: number;
  totalPoinTersalurkan: number;
}
