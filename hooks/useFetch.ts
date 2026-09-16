"use client";

import { useState, useEffect, useCallback } from "react";

export function useFetch<T>(fetcher: () => Promise<{ success: boolean; data: T; message?: string }>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetcher();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message || "Gagal mengambil data");
      }
    } catch (err: any) {
      setError(err.friendlyMessage || err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
