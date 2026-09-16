export function formatRupiah(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatKg(weight: number | undefined | null): string {
  if (weight === undefined || weight === null || isNaN(weight)) return "0 Kg";
  return `${Number(weight).toLocaleString("id-ID", { maximumFractionDigits: 2 })} Kg`;
}

export function formatPoin(poin: number | undefined | null): string {
  if (poin === undefined || poin === null || isNaN(poin)) return "0 Poin";
  return `${Number(poin).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Poin`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Normalizes image paths to ensure both relative uploads (/uploads/...) and external URLs render properly
 */
export function getImageUrl(path?: string | null): string {
  if (!path || typeof path !== "string" || path.trim() === "") return "";
  const clean = path.trim();

  // If already absolute HTTP(S), data URI, or blob URL, return as-is
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("data:") ||
    clean.startsWith("blob:")
  ) {
    return clean;
  }

  // Prefix relative backend upload path with the configured API URL
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://learn.smktelkom-mlg.sch.id/bank_sampah"
  ).replace(/\/+$/, "");

  const normalizedPath = clean.startsWith("/") ? clean : `/${clean}`;
  return `${baseUrl}${normalizedPath}`;
}

