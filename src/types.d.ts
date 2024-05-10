import type { FC } from 'react';
import type {
  FlatListProps,
  ImageProps,
  ImageSourcePropType,
  TextProps,
} from 'react-native';
import type { ParseShape } from 'react-native-parsed-text';
import type { Asset } from 'react-native-image-picker';
import { TColor } from './modules';

type TListProps = Omit<
  FlatListProps<any>,
  'data' | 'renderItem' | 'keyExtractor'
>;
type TMessageProps = {
  hideOwnerAvatar: boolean;
  hidePartnerAvatar: boolean;
  onPress?: (message: TMessyMessageProps) => Promise<void> | void;
  onLongPress?: (message: TMessyMessageProps) => Promise<void> | void;
};
type TBaseModule = {
  Image?: FC<ImageProps>;
  Text?: FC<TextProps>;
  Video?: FC;
  Cache: {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
  };
};

export type TColor = {
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

export type TMessyProps = Readonly<{
  loading?: boolean;
  messages?: TMessyMessage[];
  user?: TUser;
  theme?: TColor;
  footerProps?: TMessyFooterProps;
  listProps?: TListProps;
  messageProps?: TMessageProps;
  parsedShape?: ParseShape[];
  showDateTime?: boolean;
  renderLoading?: FC<{}>;
  renderMessageSystem?: FC<{ data?: TMessyMessage }>;
  renderMessage?: (data: TMessyMessageProps) => JSX.Element;
  renderAvatar?: FC<{ user?: TUser }>;
  renderMessageText?: (data: TMessyMessageProps) => JSX.Element;
  renderMessageAudio?: (data: TMessyMessageProps) => JSX.Element;
  renderMessageImage?: (data: TMessyMessageProps) => JSX.Element;
  renderMessageVideo?: (data: TMessyMessageProps) => JSX.Element;
  renderMessageDateTime?: (data: TMessyMessage) => JSX.Element;
  renderMessageLocation?: (data: TMessyMessageProps) => JSX.Element;
  BaseModule?: TBaseModule;
}>;

export type TMessyMessageProps = Readonly<
  Omit<TMessyProps, 'data'> & {
    value: TMessyMessage;
    preMessage?: TMessyMessage;
    index?: number;
  }
>;

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
  clientId?: string; // used for display message in List before receiving response from Server
  category?: string; // used for display multiple type of system message
};

export type TMessyFooterProps = Readonly<{
  disabled?: boolean;
  onSend?: (message?: TMessyMessage) => Promise<void> | void;
  inputProps?: TextInputProps;
  ExtraLeft?: React.ReactNode;
  ExtraActionLeft?: React.ReactNode;
  renderFooter?: FC<TMessyFooterProps>;
}>;
export type TMessyFooterSend = Readonly<{
  onPress?: () => void;
}>;
