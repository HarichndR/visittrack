import { useState, useCallback } from 'react';

export function usePagination(initialPage = 1, initialLimit = 50) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page on limit change
  }, []);

  return {
    page,
    limit,
    setPage,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
  };
}
