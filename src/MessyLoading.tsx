import React from 'react';
import { Loading } from './elements';
import type { IMessyProps } from './Messy';

export function MessyLoading(props: IMessyProps) {
  const { renderLoading } = props;
  if (typeof renderLoading === 'function') {
    return renderLoading();
  }
  return <Loading />;
}
