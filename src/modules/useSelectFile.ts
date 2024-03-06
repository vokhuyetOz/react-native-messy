import { useEffect, useRef, useState } from 'react';
import { type ImageSourcePropType } from 'react-native';

export type TFile = {
  local: ImageSourcePropType;
  remote: ImageSourcePropType;
  loading: boolean;
  error: string;
};

const listeners = new Set<(e: TFile) => void>();

export function selectFile(e: TFile) {
  listeners.forEach((listener) => listener(e));
}
/**
 * @returns file. Call selectEmoji(emoji) anywhere to update textinput.
 */
export function useSelectFile() {
  const componentRef = useRef<{ file?: TFile }>({ file: undefined });
  const [force, setForce] = useState<boolean>(true);

  useEffect(() => {
    const handle = (e: TFile) => {
      componentRef.current.file = e;
      setForce((pre) => !pre);
    };
    listeners.add(handle);

    return () => {
      listeners.delete(handle);
    };
  }, []);

  return { file: componentRef.current.file, force };
}
