import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui";
import { User } from "./columns";
import { useModal } from "@/hooks";

export const Actions = ({ user }: { user: User }) => {
  const { onOpen } = useModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpen("editUser", { user })} className="text-blue-500 hover:text-blue-500">
          <PencilIcon className="size-4 text-blue-500 hover:text-blue-500" />
          Update
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onOpen("deleteUser", { user })}
          className="text-destructive hover:text-destructive"
        >
          <TrashIcon className="size-4 text-destructive hover:text-destructive" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
