"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Coursework } from "@prisma/client";
import Link from "next/link";

export const columns: ColumnDef<Coursework & { attachments: { id: string; name: string; url: string }[] }>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/faculties/${row.original.facultyId}/courseworks/${row.original.id}`}
        className="text-blue-600 hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span>{row.original.description || "No description"}</span>,
  },
  {
    accessorKey: "isPublished",
    header: "Published",
    cell: ({ row }) => <span>{row.original.isPublished ? "Yes" : "No"}</span>,
  },
  {
    accessorKey: "attachments",
    header: "Attachments",
    cell: ({ row }) => (
      <ul className="space-y-1">
        {row.original.attachments.length > 0 ? (
          row.original.attachments.map((attachment) => (
            <li key={attachment.id}>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {attachment.name}
              </a>
            </li>
          ))
        ) : (
          <span>No attachments</span>
        )}
      </ul>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
];