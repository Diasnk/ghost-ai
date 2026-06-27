"use client";

import { Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AiSpecsTab() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Button
        className="w-full bg-brand text-white hover:bg-brand/90"
        type="button"
      >
        Generate Spec
      </Button>

      <div className="rounded-2xl border border-surface-border bg-elevated p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-subtle">
            <FileText className="h-4 w-4 text-ai-text" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-copy-primary">
              System Architecture Spec
            </h3>
            <p className="mt-1 text-sm text-copy-muted">
              A technical overview of services, data flows, and deployment
              topology derived from your canvas diagram.
            </p>
          </div>
        </div>
        <Button disabled type="button" variant="outline">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
