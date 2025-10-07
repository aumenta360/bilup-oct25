"use client";

import { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  // Simplemente renderizar los children sin ninguna verificación
  return <>{children}</>;
} 