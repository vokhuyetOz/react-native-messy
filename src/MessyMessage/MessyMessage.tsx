import React from 'react';
import { View } from 'react-native';

import { TMessyMessageProps } from '../types';

import { MessyMessageContent } from './MessyMessageContent';
import { MessyMessageDateTime } from './MessyMessageDateTime';

export function MessyMessage({ renderMessage, ...rest }: TMessyMessageProps) {
  if (renderMessage) {
    return renderMessage(rest);
  }
  return (
    <View>
      <MessyMessageDateTime {...rest} />
      <MessyMessageContent {...rest} />
    </View>
  );
}
