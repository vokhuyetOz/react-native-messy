/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useColors, useSizes } from '../modules';
import { MessyMessageAvatar } from './MessyMessageAvatar';
import { MessyMessageContentImage } from './MessyMessageContentImage';
import { MessyMessageContentText } from './MessyMessageContentText';

import type { IMessyMessageProps } from '../Messy';
import { MessyMessageContentStatus } from './MessyMessageContentStatus';

export function MessyMessageContent(props: IMessyMessageProps) {
  const Colors = useColors();
  const Sizes = useSizes();

  const contentStatusRef = useRef<any>(null);

  const { user, data, messages } = props;

  //System message
  if (data?.type === 'system') {
    return <Text style={{ alignSelf: 'center' }}>{data.text}</Text>;
  }
  const justifyContent: any = {
    true: 'flex-end',
    false: 'flex-start',
  }[`${user?.id === data?.user?.id}`];

  const backgroundColor: string = {
    true: Colors.message_right.background,
    false: Colors.message_left.background,
  }[`${user?.id === data?.user?.id}`];

  const renderAvatarLeft = () => {
    if (justifyContent === 'flex-end') {
      return null;
    }
    return <MessyMessageAvatar {...props} />;
  };
  const renderAvatarRight = () => {
    if (justifyContent === 'flex-start') {
      return null;
    }
    return <MessyMessageAvatar {...props} />;
  };

  const onPress = () => {
    contentStatusRef?.current?.setDisplay?.((pre: boolean) => !pre);
  };

  let maxWidth = Sizes.text_max_width;
  if (data.image) {
    maxWidth = Sizes.image_max_width;
  }

  return (
    <View
      style={{
        alignItems: 'flex-start',
        marginBottom: Sizes.padding,
        paddingHorizontal: Sizes.padding,
        flexDirection: 'row',
        justifyContent,
      }}
    >
      {renderAvatarLeft()}
      <Pressable onPress={onPress}>
        <View
          style={{
            backgroundColor,
            borderRadius: Sizes.border_radius,
            maxWidth,
            marginHorizontal: Sizes.padding / 2,
          }}
        >
          <MessyMessageContentText {...props} />
          <MessyMessageContentImage {...props} />
        </View>
        <View
          style={{
            alignItems: justifyContent,
          }}
        >
          <MessyMessageContentStatus
            ref={contentStatusRef}
            last={messages?.[messages?.length - 1]?.id === data.id}
            data={data}
          />
        </View>
      </Pressable>

      {renderAvatarRight()}
    </View>
  );
}
