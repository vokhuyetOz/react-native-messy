import React from 'react';
import { View } from 'react-native';

import type { TMessyMessageProps } from '../types';

import { useMessyPropsContext, useSizes } from '../modules';
import { MessyMessageAvatar } from './MessyMessageAvatar';

import { MText } from '../elements/MText/MText';
import { MessyMessageContentReactionButton } from './MessyMessageContentReactionButton';
import { MessyMessageContentSwipeable } from './MessyMessageContentSwipeable';
import { MessyMessageContentReplyTo } from './MessyMessageContentReplyTo';

export function MessyMessageContent(props: TMessyMessageProps) {
  const Sizes = useSizes();
  const messyProps = useMessyPropsContext();

  const {
    renderMessageSystem,
    user,
    messageProps = { hideOwnerAvatar: true, hidePartnerAvatar: false },
  } = messyProps;
  const { value } = props;

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
  const align: any = {
    true: 'flex-end',
    false: 'flex-start',
  }[`${user?.id === value?.user?.id}`];

  const renderAvatarLeft = () => {
    if (align === 'flex-end') {
      return null;
    }
    if (messageProps?.hidePartnerAvatar) {
      return null;
    }
    return <MessyMessageAvatar {...props} />;
  };
  const renderAvatarRight = () => {
    if (align === 'flex-start') {
      return null;
    }
    if (messageProps?.hideOwnerAvatar) {
      return null;
    }
    return <MessyMessageAvatar {...props} />;
  };

  return (
    <View
      style={{
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: Sizes.padding,
        justifyContent: align,
      }}
    >
      {renderAvatarLeft()}
      <View style={{ alignItems: align }}>
        <MessyMessageContentReplyTo {...props} />
        <MessyMessageContentSwipeable {...props} />
      </View>
      <MessyMessageContentReactionButton {...props} />
      {renderAvatarRight()}
    </View>
  );
}
