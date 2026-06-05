import type { Appearance } from "@clerk/ui";
import { dark } from "@clerk/ui/themes";

export const clerkAppearance: Appearance = {
  theme: dark,
  variables: {
    borderRadius: "calc(var(--radius) * 1.8)",
    colorBackground: "var(--bg-elevated)",
    colorBorder: "var(--border-default)",
    colorDanger: "var(--state-error)",
    colorForeground: "var(--text-primary)",
    colorInput: "var(--bg-subtle)",
    colorInputForeground: "var(--text-primary)",
    colorMuted: "var(--bg-subtle)",
    colorMutedForeground: "var(--text-muted)",
    colorNeutral: "var(--border-subtle)",
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--primary-foreground)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    fontFamilyButtons: "var(--font-geist-sans), system-ui, sans-serif",
    fontSize: "0.875rem",
  },
  elements: {
    card: {
      backgroundColor: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "calc(var(--radius) * 1.8)",
      boxShadow: "none",
    },
    formButtonPrimary: {
      backgroundColor: "var(--accent-primary)",
      color: "var(--primary-foreground)",
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    formFieldInput: {
      backgroundColor: "var(--bg-subtle)",
      borderColor: "var(--border-default)",
      color: "var(--text-primary)",
    },
    headerSubtitle: {
      color: "var(--text-secondary)",
    },
    headerTitle: {
      color: "var(--text-primary)",
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    socialButtonsBlockButton: {
      backgroundColor: "var(--bg-subtle)",
      borderColor: "var(--border-default)",
      color: "var(--text-primary)",
    },
    socialButtonsBlockButtonText: {
      color: "var(--text-primary)",
      fontWeight: 500,
    },
  },
};
