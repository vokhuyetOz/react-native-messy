/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, Text, View } from 'react-native';
import dayjs from 'dayjs';

import { useColors, useSizes } from '../modules';

import type { IMessyMessageProps } from '../Messy';

export function MessyMessageAvatar(props: IMessyMessageProps) {
  const Sizes = useSizes();
  const Colors = useColors();

  const { renderAvatar, data, preMessage } = props;

  const currentDate = dayjs(data.createdTime).format('YYYY MMMM DD');
  const preDate = dayjs(preMessage?.createdTime).format('YYYY MMMM DD');

  if (currentDate === preDate && preMessage?.user?.id === data?.user?.id) {
    return (
      <View
        style={{
          width: Sizes.avatar,
          height: Sizes.avatar,
          borderRadius: Sizes.avatar / 2,
        }}
      />
    );
  }

  if (typeof renderAvatar === 'function') {
    return renderAvatar(data);
  }

  if (!data?.user?.avatar) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: Sizes.avatar,
          height: Sizes.avatar,
          borderRadius: Sizes.avatar / 2,
          backgroundColor: Colors.message_left.background,
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: Sizes.avatar / 2,
            color: Colors.primary,
          }}
        >
          {data?.user?.userName?.[0]}
        </Text>
      </View>
    );
  }
  return (
    <Image
      source={data.user.avatar}
      style={{
        width: Sizes.avatar,
        height: Sizes.avatar,
        borderRadius: Sizes.avatar / 2,
      }}
      resizeMode={'cover'}
    />
  );
}
