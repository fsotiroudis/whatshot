import React from 'react';
import { getChangeColor } from '../utils/dataUtils';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
}

function DataTable<T>({ columns, data, isLoading = false }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-20 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
              {columns.map((column, colIndex) => {
                const value = typeof column.accessor === 'function' 
                  ? column.accessor(row) 
                  : row[column.accessor as keyof T];
                
                return (
                  <td 
                    key={colIndex} 
                    className={`py-3 px-4 text-sm text-gray-800 ${column.className || ''}`}
                  >
                    {value as React.ReactNode}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Utility function to create a change cell with color coding
export const renderChangeCell = (change: number): React.ReactNode => (
  <span className={`${getChangeColor(change)}`}>
    {change > 0 ? '+' : ''}{change.toFixed(1)}%
  </span>
);

export default DataTable;