export type TDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? TDeepPartial<T[K]> : T[K];
};

export const defaultTheme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F2F3F5',
    text: '#0B0B0C',
    textSecondary: '#8A8D93',
    border: '#E4E6EB',
    primary: '#0A84FF',
    onPrimary: '#FFFFFF',
    ownBubble: '#0A84FF',
    ownText: '#FFFFFF',
    ownLink: '#FFFFFF',
    otherBubble: '#F0F0F2',
    otherText: '#0B0B0C',
    otherLink: '#0A84FF',
    danger: '#FF3B30',
    overlay: 'rgba(0,0,0,0.35)',
    popup: '#FFFFFF',
    reactionChip: '#FFFFFF',
    reactionChipActive: '#E5F1FF',
    media: '#000000',
  },
  spacing: { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16 },
  radius: { bubble: 20, bubbleGrouped: 6, media: 18, input: 20, chip: 12 },
  font: {
    message: 16,
    messageLineHeight: 21,
    caption: 12,
    name: 13,
    emoji: 28,
  },
  avatarSize: 28,
  /** fraction of screen width a bubble may take in `bubble` layout */
  bubbleMaxWidth: 0.75,
  mediaMaxWidth: 240,
  mediaMaxHeight: 320,
  composerMinHeight: 40,
};

export type TMessyTheme = typeof defaultTheme;

export const darkTheme: TDeepPartial<TMessyTheme> = {
  colors: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#F2F2F7',
    textSecondary: '#8E8E93',
    border: '#2C2C2E',
    otherBubble: '#26252A',
    otherText: '#F2F2F7',
    otherLink: '#64A8FF',
    overlay: 'rgba(0,0,0,0.6)',
    popup: '#2C2C2E',
    reactionChip: '#2C2C2E',
    reactionChipActive: '#0A3A6B',
  },
};

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function deepMerge<T>(base: T, patch?: TDeepPartial<T>): T {
  if (!patch) {
    return base;
  }
  const out: Record<string, unknown> = { ...(base as object) };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = isObject(v) && isObject(out[k]) ? deepMerge(out[k], v) : v;
  }
  return out as T;
}

export function mergeTheme(patch?: TDeepPartial<TMessyTheme>): TMessyTheme {
  return deepMerge(defaultTheme, patch);
}
