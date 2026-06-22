const CURSOR_COLOR_PALETTE = [
  "#52A8FF",
  "#BF7AF0",
  "#FF990A",
  "#FF6166",
  "#F75F8F",
  "#62C073",
  "#0AC7B4",
  "#00c8d4",
] as const;

export function getCursorColorForUserId(userId: string): string {
  let hash = 0;

  for (let index = 0; index < userId.length; index += 1) {
    hash = userId.charCodeAt(index) + ((hash << 5) - hash);
  }

  const paletteIndex = Math.abs(hash) % CURSOR_COLOR_PALETTE.length;
  return CURSOR_COLOR_PALETTE[paletteIndex];
}
