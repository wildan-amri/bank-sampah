export interface KategoriRekapItem {
  tonaseKg: number;
  rupiah: number;
  poin: number;
}

export interface RekapitulasiBulanan {
  periode: string;
  rekapitulasiTonase: {
    totalKg: number;
    totalTon: number;
    totalEstimasiPembayaranRupiah: number;
    totalPoinDiterbitkan: number;
  };
  breakdownJenisSampah: {
    plastik: KategoriRekapItem;
    kertas: KategoriRekapItem;
    logam: KategoriRekapItem;
    kaca: KategoriRekapItem;
  };
  rekapitulasiPenukaranPoin: {
    totalTransaksiPenukaran: number;
    totalPoinTerpakai: number;
  };
}
