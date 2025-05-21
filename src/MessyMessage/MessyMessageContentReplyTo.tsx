import React from 'react';
import { View } from 'react-native';
import { TMessyMessageProps } from '../types';
import { MText } from '../elements/MText/MText';
import { useColors, useMessyPropsContext, useSizes } from '../modules';

export function MessyMessageContentReplyTo(props: TMessyMessageProps) {
  const { user, messageProps } = useMessyPropsContext();
  const Sizes = useSizes();
  const Colors = useColors();

  if (!props.value.replyTo) {
    return null;
  }
  if (messageProps?.renderMessyMessageContentReplyTo) {
    return messageProps.renderMessyMessageContentReplyTo(props);
  }

  const textColor: string = {
    true: Colors.message_right.reply_text,
    false: Colors.message_left.reply_text,
  }[`${user?.id === props.value?.user?.id}`];

  const backgroundColor: string = {
    true: Colors.message_right.reply_background,
    false: Colors.message_left.reply_background,
  }[`${user?.id === props.value?.user?.id}`];

  return (
    <View
      style={{
        borderRadius: Sizes.oval_radius,
        backgroundColor,
        maxWidth: Sizes.text_max_width,
        paddingHorizontal: Sizes.padding,
        paddingTop: Sizes.padding,
        paddingBottom: Sizes.padding * 2,
        marginHorizontal: Sizes.padding / 2,
        bottom: -Sizes.padding,
      }}
    >
      <MText style={{ fontSize: Sizes.reply.message, color: textColor }}>
        {props.value.replyTo.text}
      </MText>
    </View>
  );
}
