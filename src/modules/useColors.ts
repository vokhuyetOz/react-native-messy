import { useState, useEffect, useRef } from 'react';

const DefaultColors = {
  background: 'white',
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

export type IColor = {
  background: string;
  primary: string;
  accent: string;
  placeholder: string;
  shadow: string;
  success: string;
  message_left: {
    background: string;
    text: string;
    link: string;
    email: string;
    phone: string;
    audio: string;
  };
  message_right: {
    background: string;
    text: string;
    link: string;
    email: string;
    phone: string;
    audio: string;
  };
  input: {
    text: string;
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

export function useColors(): IColor {
  const [color, setColor] = useState<IColor>(initData);

  // Listen for updates
  useEffect(() => {
    listeners.add(setColor);

    return () => {
      listeners.delete(setColor);
    };
  }, []);

  return color;
}
