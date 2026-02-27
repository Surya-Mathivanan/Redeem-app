import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Reusable Pagination component.
 * Props:
 *   currentPage  – 1-indexed current page
 *   totalPages   – total number of pages
 *   onPageChange – callback(newPage)
 *   compact      – if true, shows a smaller style (for activity lists)
 */
const Pagination = ({ currentPage, totalPages, onPageChange, compact = false }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => { if (currentPage > 1) onPageChange(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) onPageChange(currentPage + 1); };

  // Build page number array with ellipsis for large sets
  const buildPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  if (compact) {
    return (
      <div className="pagination-compact">
        <button
          className="page-btn-compact"
          onClick={handlePrev}
          disabled={currentPage === 1}
          title="Previous page"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className="page-info-compact">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          className="page-btn-compact"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    );
  }

  return (
    <div className="pagination-wrapper" data-info={`Page ${currentPage} of ${totalPages}`}>
      <button
        className="page-btn prev-next"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="me-1" />
        Prev
      </button>

      <div className="page-numbers">
        {buildPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`page-num ${currentPage === p ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="page-btn prev-next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
        <FontAwesomeIcon icon={faChevronRight} className="ms-1" />
      </button>
    </div>
  );
};

export default Pagination;
