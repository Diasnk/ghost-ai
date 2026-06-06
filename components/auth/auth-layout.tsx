import { FileText, Sparkles, Users } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const features = [
  {
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
    icon: Sparkles,
    title: "AI Architecture Generation",
  },
  {
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
    icon: Users,
    title: "Real-time Collaboration",
  },
  {
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
    icon: FileText,
    title: "Instant Spec Generation",
  },
] as const;

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen font-sans lg:grid-cols-2">
      <aside className="hidden min-h-screen flex-col bg-surface lg:flex">
        <header className="px-12 pt-10">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="h-7 w-7 shrink-0 rounded-xl bg-brand"
            />
            <span className="text-sm font-semibold text-copy-primary">
              Ghost AI
            </span>
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center px-12 py-10">
          <div className="max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight text-copy-primary">
              Design systems at the speed of thought.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-copy-secondary">
              Describe your architecture in plain English, Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>

            <ul className="mt-10 space-y-6">
              {features.map(({ description, icon: Icon, title }) => (
                <li key={title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-border-subtle bg-elevated">
                    <Icon
                      className="h-5 w-5 text-brand"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-copy-primary">
                      {title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-copy-muted">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="px-12 pb-10 text-xs text-copy-faint">
          © {new Date().getFullYear()} Ghost AI. All rights reserved.
        </footer>
      </aside>

      <div className="flex min-h-screen items-center justify-center bg-base px-6 py-12 lg:px-10">
        <div className="w-full max-w-104 font-sans">{children}</div>
      </div>
    </div>
  );
}
