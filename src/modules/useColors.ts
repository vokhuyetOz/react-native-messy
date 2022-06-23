import { useState, useEffect, useRef } from 'react';

const DefaultColors = {
  background: 'white',
  primary: '#000',
  message_left: {
    background: '#EEEEEE',
    text: '#000',
    link: '#1976D2',
    email: '#2962FF',
    phone: '#43A047',
  },
  message_right: {
    background: '#F9A825',
    text: 'white',
    link: '#1976D2',
    email: '#2962FF',
    phone: '#D32F2F',
  },
  shadow: '#000000',
  placeholder: 'rgba(0,0,0,0.6)',
  dot: '#43A047',
};

export type IColor = {
  background: string;
  primary: string;
  placeholder: string;
  shadow: string;
  dot: string;
  message_left: {
    background: string;
    text: string;
    link: string;
    email: string;
    phone: string;
  };
  message_right: {
    background: string;
    text: string;
    link: string;
    email: string;
    phone: string;
  };
};
type Listener = (color: IColor) => void;
const listeners = new Set<Listener>();

export function setTheme(color: IColor) {
  listeners.forEach((listener) => listener(color));
}

let initData: IColor = DefaultColors;

export const useInitColors = (data: IColor = DefaultColors) => {
  const firstRenderRef = useRef(true);
  initData = data;
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
    } else {
      setTheme(data);
    }
    return () => {
      initData = DefaultColors;
    };
  }, [data]);
};

export function useColors(): IColor {
  const [color, setColor]: [IColor, (newColor: IColor) => void] =
    useState(initData);

  // Listen for updates
  useEffect(() => {
    listeners.add(setColor);

    return () => {
      listeners.delete(setColor);
    };
  }, []);

  return color;
}
