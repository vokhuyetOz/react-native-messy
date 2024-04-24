import React from 'react';
import { Text, type TextProps } from 'react-native';

type TMText = Readonly<TextProps>;

export function MText(props: TMText) {
  return <Text {...props} />;
}
