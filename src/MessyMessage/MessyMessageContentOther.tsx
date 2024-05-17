import React from 'react';
import { View } from 'react-native';

import type { TMessyMessageProps } from '../types';

export function MessyMessageContentOther(props: TMessyMessageProps) {
  const { renderMessageOther, value } = props;
  if (
    value?.text ||
    value?.audio ||
    value?.image ||
    value?.video ||
    value?.location
  ) {
    return null;
  }

  if (typeof renderMessageOther === 'function') {
    return renderMessageOther(props);
  }

  return <View>{renderMessageOther}</View>;
}
