"use client";

import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 dark:bg-zinc-900">
        <button onClick={onClose} className="mb-4 text-sm text-zinc-500">
          Close
        </button>
        {children}
      </div>
    </div>
  );
}
