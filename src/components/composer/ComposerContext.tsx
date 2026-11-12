import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from 'react';
import { Keyboard, type TextInput } from 'react-native';

import { useMessy } from '../../context';
import { insert } from '../../core/helpers';
import type { TMessyMessage } from '../../types';

export const PANEL_ANIMATION_MS = 250;

export type TMessyComposerPanel = Readonly<{ key: string; node: ReactNode }>;

export type TMessyComposerActions = Readonly<{
  setText: (text: string) => void;
  /** inserts at the cursor */
  insertText: (text: string) => void;
  /** no argument: sends the current text. With a partial message: sends it (media, custom...) */
  send: (partial?: TMessyMessage) => void;
  focus: () => void;
  /** hides keyboard and any open panel; true if something was open */
  dismiss: () => boolean;
  /** shows `node` in the keyboard area. Used by the emoji panel; use it for your own pickers */
  openPanel: (key: string, node: ReactNode) => void;
  closePanel: () => void;
  togglePanel: (key: string, node: ReactNode) => void;
  inputRef: RefObject<TextInput>;
  setSelection: (start: number) => void;
  /** quotes `message` in the next send; null cancels */
  setReplyTo: (message: TMessyMessage | null) => void;
}>;

type TComposerState = Readonly<{
  text: string;
  panel: TMessyComposerPanel | null;
  replyTo: TMessyMessage | null;
}>;

const StateContext = createContext<TComposerState>({
  text: '',
  panel: null,
  replyTo: null,
});
const ActionsContext = createContext<TMessyComposerActions | null>(null);

export function ComposerProvider({
  children,
  actionsRef,
}: Readonly<{
  children: ReactNode;
  actionsRef: MutableRefObject<TMessyComposerActions | null>;
}>) {
  const messy = useMessy();
  const [text, setTextState] = useState('');
  const [panel, setPanel] = useState<TMessyComposerPanel | null>(null);
  const [replyTo, setReplyToState] = useState<TMessyMessage | null>(null);
  const inputRef = useRef<TextInput>(null);
  // actions are stable; they read the latest values from here
  const latest = useRef({ text, panel, replyTo, messy, cursor: 0 });
  latest.current.text = text;
  latest.current.panel = panel;
  latest.current.replyTo = replyTo;
  latest.current.messy = messy;

  const actions = useMemo<TMessyComposerActions>(() => {
    // cursor is tracked by onSelectionChange; insertText clamps it
    const setText = (value: string) => {
      latest.current.text = value;
      setTextState(value);
    };
    const closePanel = () => setPanel(null);
    const openPanel = (key: string, node: ReactNode) => {
      Keyboard.dismiss();
      setPanel({ key, node });
    };
    return {
      inputRef,
      setText,
      setSelection: (start) => {
        latest.current.cursor = start;
      },
      insertText: (value) => {
        const { text: current, cursor } = latest.current;
        const at = Math.min(cursor, current.length);
        setText(insert(current, at, value));
        latest.current.cursor = at + value.length;
      },
      send: (partial) => {
        const { messy: m, text: current, replyTo: quoted } = latest.current;
        if (!partial && !current.trim()) {
          return;
        }
        const createdTime = Date.now();
        m.props.onSend?.({
          id: `${createdTime}`,
          clientId: `${createdTime}`,
          type: 'message',
          status: 'sending',
          createdTime,
          user: m.props.user,
          ...(quoted ? { replyTo: quoted } : null),
          ...(partial ?? { text: current.trim() }),
        });
        if (!partial) {
          setText('');
        }
        latest.current.replyTo = null;
        setReplyToState(null);
        m.scrollToEnd();
      },
      focus: () => {
        closePanel();
        inputRef.current?.focus();
      },
      dismiss: () => {
        const wasOpen = Keyboard.isVisible() || !!latest.current.panel;
        Keyboard.dismiss();
        closePanel();
        return wasOpen;
      },
      setReplyTo: (message) => {
        latest.current.replyTo = message;
        setReplyToState(message);
      },
      openPanel,
      closePanel,
      togglePanel: (key, node) => {
        if (latest.current.panel?.key === key) {
          closePanel();
          inputRef.current?.focus();
          return;
        }
        openPanel(key, node);
      },
    };
  }, []);
  actionsRef.current = actions;

  const state = useMemo(
    () => ({ text, panel, replyTo }),
    [text, panel, replyTo]
  );
  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}

/** Stable composer actions; does not re-render on typing. */
export function useMessyComposerActions(): TMessyComposerActions {
  const value = useContext(ActionsContext);
  if (!value) {
    throw new Error('Messy hooks must be used inside <Messy>.');
  }
  return value;
}

/** Composer text, open panel and actions. Re-renders on every keystroke. */
export function useMessyComposer() {
  return { ...useContext(StateContext), ...useMessyComposerActions() };
}
