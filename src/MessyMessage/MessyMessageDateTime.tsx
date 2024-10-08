import React from 'react';
import dayjs from 'dayjs';
import type { TMessyMessageProps } from '../types';
import { MText } from '../elements/MText/MText';

import { useColors, useMessyPropsContext, useSizes } from '../modules';

export function MessyMessageDateTime(props: TMessyMessageProps) {
  const Colors = useColors();
  const Sizes = useSizes();

  const { value, preMessage, index } = props;

  const { renderMessageDateTime } = useMessyPropsContext();

  if (!value?.createdTime) {
    return null;
  }

  if (typeof renderMessageDateTime === 'function') {
    return renderMessageDateTime(value);
  }
  const currentDate = dayjs(value.createdTime);
  let currentDateFormat = currentDate.format('YYYY MMMM DD');
  const preDateFormat = dayjs(preMessage?.createdTime).format('YYYY MMMM DD');
  if (preMessage?.createdTime && currentDateFormat === preDateFormat) {
    return null;
  }
  if (index === 0) {
    currentDateFormat = currentDate.format('YYYY MMMM DD  HH:mm');
  }
  return (
    <MText
      style={{
        color: Colors.placeholder,
        fontSize: Sizes.date_time,
        padding: Sizes.padding / 2,
        alignSelf: 'center',
        flex: 1,
      }}
    >
      {currentDateFormat}
    </MText>
  );
}
