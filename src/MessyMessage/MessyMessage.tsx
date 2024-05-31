import React from 'react';
import { Pressable } from 'react-native';

import { TMessyMessageProps } from '../types';

import { MessyMessageContent } from './MessyMessageContent';
import { MessyMessageDateTime } from './MessyMessageDateTime';

export function MessyMessage({ renderMessage, ...rest }: TMessyMessageProps) {
  if (renderMessage) {
    return renderMessage(rest);
  }
  return (
    <Pressable onPress={rest?.listProps?.onPress}>
      <MessyMessageDateTime {...rest} />
      <MessyMessageContent {...rest} />
    </Pressable>
  );
}
