import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useModal, useUpdateUser } from "@/hooks";
import { UserForm, UserFormSchema, UserFormValues } from "../user-form";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui";
import { Spinner } from "../../ui";

export function EditUserModal() {
  const { isOpen, type, data, onClose } = useModal();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: "",
      role: "USER",
      status: "ACTIVE"
    }
  });

  const { handleSubmit, reset } = form;

  const isModalOpen = isOpen && type === "editUser";
  const user = data.user;

  // Populate form with user data when modal opens
  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        role: user.role,
        status: user.status
      });
    }
  }, [user, reset]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(
    (formData: UserFormValues) => {
      if (!user?.id) return;

      toast.promise(updateUser({ id: user.id, data: formData }), {
        loading: "Updating user...",
        success: () => {
          handleClose();
          return "User updated successfully!";
        },
        error: (error) => {
          console.error("Failed to update user:", error.message);
          return error.message || "Failed to update user. Please try again!";
        }
      });
    },
    [user?.id, updateUser, handleClose]
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-6">
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm form={form} isEditMode />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
