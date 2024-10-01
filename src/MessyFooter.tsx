import React from 'react';

import { MessyFooterDefault } from './MessyFooter/MessyFooter.default';
import { useMessyPropsContext } from './modules';

export function MessyFooter() {
  const { footerProps } = useMessyPropsContext();
  if (typeof footerProps?.renderFooter === 'function') {
    return footerProps.renderFooter(footerProps);
  }

  return <MessyFooterDefault />;
}
