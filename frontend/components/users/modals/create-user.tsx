import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateUser, useModal } from "@/hooks";
import { UserForm, UserFormSchema, UserFormValues } from "../user-form";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui";
import { Spinner } from "../../ui";

export function CreateUserModal() {
  const { isOpen, type, onClose } = useModal();
  const { mutateAsync: createUser, isPending } = useCreateUser();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: "",
      role: "USER",
      status: "ACTIVE"
    }
  });

  const { handleSubmit, reset } = form;

  const isModalOpen = isOpen && type == "createUser";

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(
    (data: UserFormValues) => {
      toast.promise(createUser(data), {
        loading: "Creating user...",
        success: () => {
          handleClose();
          return "User created successfully!";
        },
        error: (error) => {
          console.error("Failed to create user:", error.message);
          return error.message || "Failed to create user. Please try again!";
        }
      });
    },
    [createUser, handleClose]
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-6">
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Create a new user with an email.
            </DialogDescription>
          </DialogHeader>
          <UserForm form={form} />
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
