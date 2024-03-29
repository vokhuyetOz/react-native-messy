/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useSizes } from '../modules';
import { MessyMessageAvatar } from './MessyMessageAvatar';
import { MessyMessageContentImage } from './MessyMessageContentImage';
import { MessyMessageContentText } from './MessyMessageContentText';

import type { IMessyMessageProps } from '../Messy';
import { MessyMessageContentStatus } from './MessyMessageContentStatus';

export function MessyMessageContent(props: IMessyMessageProps) {
  const Sizes = useSizes();

  const {
    user,
    value,
    messageProps = { hideOwnerAvatar: true, hidePartnerAvatar: false },
    index,
  } = props;

  //System message
  if (value?.type === 'system') {
    return (
      <Text style={{ alignSelf: 'center', fontSize: Sizes.system }}>
        {value.text}
      </Text>
    );
  }
  const justifyContent: any = {
    true: 'flex-end',
    false: 'flex-start',
  }[`${user?.id === value?.user?.id}`];

  const renderAvatarLeft = () => {
    if (justifyContent === 'flex-end') {
      return null;
    }
    if (messageProps?.hidePartnerAvatar) {
      return null;
    }
    return <MessyMessageAvatar {...props} />;
  };
  const renderAvatarRight = () => {
    if (justifyContent === 'flex-start') {
      return null;
    }
    if (messageProps?.hideOwnerAvatar) {
      return null;
    }
    return <MessyMessageAvatar {...props} />;
  };
  //FIXME: reimplement
  // const onPress = () => {
  //   contentStatusRef?.current?.setDisplay?.((pre: boolean) => !pre);
  // };

  let maxWidth = Sizes.text_max_width;
  if (value.image || value.local) {
    maxWidth = Sizes.image_max_width;
  }

  return (
    <View
      style={{
        alignItems: 'flex-start',
        marginBottom: Sizes.padding / 2,
        paddingHorizontal: Sizes.padding,
        flexDirection: 'row',
        justifyContent,
      }}
    >
      {renderAvatarLeft()}
      <Pressable
      // onPress={onPress}
      >
        <View
          style={{
            borderRadius: Sizes.border_radius,
            maxWidth,
            marginHorizontal: Sizes.padding / 2,
            overflow: 'hidden',
          }}
        >
          {!!value.text && <MessyMessageContentText {...props} />}
          <MessyMessageContentImage {...props} />
        </View>
        <View
          style={{
            alignItems: justifyContent,
          }}
        >
          <MessyMessageContentStatus last={index === 0} value={value} />
        </View>
      </Pressable>
      {renderAvatarRight()}
    </View>
  );
}
