import React from 'react';
import { type ImageSourcePropType, View } from 'react-native';
import type { Asset } from 'react-native-image-picker';

import type { IMessyMessageProps } from '../Messy';
import { MessyMessageContent } from './MessyMessageContent';
import { MessyMessageDateTime } from './MessyMessageDateTime';

export interface IUser {
  id: string | number | null | undefined;
  userName?: string | null;
  avatar?: ImageSourcePropType;
}
export interface IMessyMessageAudio {
  uri?: string;
  id?: string;
}
export type TMessyMessage = {
  id?: string | number | null;
  text?: string;
  image?: ImageSourcePropType;
  audio?: IMessyMessageAudio;
  user?: IUser;
  type?: 'system' | 'message';
  createdTime?: Date | number | string;
  status?: 'sending' | 'sent' | 'seen';
  seenBy?: IUser[];
  local?: Asset;
  clientId?: string; // used for display message in List before receiving response from Server
  category?: string; // used for display multiple type of system message
};

export function MessyMessage(props: IMessyMessageProps) {
  return (
    <View>
      <MessyMessageDateTime {...props} />
      <MessyMessageContent {...props} />
    </View>
  );
}
