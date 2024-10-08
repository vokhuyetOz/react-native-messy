import { useState, useEffect, useRef } from 'react';
import type { TColor } from '../types';

const DefaultColors = {
  background: 'white',
  background_emoji_popup: 'black',
  primary: '#F9A825',
  accent: '#D32F2F',
  shadow: '#000000',
  placeholder: '#A8ABB2',
  success: '#43A047',
  message_left: {
    background: '#EEEEEE',
    text: '#000',
    link: '#1976D2',
    email: '#2962FF',
    phone: '#43A047',
    audio: 'rgba(0,0,0,0.2)',
  },
  message_right: {
    background: '#F85767',
    text: 'white',
    link: '#1976D2',
    email: '#2962FF',
    phone: '#D32F2F',
    audio: 'rgba(255,255,255,0.5)',
  },
  input: {
    text: '#000000',
  },
};

type Listener = (color: TColor) => void;
const listeners = new Set<Listener>();

export function setTheme(color: TColor) {
  listeners.forEach((listener) => listener(color));
}

let initData: TColor = DefaultColors;

export const useInitColors = (data: TColor = DefaultColors) => {
  const firstRenderRef = useRef(true);
  initData = data;
  useEffect(() => {
    const handleTheme = () => {
      if (firstRenderRef.current) {
        firstRenderRef.current = false;
        return;
      }
      setTheme(data);
    };

    handleTheme();

    return () => {
      initData = DefaultColors;
    };
  }, [data]);
};

export function useColors(): TColor {
  const [color, setColor] = useState<TColor>(initData);

  // Listen for updates
  useEffect(() => {
    listeners.add(setColor);

    return () => {
      listeners.delete(setColor);
    };
  }, []);

  return color;
}
