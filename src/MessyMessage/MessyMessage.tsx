import React from 'react';
import { Pressable } from 'react-native';

import { TMessyMessageProps } from '../types';

import { MessyMessageContent } from './MessyMessageContent';
import { MessyMessageDateTime } from './MessyMessageDateTime';
import { useMessyPropsContext, useSizes } from '../modules';

export function MessyMessage(props: TMessyMessageProps) {
  const Sizes = useSizes();
  const { renderMessage, listProps } = useMessyPropsContext();

  if (renderMessage) {
    return renderMessage(props);
  }
  return (
    <Pressable
      onPress={listProps?.onPress}
      style={{
        marginBottom: Sizes.padding,
      }}
    >
      <MessyMessageDateTime {...props} />
      <MessyMessageContent {...props} />
    </Pressable>
  );
}
