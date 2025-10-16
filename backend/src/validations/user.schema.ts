import { z } from "zod";

export const RoleEnum = z.enum(["ADMIN", "USER"]);
export const StatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export const createUserSchema = z.object({
  email: z.string().email(),
  role: RoleEnum,
  status: StatusEnum
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: RoleEnum.optional(),
  status: StatusEnum.optional()
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
