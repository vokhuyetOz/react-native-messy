import { useEffect, useState } from 'react';
import { TMessyMessage } from '../types.d';

const listeners = new Set<(e: TMessyMessage | undefined) => void>();

let defaultData: TMessyMessage | undefined;

/**
 * @returns file. Call setMessageReplying(message) anywhere to reply.
 */
export function setMessageReplying(e?: TMessyMessage) {
  defaultData = e;
  listeners.forEach((listener) => listener(e));
}
export function getMessageReplying() {
  return defaultData;
}
export function useMessageReplying() {
  const [message, setMessage] = useState<TMessyMessage | undefined>(
    defaultData
  );
  useEffect(() => {
    listeners.add(setMessage);

    return () => {
      listeners.delete(setMessage);
    };
  }, []);

  return message;
}
