"use client";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EditorDialogContentProps
  extends Omit<React.ComponentProps<typeof DialogContent>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  footerActions?: React.ReactNode;
}

export function EditorDialogContent({
  title,
  description,
  footerActions,
  children,
  className,
  ...props
}: EditorDialogContentProps) {
  return (
    <DialogContent
      className={cn(
        "max-w-md rounded-3xl border border-surface-border bg-elevated p-5 text-copy-primary shadow-2xl [&_input]:text-copy-primary",
        className
      )}
      {...props}
    >
      <DialogHeader>
        <DialogTitle className="text-copy-primary">{title}</DialogTitle>
        {description ? (
          <DialogDescription className="text-copy-muted">
            {description}
          </DialogDescription>
        ) : null}
      </DialogHeader>

      {children}

      {footerActions ? (
        <DialogFooter className="-mx-5 -mb-5 rounded-b-3xl border-surface-border bg-surface p-5">
          {footerActions}
        </DialogFooter>
      ) : null}
    </DialogContent>
  );
}
