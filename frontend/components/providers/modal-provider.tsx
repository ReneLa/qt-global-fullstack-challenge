"use client";

import { useEffect, useState } from "react";

import {
  CreateUserModal,
  EditUserModal,
  DeleteUserModal
} from "../users/modals";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateUserModal />
      <EditUserModal />
      <DeleteUserModal />
    </>
  );
};
