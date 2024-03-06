import React, { type FC } from 'react';
import { type TextInputProps } from 'react-native';

import type { TMessyMessage } from './MessyMessage';
import { MessyFooterDefault } from './MessyFooter/MessyFooter.default';

export type IMessyFooterProps = Readonly<{
  onSend?: (message?: TMessyMessage) => Promise<void> | void;
  inputProps?: TextInputProps;
  ExtraLeft?: React.ReactNode;
  ExtraActionLeft?: React.ReactNode;
  renderFooter?: FC<IMessyFooterProps>;
}>;
export type TMessyFooterSend = Readonly<{
  onPress?: () => void;
}>;

export function MessyFooter(props: IMessyFooterProps) {
  const { renderFooter } = props;

  if (typeof renderFooter === 'function') {
    return renderFooter(props);
  }

  return <MessyFooterDefault {...props} />;
}
