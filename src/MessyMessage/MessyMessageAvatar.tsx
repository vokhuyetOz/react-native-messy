/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, Text, View } from 'react-native';
import dayjs from 'dayjs';

import { useColors, useSizes } from '../modules';

import type { TMessyMessageProps } from '../types';

export function MessyMessageAvatar(props: TMessyMessageProps) {
  const Sizes = useSizes();
  const Colors = useColors();

  const { renderAvatar, value, preMessage } = props;

  const currentDate = dayjs(value.createdTime).format('YYYY MMMM DD');
  const preDate = dayjs(preMessage?.createdTime).format('YYYY MMMM DD');

  if (currentDate === preDate && preMessage?.user?.id === value?.user?.id) {
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
    return renderAvatar(value);
  }

  if (!value?.user?.avatar) {
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
          {value?.user?.userName?.[0]}
        </Text>
      </View>
    );
  }
  return (
    <Image
      source={value.user.avatar}
      style={{
        width: Sizes.avatar,
        height: Sizes.avatar,
        borderRadius: Sizes.avatar / 2,
      }}
      resizeMode={'cover'}
    />
  );
}
