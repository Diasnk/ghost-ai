import { Lock } from "lucide-react";
import Link from "next/link";

export function AccessDenied() {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <Lock className="h-8 w-8 text-copy-muted" />
      <p className="text-sm text-copy-secondary">
        You don&apos;t have access to this project.
      </p>
      <Link className="text-sm font-medium text-brand hover:underline" href="/editor">
        Back to editor
      </Link>
    </div>
  );
}
