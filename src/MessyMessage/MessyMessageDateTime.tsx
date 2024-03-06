/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text } from 'react-native';
import dayjs from 'dayjs';

import { useColors, useSizes } from '../modules';

import type { IMessyMessageProps } from '../Messy';

export function MessyMessageDateTime(props: IMessyMessageProps) {
  const Colors = useColors();
  const Sizes = useSizes();

  const { renderMessageDateTime, value, preMessage, index } = props;
  if (!value?.createdTime) return null;

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
    <Text
      style={{
        color: Colors.placeholder,
        fontSize: Sizes.date_time,
        padding: Sizes.padding / 2,
        alignSelf: 'center',
        flex: 1,
      }}
    >
      {currentDateFormat}
    </Text>
  );
}
