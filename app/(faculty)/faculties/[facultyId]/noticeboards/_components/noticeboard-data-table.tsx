"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

export type Noticeboard = {
  id: string;
  title: string;
  userId: string;
  description: string | null;
  facultyId: string | null;
  position: number | null;
  isPublished: boolean;
  publishDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const columns: ColumnDef<Noticeboard>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/faculties/${row.original.facultyId}/noticeboards/${row.original.id}`}
        className="text-blue-600 hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => (row.original.isPublished ? "Published" : "Draft"),
  },
  {
    accessorKey: "publishDate",
    header: "Publish Date",
    cell: ({ row }) => (row.original.publishDate ? format(new Date(row.original.publishDate), "PPP") : "N/A"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button
        onClick={async () => {
          try {
            await axios.patch(`/api/faculties/${row.original.facultyId}/noticeboards/${row.original.id}`, {
              isPublished: true,
            });
            toast.success("Noticeboard published!");
          } catch {
            toast.error("Failed to publish noticeboard");
          }
        }}
        disabled={row.original.isPublished}
      >
        Publish
      </Button>
    ),
  },
];

interface DataTableProps<TData> {
  data: TData[];
}

export function DataTable<TData>({ data }: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData>[],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-3">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-white border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
