'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import ChevronLeftIcon from './ChevronLeftIcon';
import ChevronRightIcon from './ChevronRightIcon';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function Pagination({ totalItems, itemsPerPage, currentPage }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // AKILLI SAYFALANDIRMA 
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Ortada kaç sayı görünsün

    if (totalPages <= 7) {
      // Toplam sayfa azsa hepsini göster 
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Toplam sayfa çoksa özetle
      if (currentPage <= 4) {
        // Başlardaysak
        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Sonlardaysak
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        // Ortadaysak
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const pages = getPageNumbers();

  
  const baseButtonClass = "flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 text-sm font-medium";
  
  // Aktif Sayfa 
  const activeClass = "bg-blue-600 border-blue-600 text-white shadow-md scale-105";
  
  // Pasif Sayfa 
  const inactiveClass = "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200";
  
  // Ok Butonları
  const arrowClass = "bg-white border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed";

  // Noktalar
  const ellipsisClass = "flex items-end justify-center w-10 h-10 pb-2 text-gray-400 tracking-widest select-none";

  return (
    <nav aria-label="Sayfalandırma" className="flex justify-center mt-10 mb-6">
      <ul className="inline-flex items-center gap-2">
        
        {/* ÖNCEKİ SAYFA */}
        <li>
          <Link
            href={createPageURL(currentPage - 1)}
            className={`${baseButtonClass} ${arrowClass}`}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            onClick={(e) => currentPage <= 1 && e.preventDefault()}
          >
            <span className="sr-only">Önceki</span>
            <ChevronLeftIcon />
          </Link>
        </li>
        
        {/* SAYFA NUMARALARI */}
        {pages.map((page, index) => {
          if (page === '...') {
            return <li key={`ellipsis-${index}`}><span className={ellipsisClass}>...</span></li>;
          }

          return (
            <li key={page}>
              <Link
                href={createPageURL(page)}
                className={`${baseButtonClass} ${currentPage === page ? activeClass : inactiveClass}`}
              >
                {page}
              </Link>
            </li>
          );
        })}

        {/* SONRAKİ SAYFA */}
        <li>
          <Link
            href={createPageURL(currentPage + 1)}
            className={`${baseButtonClass} ${arrowClass}`}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            onClick={(e) => currentPage >= totalPages && e.preventDefault()}
          >
            <span className="sr-only">Sonraki</span>
            <ChevronRightIcon />
          </Link>
        </li>

      </ul>
    </nav>
  );
}