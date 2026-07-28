import type { ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export interface DataTablePagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField: (row: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  headerActions?: ReactNode;
  pagination?: DataTablePagination;
  rowActions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
}

/**
 * Generic search/filter/paginate/row-actions table used across every admin
 * (and employee) list screen. Columns own their own cell rendering
 * via `render` so callers keep full control over formatting/badges/links —
 * this component only owns layout, loading/empty states, and pagination.
 */
export function DataTable<T>({
  columns,
  data,
  keyField,
  isLoading,
  emptyMessage = "No records found",
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  headerActions,
  pagination,
  rowActions,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      {(onSearchChange || filters || headerActions) && (
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
          {onSearchChange && (
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
              />
            </div>
          )}
          {filters}
          {headerActions && <div className="ml-auto flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground ${col.className ?? ""}`}>
                  {col.header}
                </th>
              ))}
              {rowActions && <th className="px-4 py-2.5" />}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="px-4 py-10 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="px-4 py-10 text-center text-muted-foreground">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-border" />
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyField(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-b border-border last:border-0 ${onRowClick ? "cursor-pointer hover:bg-muted/40" : ""}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className ?? ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">{rowActions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border disabled:opacity-30 hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border disabled:opacity-30 hover:bg-muted"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
