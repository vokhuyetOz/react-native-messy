import React from 'react';
import { ImageSourcePropType, View } from 'react-native';

import type { IMessyMessageProps } from '../Messy';
import { MessyMessageContent } from './MessyMessageContent';
import { MessyMessageDateTime } from './MessyMessageDateTime';

export interface IUser {
  id: string | number | null | undefined;
  userName?: string | null | undefined;
  avatar?: ImageSourcePropType;
}

export interface IMessyMessage {
  id?: string | number | null | undefined;
  text?: string;
  image?: ImageSourcePropType | ImageSourcePropType[] | undefined | [] | null;
  user?: IUser;
  type?: 'system' | undefined;
  createdTime: Date | number | string;
  status?: 'sending' | 'sent' | 'seen';
  seenBy?: IUser[];
}

export function MessyMessage(props: IMessyMessageProps) {
  return (
    <View>
      <MessyMessageDateTime {...props} />
      <MessyMessageContent {...props} />
    </View>
  );
}
