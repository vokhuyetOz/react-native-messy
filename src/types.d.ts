import type { FC } from 'react';
import type {
  FlatListProps,
  ImageProps,
  ImageSourcePropType,
  LayoutRectangle,
  NativeTouchEvent,
  TextProps,
} from 'react-native';
import type { ParseShape } from 'react-native-parsed-text';
import type { Asset } from 'react-native-image-picker';
import type { FlashListProps } from '@shopify/flash-list';

import type { TColor } from './modules';
import React from 'react';

type TListProps = Omit<
  FlatListProps<any> | FlashListProps<any>,
  'data' | 'renderItem' | 'keyExtractor'
> & {
  onPress?: () => void | Promise<void>;
};
type TMessageProps = {
  hideOwnerAvatar: boolean;
  hidePartnerAvatar: boolean;
  onPress?: (message: TMessyMessageProps) => Promise<void> | void;
  onLongPress?: (message: TMessyMessageProps) => Promise<void> | void;
  renderMessyMessageContentReaction?: (
    data: TMessyMessageProps
  ) => React.JSX.Element;
};
type TBaseModule = {
  Image?: FC<ImageProps>;
  Text?: FC<TextProps>;
  Video?: FC;
  Cache: {
    get: <T>(key: string) => T;
    set: (key: string, value: unknown) => void;
  };
};

export type TColor = {
  background: string;
  background_emoji_popup: string;
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

export type TReactionItem = {
  key: string;
  value: any;
  [key: string]: unknown;
};
export type TReactionItemInfo = {
  item: TReactionItem;
  index: number;
  direction: EMessyReactionPopupItemDirection;
};
export type TReactionItemPressInfo = {
  message: TMessyMessage;
  reaction: TReactionItem;
};
export type TReaction = {
  data?: Array<TReactionItem>;
  renderItems?: ({
    item,
    index,
    direction,
  }: TReactionItemInfo) => React.ReactElement;
  renderReactionButton?: FC;
  onPress?: ({ message, react }: TReactionItemPressInfo) => void;
};

export type TMessyProps = Readonly<{
  useInBottomSheet?: boolean;
  loading?: boolean;
  messages?: TMessyMessage[];
  user?: TUser;
  theme?: TColor;
  footerProps?: TMessyFooterProps;
  listProps?: TListProps;
  messageProps?: TMessageProps;
  reaction?: TReaction;
  parsedShape?: ParseShape[];
  showDateTime?: boolean;
  renderLoading?: FC<{}>;
  renderMessageSystem?: FC<{ data?: TMessyMessage }>;
  renderMessage?: (data: TMessyMessageProps) => React.JSX.Element;
  renderAvatar?: FC<{ user?: TUser }>;
  renderMessageText?: (data: TMessyMessageProps) => React.JSX.Element;
  renderMessageAudio?: (data: TMessyMessageProps) => React.JSX.Element;
  renderMessageImage?: (data: TMessyMessageProps) => React.JSX.Element;
  renderMessageVideo?: (data: TMessyMessageProps) => React.JSX.Element;
  renderMessageDateTime?: (data: TMessyMessage) => React.JSX.Element;
  renderMessageLocation?: (data: TMessyMessageProps) => React.JSX.Element;
  renderMessageOther?: (data: TMessyMessageProps) => React.JSX.Element;
  BaseModule?: TBaseModule;
}>;

export type TMessyMessageProps = Readonly<{
  value: TMessyMessage;
  preMessage?: TMessyMessage;
  index: number;
}>;

export type TUser = {
  id: string | number | null | undefined;
  userName?: string | null;
  avatar?: ImageSourcePropType;
};
export type IMessyMessageAudio = {
  uri?: string;
  id?: string;
};
export type TMessyMessageLocation = {
  name: string;
  image: ImageProps['source'];
  latitude: string;
  longitude: string;
};
export type TMessyMessageContentReaction = {
  id: string;
  user: TUser;
  reaction: TReactionItem;
};
export type TMessyMessage = {
  id?: string | number | null;
  text?: string;
  image?: ImageSourcePropType;
  video?: { uri: string };
  audio?: IMessyMessageAudio;
  location?: TMessyMessageLocation;
  user?: TUser;
  type?: 'system' | 'message';
  createdTime?: Date | number | string;
  status?: 'sending' | 'sent' | 'seen';
  seenBy?: TUser[];
  local?: Asset;
  clientId?: string; // used for displaying message in List before receiving response from Server
  category?: string; // used for displaying multiple type of system message
  reactions?: Array<TMessyMessageContentReaction>;
  replyTo?: TMessyMessage;
};

export type TMessyFooterProps = Readonly<{
  disabled?: boolean;
  hideEmoji?: boolean;
  hideFooterAction?: boolean;
  onSend?: (message?: TMessyMessage) => Promise<void> | void;
  inputProps?: TextInputProps;
  Send?: React.ReactNode;
  Emoji?: React.ReactNode;
  ExtraLeft?: React.ReactNode;
  ExtraActionLeft?: React.ReactNode;
  renderFooter?: FC<TMessyFooterProps>;
  renderFooterAction?: FC<TMessyFooterProps>;
}>;
export type TMessyFooterSend = Readonly<{
  onPress?: () => void;
}>;

export type TMessyFooterActionItemDefault = Readonly<{
  handlePermission?: () => Promise<boolean>;
  style?: ImageStyle;
  source?: ImageSourcePropType;
  onPress?: () => Promise<void> | void;
}>;

export type TUseReaction = {
  layout: NativeTouchEvent & LayoutRectangle;
  message: TMessyMessage;
};
export enum EMessyReactionPopupItemDirection {
  UP = 'up',
  DOWN = 'down',
}
export type TMessyReactionPopupItem = {
  data: TReactionItem;
  index: number;
  direction: EMessyReactionPopupItemDirection;
};
