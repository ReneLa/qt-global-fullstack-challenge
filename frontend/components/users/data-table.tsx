"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { useVerifiedUsers, useOnline } from "@/hooks";
import { useModal } from "@/hooks/use-modal-store";

import {
  Button,
  Input,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui";

import { User } from "./columns";

export function DataTable({ columns }: { columns: ColumnDef<User>[] }) {
  const { onOpen } = useModal();
  const isOnline = useOnline();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const {
    data: verifiedData,
    isLoading,
    isError
  } = useVerifiedUsers({
    page,
    limit
  });

  const data = verifiedData?.users || [];
  const pagination = verifiedData?.pagination;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    manualPagination: true,
    pageCount: pagination?.totalPages ?? 0
  });

  function getEmptyStateMessage() {
    // Check if there's a network error or user is offline
    if (isError || !isOnline) {
      return (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <p className="font-medium">Connection issue</p>
          <p className="text-sm">
            Unable to load users. Please check your internet connection and try
            again.
          </p>
        </div>
      );
    }

    // Check if email filter is applied
    const emailFilter = table.getColumn("email")?.getFilterValue() as string;
    if (emailFilter) {
      return (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <p className="font-medium">No matching results</p>
          <p className="text-sm">
            No users found matching &quot;{emailFilter}&quot;. Try adjusting
            your filter.
          </p>
        </div>
      );
    }

    // No data at all
    return (
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <p className="font-medium">No users yet</p>
        <p className="text-sm">
          Get started by creating your first user account.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Verified user accounts
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-xs"
        />
        <Button
          variant="outline"
          className="sm:ml-auto w-full sm:w-auto"
          onClick={() => {
            if (!isOnline) {
              toast.error("You have no connection");
              return;
            }
            onOpen("createUser");
          }}
          disabled={!isOnline}
        >
          <PlusIcon className="w-4 h-4" />
          Create User
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Spinner className="size-5" />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {getEmptyStateMessage()}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && pagination.total > 10 && (
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Showing {data.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
                {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
                users
              </span>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Rows per page
              </p>
              <Select
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
                value={`${limit}`}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Pagination>
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasPrev && !isLoading) {
                      setPage((p) => Math.max(1, p - 1));
                    }
                  }}
                  className={
                    !pagination.hasPrev || isLoading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {renderPageNumbers()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasNext && !isLoading) {
                      setPage((p) => p + 1);
                    }
                  }}
                  className={
                    !pagination.hasNext || isLoading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );

  function renderPageNumbers() {
    if (!pagination) return null;

    const { page: currentPage, totalPages } = pagination;
    const pages: React.ReactNode[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(1);
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis or pages around current page
      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis before last page
      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  }
}
