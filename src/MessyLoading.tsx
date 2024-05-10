import React from 'react';
import type { TMessyProps } from './types';

import { MLoading } from './elements/Loading/Loading';

export function MessyLoading(props: TMessyProps) {
  const { renderLoading } = props;
  if (typeof renderLoading === 'function') {
    return renderLoading({});
  }
  return <MLoading />;
}
