import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-1 rounded border disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-4 py-1 rounded border bg-blue-600 text-white">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-1 rounded border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
