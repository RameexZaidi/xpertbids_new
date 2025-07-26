import React from 'react';

const AdvancedPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Calculate visible page range (max 5 pages shown)
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    // Adjust if we're at the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination me-3">
        {/* First Page Button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link pal-1"
            onClick={() => onPageChange(1)}
            aria-label="First"
          >
            «
          </button>
        </li>

        {/* Previous Page Button */}
        {/* <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link pal-1"
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous"
          >
            ‹
          </button>
        </li> */}

        {/* Show ellipsis if needed */}
        {/* {visiblePages[0] > 1 && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )} */}

        {/* Page Numbers */}
        {visiblePages.map(page => (
          <li
            key={page}
            className={`page-item ${currentPage === page ? 'active' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Show ellipsis if needed */}
        {/* {visiblePages[visiblePages.length - 1] < totalPages && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )} */}

        {/* Next Page Button */}
        {/* <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link pal-1"
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next"
          >
            ›
          </button>
        </li> */}

        {/* Last Page Button */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link pal-1"
            onClick={() => onPageChange(totalPages)}
            aria-label="Last"
          >
            »
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdvancedPagination;
