'use client';

import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Spinner } from './Spinner';
import { Checkbox } from './Checkbox';

// Types
export interface Column<T = any> {
  id: string;
  header: string;
  accessor?: keyof T | ((row: T) => any);
  cell?: (row: T, value: any) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  enableRowSelection?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  enablePagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  columnId: string | null;
  direction: SortDirection;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  enableSearch = false,
  searchPlaceholder = 'Search...',
  enableRowSelection = false,
  onRowSelect,
  enablePagination = true,
  pageSize: initialPageSize = 10,
  emptyMessage = 'No data available',
  className = '',
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
}: DataTableProps<T>) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortState, setSortState] = useState<SortState>({ columnId: null, direction: null });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Get cell value
  const getCellValue = (row: T, column: Column<T>): any => {
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        return column.accessor(row);
      }
      return row[column.accessor];
    }
    return row[column.id];
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!enableSearch || !searchQuery.trim()) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = getCellValue(row, column);
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, columns, enableSearch]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState.columnId || !sortState.direction) return filteredData;

    const column = columns.find((col) => col.id === sortState.columnId);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getCellValue(a, column);
      const bValue = getCellValue(b, column);

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortState, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, enablePagination]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, sortedData.length);

  // Handle sort
  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    setSortState((prev) => {
      if (prev.columnId !== columnId) {
        return { columnId, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { columnId, direction: 'desc' };
      }
      return { columnId: null, direction: null };
    });
  };

  // Handle row selection
  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);

    if (onRowSelect) {
      const selected = Array.from(newSelected).map((i) => sortedData[i]);
      onRowSelect(selected);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const allIndices = sortedData.map((_, i) => i);
      setSelectedRows(new Set(allIndices));
      onRowSelect?.(sortedData);
    }
  };

  // Render sort icon
  const renderSortIcon = (columnId: string) => {
    if (sortState.columnId !== columnId) {
      return (
        <span className="text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      );
    }

    return sortState.direction === 'asc' ? (
      <span className="text-blue-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </span>
    ) : (
      <span className="text-blue-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Actions Bar */}
      {(enableSearch || enableRowSelection) && (
        <div className="flex items-center justify-between gap-4">
          {enableSearch && (
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          )}

          {enableRowSelection && selectedRows.size > 0 && (
            <div className="text-sm text-gray-600">
              {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className={`overflow-x-auto rounded-lg ${bordered ? 'border border-gray-200' : 'shadow'}`}>
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {enableRowSelection && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`
                    px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                    ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && renderSortIcon(column.id)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-y-2' : ''}`}>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const globalIndex = (currentPage - 1) * pageSize + rowIndex;
                return (
                  <tr
                    key={globalIndex}
                    className={`
                      ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                      ${hoverable ? 'hover:bg-blue-50 transition-colors' : ''}
                      ${compact ? 'text-sm' : ''}
                    `}
                  >
                    {enableRowSelection && (
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedRows.has(globalIndex)}
                          onChange={() => handleRowSelect(globalIndex)}
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const value = getCellValue(row, column);
                      const content = column.cell ? column.cell(row, value) : value;

                      return (
                        <td
                          key={column.id}
                          className={`
                            px-6 ${compact ? 'py-2' : 'py-4'} whitespace-nowrap
                            ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                          `}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && sortedData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{sortedData.length}</span> results
            </div>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
