import React from 'react';
import { Pressable, View } from 'react-native';

import type { TMessyMessageProps } from '../types';

import { useMessyPropsContext, useSizes } from '../modules';
import { MessyMessageAvatar } from './MessyMessageAvatar';
import { MessyMessageContentImage } from './MessyMessageContentImage';
import { MessyMessageContentText } from './MessyMessageContentText';

import { MessyMessageContentLocation } from './MessyMessageContentLocation';
import { MessyMessageContentVideo } from './MessyMessageContentVideo';
import { MText } from '../elements/MText/MText';
import { MessyMessageContentOther } from './MessyMessageContentOther';
import { MessyMessageContentReactionButton } from './MessyMessageContentReactionButton';
import { MessyMessageContentReaction } from './MessyMessageContentReaction';
import { MessyMessageContentStatus } from './MessyMessageContentStatus';

export function MessyMessageContent(props: TMessyMessageProps) {
  const Sizes = useSizes();
  const messyProps = useMessyPropsContext();

  const {
    renderMessageSystem,
    user,
    messageProps = { hideOwnerAvatar: true, hidePartnerAvatar: false },
  } = messyProps;
  const { value, index } = props;

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
    messageProps.onPress?.({ ...props, ...messyProps });
  };
  const onLongPress = () => {
    messageProps.onLongPress?.({ ...props, ...messyProps });
  };

  let maxWidth = Sizes.text_max_width;
  if (value.image || value.local) {
    maxWidth = Sizes.image_max_width;
  }

  return (
    <View
      style={{
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: Sizes.padding,
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
        <MessyMessageContentReaction {...props} />
        <MessyMessageContentStatus {...props} last={index === 0} />
      </Pressable>
      <MessyMessageContentReactionButton {...props} />
      {renderAvatarRight()}
    </View>
  );
}
