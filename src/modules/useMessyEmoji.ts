import { useEffect, useRef, useState, createRef } from 'react';
import type { BottomSheetModal } from '@discord/bottom-sheet';

const listRef = createRef<BottomSheetModal>();

export const useMessyEmojiSheetRef = () => {
  return listRef;
};

export type TEmoji = {
  emoji: string;
  skin_tone_support: boolean;
  name: string;
  slug: string;
  unicode_version: string;
  emoji_version: string;
};

const listeners = new Set<(e: TEmoji) => void>();

export function selectEmoji(e: TEmoji) {
  listeners.forEach((listener) => listener(e));
}
/**
 * @returns emoji. Call selectEmoji(emoji) anywhere to update textinput.
 */
export function useSelectEmoji() {
  // const [emoji, setEmoji] = useState<TEmoji>();
  const componentRef = useRef<{ emoji?: TEmoji }>({ emoji: undefined });
  const [force, setForce] = useState<boolean>(true);

  useEffect(() => {
    const handle = (e: TEmoji) => {
      componentRef.current.emoji = e;
      setForce((pre) => !pre);
    };
    listeners.add(handle);

    return () => {
      listeners.delete(handle);
    };
  }, []);

  return { emoji: componentRef.current.emoji, force };
}

let defaultIndex = -1;
const listenersIndex = new Set<(index: number) => void>();

export const setBotomSheetEmojiIndex = (index: number) => {
  defaultIndex = index;
  listenersIndex.forEach((listener) => listener(index));
};
export function useBotomSheetEmojiIndex() {
  const [currentIndex, setCurrentIndex] = useState<number>(defaultIndex);

  useEffect(() => {
    const handle = (index: number) => {
      setCurrentIndex(index);
    };
    listenersIndex.add(handle);

    return () => {
      listenersIndex.delete(handle);
    };
  }, []);

  return currentIndex;
}
