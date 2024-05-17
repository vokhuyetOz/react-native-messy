/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, View } from 'react-native';

import type { TMessyMessageProps } from '../types';

import { useMessyPropsContext, useSizes } from '../modules';
import { MessyMessageAvatar } from './MessyMessageAvatar';
import { MessyMessageContentImage } from './MessyMessageContentImage';
import { MessyMessageContentText } from './MessyMessageContentText';

import { MessyMessageContentStatus } from './MessyMessageContentStatus';
import { MessyMessageContentLocation } from './MessyMessageContentLocation';
import { MessyMessageContentVideo } from './MessyMessageContentVideo';
import { MText } from '../elements/MText/MText';
import { MessyMessageContentOther } from './MessyMessageContentOther';

export function MessyMessageContent(props: TMessyMessageProps) {
  const Sizes = useSizes();
  const { renderMessageSystem } = useMessyPropsContext();
  const {
    user,
    value,
    messageProps = { hideOwnerAvatar: true, hidePartnerAvatar: false },
    index,
  } = props;

  //System message
  if (value?.type === 'system') {
    if (typeof renderMessageSystem === 'function') {
      return renderMessageSystem({ data: value });
    }
    return (
      <MText style={{ alignSelf: 'center', fontSize: Sizes.system }}>
        {value.text}
      </MText>
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
  const onPress = () => {
    // contentStatusRef?.current?.setDisplay?.((pre: boolean) => !pre);
    messageProps.onPress?.(props);
  };
  const onLongPress = () => {
    messageProps.onLongPress?.(props);
  };

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
      <Pressable onPress={onPress} onLongPress={onLongPress}>
        <View
          style={{
            borderRadius: Sizes.border_radius,
            maxWidth,
            marginHorizontal: Sizes.padding / 2,
            overflow: 'hidden',
          }}
        >
          <MessyMessageContentText {...props} />
          <MessyMessageContentImage {...props} />
          <MessyMessageContentLocation {...props} />
          <MessyMessageContentVideo {...props} />
          <MessyMessageContentOther {...props} />
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
