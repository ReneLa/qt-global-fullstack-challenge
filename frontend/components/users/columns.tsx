"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Calendar, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Actions } from "./actions";

export type User = {
  id: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  email: string;
  hash: string;
  createdAt: string;
};

// Utility function to mask hash: show first 3 and last 3, hide the rest
const maskHash = (hash: string | undefined): string => {
  if (!hash) return "N/A";
  if (hash.length <= 6) return hash;

  const first3 = hash.slice(0, 3);
  const last3 = hash.slice(-3);

  return `${first3} *** *** ${last3}`;
};

const formatText = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return format(date, "MMM d, yyyy 'at' h:mm a");
  } catch {
    return dateString;
  }
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue("createdAt") as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar
            strokeWidth={2}
            className="h-4 w-4 text-muted-foreground shrink-0"
          />
          <span className="text-sm">{formatDate(dateString)}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail
          strokeWidth={2}
          className="h-4 w-4 text-muted-foreground shrink-0"
        />
        <span className="lowercase">{row.getValue("email")}</span>
      </div>
    )
  },
  {
    accessorKey: "hash",
    header: "Hash",
    cell: ({ row }) => {
      const hash = row.getValue("hash") as string | undefined;
      return (
        <div className="font-mono text-sm text-muted-foreground">
          {maskHash(hash)}
        </div>
      );
    }
  },
  {
    accessorKey: "role",
    header: () => <div>Role</div>,
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const isAdmin = role === "ADMIN";

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            isAdmin
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {formatText(role)}
        </span>
      );
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status === "ACTIVE";

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {formatText(status)}
        </span>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return <Actions user={user} />;
    }
  }
];
