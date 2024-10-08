import React from 'react';
import { Image, View } from 'react-native';
import dayjs from 'dayjs';

import { useColors, useMessyPropsContext, useSizes } from '../modules';

import type { TMessyMessageProps } from '../types';
import { MText } from '../elements/MText/MText';

export function MessyMessageAvatar(props: TMessyMessageProps) {
  const Sizes = useSizes();
  const Colors = useColors();
  const { renderAvatar } = useMessyPropsContext();

  const { value, preMessage } = props;

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
        <MText
          style={{
            fontWeight: 'bold',
            fontSize: Sizes.avatar / 2,
            color: Colors.primary,
          }}
        >
          {value?.user?.userName?.[0]}
        </MText>
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
