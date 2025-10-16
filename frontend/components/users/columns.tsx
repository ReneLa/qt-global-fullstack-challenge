"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Actions } from "./actions";

export type User = {
  id: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  email: string;
  hash?: string;
};

// Utility function to mask hash: show first 3 and last 3, hide the rest
const maskHash = (hash: string | undefined): string => {
  if (!hash) return "N/A";
  if (hash.length <= 6) return hash;

  const first3 = hash.slice(0, 3);
  const last3 = hash.slice(-3);

  return `${first3}...${last3}`;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>
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

      return <div className=" font-regular capitalize">{role}</div>;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    )
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
