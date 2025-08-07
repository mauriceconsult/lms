import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

export const columns: ColumnDef<Noticeboard>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link href={`/faculties/${row.original.facultyId}/noticeboards/${row.original.id}`} className="text-blue-600 hover:underline">
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
          await fetch(`/api/faculties/${row.original.facultyId}/noticeboards/${row.original.id}`, {
            method: "PATCH",
            body: JSON.stringify({ isPublished: true }),
          });
        }}
        disabled={row.original.isPublished}
      >
        Publish
      </Button>
    ),
  },
];
