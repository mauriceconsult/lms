"use client";

import { Assignment } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define a custom type for the table
type TableAssignment = Omit<Assignment, "facultyId" | "adminId"> & {
  courseId?: string;
};

export const columns: ColumnDef<TableAssignment>[] = [
  {
    accessorFn: (row) => row.title,
    id: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Assignment
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorFn: (row) => row.objective,
    id: "objective",
    header: "Objective",
  },
  {
    accessorFn: (row) => row.isPublished,
    id: "isPublished",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Published
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      return (
        <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorFn: (row) => row.isCompleted,
    id: "isCompleted",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Completed
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isCompleted = row.getValue("isCompleted") || false;
      return (
        <Badge className={cn("bg-slate-500", isCompleted && "bg-green-700")}>
          {isCompleted ? "Completed" : "Incomplete"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const { id } = row.original;
      const { facultyId, courseId } = table.options.meta as {
        facultyId: string;
        courseId: string;
      };
      if (!id || !courseId || !facultyId) {
        return <span className="text-red-500">Invalid data</span>;
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              href={`/faculty/create-faculty/${facultyId}/course/${courseId}/assignment/assignments/${id}`}
            >
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
