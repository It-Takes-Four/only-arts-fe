import { Button } from "./button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationData {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Alternative interface for different pagination formats
export interface PaginationDataAlt {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Helper function to normalize pagination data
export function normalizePaginationData(pagination: PaginationData | PaginationDataAlt): PaginationData {
  if ('currentPage' in pagination) {
    return pagination;
  }
  // Convert alternative format to standard format
  return {
    currentPage: pagination.page,
    perPage: pagination.limit,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.hasNextPage,
    hasPrevPage: pagination.hasPrevPage,
  };
}

interface PaginationProps {
  pagination: PaginationData | PaginationDataAlt;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ pagination, onPageChange, className = "" }: PaginationProps) {
  const normalizedPagination = normalizePaginationData(pagination);
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = normalizedPagination;

  console.log("Pagination data:", normalizedPagination);

  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Show 5 pages around current page
    
    if (totalPages <= showPages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of middle section
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if there's a gap
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if there's a gap
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="sm"
                disabled
                className="w-8 h-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="w-8 h-8 p-0"
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
