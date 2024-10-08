import React from 'react';
import { Linking, Pressable } from 'react-native';

import type { TMessyMessageProps } from '../types';

import { useColors, useMessyPropsContext, useSizes } from '../modules';

import { MImage } from '../elements/MImage/MImage';
import { MText } from '../elements/MText/MText';

export function MessyMessageContentLocation(props: TMessyMessageProps) {
  const Colors = useColors();
  const Sizes = useSizes();
  const messyProps = useMessyPropsContext();
  const { renderMessageLocation, user, messageProps } = messyProps;
  const { value } = props;

  if (!value?.location) {
    return null;
  }

  if (typeof renderMessageLocation === 'function') {
    return renderMessageLocation({ ...props, ...messyProps });
  }
  const onPress = async () => {
    if (messageProps?.onPress) {
      return;
    }
    Linking.openURL(
      `https://maps.google.com/maps?q=${value.location?.latitude},${value.location?.longitude}+(${value.location?.name})&z=14&ll=${value.location?.latitude},${value.location?.longitude}`
    ).catch();
  };

  const backgroundColor: string = {
    true: Colors.message_right.background,
    false: Colors.message_left.background,
  }[`${user?.id === value?.user?.id}`];

  const textColor: string = {
    true: Colors.message_right.text,
    false: Colors.message_left.text,
  }[`${user?.id === value?.user?.id}`];

  return (
    <Pressable onPress={onPress}>
      <MImage source={value.location.image} autoSize />
      <MText
        numberOfLines={2}
        style={{
          textDecorationLine: 'underline',
          backgroundColor,
          color: textColor,
          fontSize: Sizes.message,
          lineHeight: Sizes.message_line_height,
          paddingHorizontal: Sizes.padding,
          paddingVertical: Sizes.padding / 2,
        }}
      >
        {value.location.name}
      </MText>
    </Pressable>
  );
}
