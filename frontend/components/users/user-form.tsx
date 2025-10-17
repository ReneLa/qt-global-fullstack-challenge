import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui";

export const UserFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["ADMIN", "USER"]),
  status: z.enum(["ACTIVE", "INACTIVE"])
});

export type UserFormValues = z.infer<typeof UserFormSchema>;

interface UserFormProps {
  form: UseFormReturn<UserFormValues>;
  isEditMode?: boolean;
}

export function UserForm({ form }: UserFormProps) {
  const { control } = form;

  return (
    <div className="grid">
      <FieldSet>
        <FieldGroup>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="@example.com"
                  // disabled={isEditMode}
                  {...field}
                />
              </Field>
            )}
          />

          <div className="flex flex-row items-center gap-2 mb-4">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
