"use client";

import * as React from "react";
import { Toaster } from "sonner";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" theme="dark" richColors closeButton />
    </>
  );
}
