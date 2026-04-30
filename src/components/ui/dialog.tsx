"use client";

import type { HTMLAttributes, ReactNode } from "react";

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 bg-black/70" onClick={() => onOpenChange(false)}>
      {children}
    </div>
  );
}

export function DialogContent({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto mt-[5vh] w-full ${className}`}
      onClick={(event) => event.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  children,
  className = "",
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={className}>{children}</div>;
}

export function DialogTitle({
  children,
  className = "",
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={className}>{children}</h2>;
}

export function DialogDescription({
  children,
  className = "",
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={className}>{children}</p>;
}
