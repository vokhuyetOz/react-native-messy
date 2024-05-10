import React from 'react';

import { TMessyFooterProps } from './types';

import { MessyFooterDefault } from './MessyFooter/MessyFooter.default';

export function MessyFooter({ renderFooter, ...rest }: TMessyFooterProps) {
  if (typeof renderFooter === 'function') {
    return renderFooter(rest);
  }

  return <MessyFooterDefault {...rest} />;
}
