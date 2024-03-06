import React from 'react';
import { MLoading } from './elements/Loading/Loading';
import type { IMessyProps } from './Messy';

export function MessyLoading(props: IMessyProps) {
  const { renderLoading } = props;
  if (typeof renderLoading === 'function') {
    return renderLoading({});
  }
  return <MLoading />;
}
