export function getPresenceInitial(displayName: string): string {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return "?";
  }

  return trimmed.charAt(0).toUpperCase();
}
