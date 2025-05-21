import React, { useRef } from 'react';
import { Pressable, Vibration, View } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { TMessyMessageProps } from '../types';

import { useMessyPropsContext, useSizes, setMessageReplying } from '../modules';
import { MessyMessageContentImage } from './MessyMessageContentImage';
import { MessyMessageContentText } from './MessyMessageContentText';

import { MessyMessageContentLocation } from './MessyMessageContentLocation';
import { MessyMessageContentVideo } from './MessyMessageContentVideo';
import { MText } from '../elements/MText/MText';
import { MessyMessageContentOther } from './MessyMessageContentOther';
import { MessyMessageContentReaction } from './MessyMessageContentReaction';
import { MessyMessageContentStatus } from './MessyMessageContentStatus';
import { MImage } from '../elements/MImage/MImage';

function MessyMessageContentSwipeableRight(
  _: SharedValue<number>,
  drag: SharedValue<number>
) {
  const Sizes = useSizes();

  const styleAnimation = useAnimatedStyle(() => {
    const size = Sizes.swipe_threshold;
    return {
      alignItems: 'center',
      width: size,
      transform: [{ translateX: drag.value + size }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <MImage
        autoSize={false}
        source={require('../utils/images/reply.png')}
        style={{
          width: Sizes.swipe_reply_icon,
          height: Sizes.swipe_reply_icon,
          transform: [{ rotateY: '180deg' }],
        }}
      />
      <MText style={{ fontSize: Sizes.swipe_reply_text }}>Reply</MText>
    </Reanimated.View>
  );
}

function MessyMessageContentSwipeableLeft(
  _: SharedValue<number>,
  drag: SharedValue<number>
) {
  const Sizes = useSizes();
  const size = Sizes.swipe_threshold;
  const styleAnimation = useAnimatedStyle(() => {
    return {
      width: size,
      alignItems: 'center',
      transform: [{ translateX: drag.value - size }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <MImage
        autoSize={false}
        source={require('../utils/images/reply.png')}
        style={{
          width: Sizes.swipe_reply_icon,
          height: Sizes.swipe_reply_icon,
        }}
      />
      <MText style={{ fontSize: Sizes.swipe_reply_text }}>Reply</MText>
    </Reanimated.View>
  );
}

export function MessyMessageContentSwipeable(props: TMessyMessageProps) {
  const Sizes = useSizes();
  const messyProps = useMessyPropsContext();
  const swipeableRef = useRef<SwipeableMethods>(null);

  const {
    renderMessageSystem,
    user,
    messageProps = {
      hideOwnerAvatar: true,
      hidePartnerAvatar: false,
      onLongPress: undefined,
      onPress: undefined,
    },
    replySwipable,
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

  const onPress = () => {
    // contentStatusRef?.current?.setDisplay?.((pre: boolean) => !pre);
    messageProps.onPress?.({ ...props, ...messyProps });
  };
  const onLongPress = () => {
    messageProps.onLongPress?.({ ...props, ...messyProps });
  };
  const onSwipeableWillOpen = () => {
    setMessageReplying(value);
    Vibration.vibrate();
  };
  const onSwipeableOpen = () => {
    swipeableRef.current?.close();
  };
  let maxWidth = Sizes.text_max_width;
  if (value.video || value.image || value.local) {
    maxWidth = Sizes.image_max_width;
  }

  const isMyMessage = user?.id === value.user?.id;

  const dragOffsetFromRightEdge = { true: undefined, false: Number.MAX_VALUE }[
    `${isMyMessage}`
  ];
  const dragOffsetFromLeftEdge = { true: Number.MAX_VALUE, false: undefined }[
    `${isMyMessage}`
  ];

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      dragOffsetFromRightEdge={dragOffsetFromRightEdge}
      dragOffsetFromLeftEdge={dragOffsetFromLeftEdge}
      rightThreshold={Sizes.swipe_threshold}
      leftThreshold={Sizes.swipe_threshold}
      renderRightActions={MessyMessageContentSwipeableRight}
      renderLeftActions={MessyMessageContentSwipeableLeft}
      onSwipeableWillOpen={onSwipeableWillOpen}
      onSwipeableOpen={onSwipeableOpen}
      {...replySwipable}
    >
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
    </ReanimatedSwipeable>
  );
}
