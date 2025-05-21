import React from 'react';
import { Pressable, View } from 'react-native';

import {
  setMessageReplying,
  useColors,
  useMessageReplying,
  useMessyPropsContext,
  useSizes,
} from '../modules';
import { MText } from '../elements/MText/MText';
import { TUser } from '../types';
import { MImage } from '../elements/MImage/MImage';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

type TMessyFooterReplyingAvatar = Readonly<{
  data?: TUser;
}>;

function MessyFooterReplyingAvatarImage({ data }: TMessyFooterReplyingAvatar) {
  const Sizes = useSizes();
  const Colors = useColors();

  if (!data?.avatar) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: Sizes.reply.avatar,
          height: Sizes.reply.avatar,
          borderRadius: Sizes.reply.avatar / 2,
          backgroundColor: Colors.message_left.background,
        }}
      >
        <MText
          style={{
            fontWeight: 'bold',
            fontSize: Sizes.reply.avatar / 2,
            color: Colors.primary,
          }}
        >
          {data?.userName?.[0]}
        </MText>
      </View>
    );
  }
  return (
    <MImage
      autoSize={false}
      source={data.avatar}
      style={{
        width: Sizes.reply.avatar,
        height: Sizes.reply.avatar,
        borderRadius: Sizes.reply.avatar / 2,
      }}
      resizeMode={'cover'}
    />
  );
}
function MessyFooterReplyingAvatar({ data }: TMessyFooterReplyingAvatar) {
  const Sizes = useSizes();
  const Colors = useColors();
  if (!data) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: Sizes.padding / 2,
      }}
    >
      <MessyFooterReplyingAvatarImage data={data} />
      <MText
        style={{
          fontWeight: 'bold',
          fontSize: Sizes.reply.name,
          color: Colors.primary,
          paddingLeft: Sizes.padding / 2,
        }}
      >
        {data.userName}
      </MText>
    </View>
  );
}

export function MessyFooterReplying() {
  const Sizes = useSizes();
  const { footerProps } = useMessyPropsContext();
  const message = useMessageReplying();

  if (!message) {
    return null;
  }
  if (footerProps?.renderFooterReplying) {
    return footerProps.renderFooterReplying(message);
  }

  const onPress = () => {
    setMessageReplying();
  };

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={{ padding: Sizes.padding, borderTopWidth: Sizes.border }}
    >
      <MessyFooterReplyingAvatar data={message.user} />
      <MText numberOfLines={3}>{message.text}</MText>
      <Pressable
        onPress={onPress}
        style={{
          position: 'absolute',
          right: Sizes.padding,
          top: Sizes.padding,
        }}
        hitSlop={Sizes.padding}
      >
        <MImage
          autoSize={false}
          source={require('../utils/images/x.png')}
          style={{ width: Sizes.reply.close, height: Sizes.reply.close }}
        />
      </Pressable>
    </Animated.View>
  );
}
