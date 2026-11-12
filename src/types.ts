import type { ComponentType, ReactNode } from 'react';
import type {
  ImageProps,
  ImageSourcePropType,
  TextInputProps,
  TextProps,
} from 'react-native';
import type { ParseShape } from 'react-native-parsed-text';
import type { Asset } from 'react-native-image-picker';
import type { FlashListProps } from '@shopify/flash-list';
import type { ReactVideoProps } from 'react-native-video';

import type { TDeepPartial, TMessyTheme } from './theme';

export type { TDeepPartial, TMessyTheme };

/* ----------------------------------------------------------------- data */

export type TUser = {
  id: string | number | null | undefined;
  userName?: string | null;
  avatar?: ImageSourcePropType;
};

export type TMessyMessageLocation = {
  name: string;
  image: ImageProps['source'];
  latitude: string;
  longitude: string;
};

export type TReactionItem = {
  key: string;
  value: string;
  [key: string]: unknown;
};

export type TMessyMessageReaction = {
  id?: string;
  user: TUser;
  reaction: TReactionItem;
};

export type TMessyMessage = {
  id?: string | number | null;
  text?: string;
  image?: ImageSourcePropType | ImageSourcePropType[];
  video?: { uri: string };
  audio?: { uri?: string; id?: string };
  location?: TMessyMessageLocation;
  user?: TUser;
  type?: 'system' | 'message';
  createdTime?: Date | number | string;
  status?: 'sending' | 'sent' | 'seen' | 'failed';
  seenBy?: TUser[];
  /** picked file not uploaded yet */
  local?: Asset;
  /** id used before the server assigns one */
  clientId?: string;
  /** free-form tag, e.g. to style several kinds of system message */
  category?: string;
  reactions?: TMessyMessageReaction[];
  /** thread summary shown under the message ("2 Replies ›") */
  replies?: { count: number; users?: TUser[] };
  /** message this one answers; shown as a quote in the bubble */
  replyTo?: TMessyMessage;
};

/* --------------------------------------------------------------- layout */

/** `bubble`: own messages right, others left. `list`: everything left (Slack style). */
export type TMessyLayout = 'bubble' | 'list';

/** Place of a message inside a run of consecutive messages from one sender. */
export type TMessyGroupPosition = 'single' | 'first' | 'middle' | 'last';

export type TMessyItem = Readonly<{
  message: TMessyMessage;
  index: number;
  isOwn: boolean;
  position: TMessyGroupPosition;
  /** first message of a calendar day: render a day separator above it */
  showDay: boolean;
  /** newest message sent by the current user: shows delivery status */
  isLatestOwn: boolean;
}>;

/** Props every message-level slot receives. */
export type TMessyMessageSlotProps = TMessyItem &
  Readonly<{ layout: TMessyLayout }>;

export type TMessyBubbleProps = TMessyMessageSlotProps &
  Readonly<{ children: ReactNode; media: boolean }>;

export type TMessyAvatarProps = Readonly<{ user?: TUser; size: number }>;

export type TMessyDaySeparatorProps = Readonly<{
  date: Date | number | string;
}>;

export type TMessyMediaItem = Readonly<{
  type: 'image' | 'video';
  source: ImageSourcePropType | { uri: string };
}>;

export type TMessyMediaViewerProps = Readonly<{
  items: TMessyMediaItem[];
  initialIndex: number;
  onClose: () => void;
}>;

export type TMessyAnchor = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type TMessyReactionPickerProps = Readonly<{
  message: TMessyMessage;
  anchor: TMessyAnchor;
  isOwn: boolean;
  data: TReactionItem[];
  onSelect: (reaction: TReactionItem) => void;
  onClose: () => void;
}>;

export type TMessyReplyPreviewProps = Readonly<{
  message: TMessyMessage;
  onClose: () => void;
}>;

export type TMessySendButtonProps = Readonly<{
  disabled: boolean;
  onPress: () => void;
}>;

/* ---------------------------------------------------------------- slots */

/**
 * Every visual piece of the chat. Pass any subset to `components` to replace it.
 * Define them outside render: inline arrows remount on every render.
 */
export type TMessyComponents = {
  /** a whole row: day separator, avatar, name, bubble, reactions, status */
  Message: ComponentType<TMessyMessageSlotProps>;
  Bubble: ComponentType<TMessyBubbleProps>;
  Avatar: ComponentType<TMessyAvatarProps>;
  SenderName: ComponentType<TMessyMessageSlotProps>;
  DaySeparator: ComponentType<TMessyDaySeparatorProps>;
  SystemMessage: ComponentType<TMessyMessageSlotProps>;
  MessageText: ComponentType<TMessyMessageSlotProps>;
  MessageImage: ComponentType<TMessyMessageSlotProps>;
  MessageVideo: ComponentType<TMessyMessageSlotProps>;
  MessageLocation: ComponentType<TMessyMessageSlotProps>;
  /** messages with no text/image/video/location (audio, files, cards...) */
  MessageCustom: ComponentType<TMessyMessageSlotProps>;
  MessageStatus: ComponentType<TMessyMessageSlotProps>;
  /** "2 Replies ›" row for messages with `replies` */
  ThreadSummary: ComponentType<TMessyMessageSlotProps>;
  Reactions: ComponentType<TMessyMessageSlotProps>;
  /** quote of `message.replyTo` at the top of the bubble */
  MessageReply: ComponentType<TMessyMessageSlotProps>;
  /** "Replying to" bar above the composer input */
  ReplyPreview: ComponentType<TMessyReplyPreviewProps>;
  ReactionPicker: ComponentType<TMessyReactionPickerProps>;
  MediaViewer: ComponentType<TMessyMediaViewerProps>;
  Composer: ComponentType<{}>;
  ComposerActions: ComponentType<{}>;
  SendButton: ComponentType<TMessySendButtonProps>;
  EmojiPanel: ComponentType<{}>;
  ScrollToBottomButton: ComponentType<{ onPress: () => void }>;
  Loading: ComponentType<{}>;
  /** base primitives used by every default slot */
  Text: ComponentType<TextProps>;
  Image: ComponentType<ImageProps>;
  Video: ComponentType<ReactVideoProps>;
};

/* ---------------------------------------------------------------- props */

export type TMessyTexts = {
  placeholder: string;
  today: string;
  yesterday: string;
  sending: string;
  sent: string;
  seen: string;
  failed: string;
  reply: string;
  replies: string;
  replyingTo: string;
  you: string;
  photo: string;
  video: string;
  location: string;
};

export type TMessyMediaSize = { width: number; height: number };

export type TMessyCache = {
  get: (key: string) => TMessyMediaSize | undefined | null;
  set: (key: string, value: TMessyMediaSize) => unknown;
};

export type TMessyReactionConfig = {
  /** emojis shown in the picker */
  data?: TReactionItem[];
  /** called from the picker and when a reaction chip is tapped */
  onPress?: (info: { message: TMessyMessage; reaction: TReactionItem }) => void;
};

export type TMessyComposerProps = {
  disabled?: boolean;
  hideEmoji?: boolean;
  hideActions?: boolean;
  inputProps?: TextInputProps;
  /**
   * Bottom safe-area inset (e.g. `useSafeAreaInsets().bottom`). Messy pads the
   * composer by it while the keyboard is closed; don't also pad the bottom edge yourself.
   */
  bottomInset?: number;
};

export type TMessyListProps = Omit<
  FlashListProps<TMessyItem>,
  'data' | 'renderItem' | 'keyExtractor' | 'inverted'
>;

export type TMessyProps = Readonly<{
  /** newest first */
  messages?: TMessyMessage[];
  user?: TUser;
  layout?: TMessyLayout;
  loading?: boolean;
  theme?: TDeepPartial<TMessyTheme>;
  components?: Partial<TMessyComponents>;
  texts?: Partial<TMessyTexts>;
  /** avatar of other people (bubble layout). Default true */
  showAvatar?: boolean;
  /** avatar of the current user (bubble layout). Default false */
  showOwnAvatar?: boolean;
  /** name above other people's groups (bubble layout). Default false */
  showSenderName?: boolean;
  /** max gap in ms between two messages of one sender to group them. Default 5 min */
  groupInterval?: number;
  parsedShape?: ParseShape[];
  onSend?: (message: TMessyMessage) => void | Promise<void>;
  onPressMessage?: (message: TMessyMessage) => void;
  onLongPressMessage?: (message: TMessyMessage) => void;
  /** tap on the "N Replies" row */
  onPressReplies?: (message: TMessyMessage) => void;
  /**
   * Swipe a message toward the middle to reply to it. Needs a
   * `GestureHandlerRootView` around the app. Default false
   */
  swipeToReply?: boolean;
  /** enables long-press reaction picker and reaction chips */
  reactions?: TMessyReactionConfig;
  composerProps?: TMessyComposerProps;
  listProps?: TMessyListProps;
  /** persists media sizes so bubbles don't jump on re-mount */
  cache?: TMessyCache;
}>;

export type TMessyRef = {
  scrollToEnd: (animated?: boolean) => void;
  setText: (text: string) => void;
  focus: () => void;
};
