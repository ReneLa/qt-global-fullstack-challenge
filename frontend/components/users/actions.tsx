import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui";
import { User } from "./columns";
import { useModal, useOnline } from "@/hooks";

export const Actions = ({ user }: { user: User }) => {
  const { onOpen } = useModal();
  const isOnline = useOnline();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            if (!isOnline) {
              toast.error("You have no connection");
              return;
            }
            onOpen("editUser", { user });
          }}
          disabled={!isOnline}
          className="group cursor-pointer"
        >
          <PencilIcon className="size-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          <span className="group-hover:text-blue-500 transition-colors">
            Update
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (!isOnline) {
              toast.error("You have no connection");
              return;
            }
            onOpen("deleteUser", { user });
          }}
          disabled={!isOnline}
          className="group cursor-pointer focus:bg-destructive/10 focus:text-destructive"
        >
          <TrashIcon className="size-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          <span className="group-hover:text-destructive transition-colors">
            Delete
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
