import { createContext, useContext } from 'react';

import type {
  TMessyAnchor,
  TMessyComponents,
  TMessyItem,
  TMessyLayout,
  TMessyMediaItem,
  TMessyProps,
  TMessyTexts,
} from './types';
import type { TMessyTheme } from './theme';

export type TMessyContext = Readonly<{
  props: TMessyProps;
  theme: TMessyTheme;
  components: TMessyComponents;
  texts: TMessyTexts;
  layout: TMessyLayout;
  openMediaViewer: (items: TMessyMediaItem[], index?: number) => void;
  openReactionPicker: (item: TMessyItem, anchor: TMessyAnchor) => void;
  scrollToEnd: (animated?: boolean) => void;
}>;

export const MessyContext = createContext<TMessyContext | null>(null);

/** Everything `<Messy>` knows: props, theme, slots, texts and actions. */
export function useMessy(): TMessyContext {
  const value = useContext(MessyContext);
  if (!value) {
    throw new Error('Messy hooks must be used inside <Messy>.');
  }
  return value;
}

export const useMessyTheme = () => useMessy().theme;
export const useMessyComponents = () => useMessy().components;
