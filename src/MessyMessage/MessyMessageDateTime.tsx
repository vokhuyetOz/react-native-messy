/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text } from 'react-native';
import dayjs from 'dayjs';

import { useColors, useSizes } from '../modules';

import type { IMessyMessageProps } from '../Messy';

export function MessyMessageDateTime(props: IMessyMessageProps) {
  const Colors = useColors();
  const Sizes = useSizes();

  const { renderMessageDateTime, data, preMessage } = props;
  if (!data?.createdTime) return null;

  if (typeof renderMessageDateTime === 'function') {
    return renderMessageDateTime(data);
  }
  const currentDate = dayjs(data.createdTime).format('YYYY MMMM DD');
  const preDate = dayjs(preMessage?.createdTime).format('YYYY MMMM DD');
  if (preMessage?.createdTime && currentDate === preDate) {
    return null;
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
      {currentDate}
    </Text>
  );
}
