"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationControlProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  limit: number;
}

export function PaginationControl({
  page,
  totalPages,
  onPageChange,
  totalResults,
  limit
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalResults);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 px-2">
      <div className="text-sm font-bold text-muted-foreground whitespace-nowrap">
        Showing <span className="text-white">{start}</span>–<span className="text-white">{end}</span> of <span className="text-white">{totalResults}</span> records
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="h-12 w-12 border-white/10 hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronsLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-12 w-14 border-white/10 hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 px-4 h-12 bg-white/5 border border-white/10 rounded-xl">
           <span className="text-sm font-bold">Page</span>
           <span className="text-sm font-black text-primary underline underline-offset-4">{page}</span>
           <span className="text-sm font-bold text-muted-foreground">of {totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="h-12 w-14 border-white/10 hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="h-12 w-12 border-white/10 hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronsRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
