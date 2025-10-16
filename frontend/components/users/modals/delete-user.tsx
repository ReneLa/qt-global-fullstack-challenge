import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { useDeleteUser, useModal } from "@/hooks";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Spinner
} from "@/components/ui";

export function DeleteUserAlert() {
  const { isOpen, type, onClose, data } = useModal();
  const {
    mutateAsync: deleteUser,
    isPending,
    isError,
    error
  } = useDeleteUser();

  const isAlertOpen = isOpen && type == "deleteUser";

  useEffect(() => {
    if (isError) {
      toast.error(error.message || "Failed to delete user");
    }
  }, [isError, error]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You are about to delete <br />
            User :{" "}
            <span className="font-bold text-primary">
              * {data?.user?.email} *
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              data?.user?.id ? deleteUser(data.user.id) : undefined
            }
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
