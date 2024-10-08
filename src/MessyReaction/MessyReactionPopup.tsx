import React, { useRef } from 'react';
import { LayoutChangeEvent, Pressable, View, ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

import {
  REACTION_DATA,
  setReactionMessage,
  useReactionMessage,
} from './modules/useReactionMessage';
import { useColors, useMessyPropsContext, useSizes } from '../modules';
import { MText } from '../elements/MText/MText';
import {
  TMessyReactionPopupItem,
  EMessyReactionPopupItemDirection,
  TMessyMessage,
} from '../types.d';
import { CommonStyle } from '../utils/CommonStyle';

type TMessyReactionPopupTriangle = {
  style?: ViewStyle;
};

const delay = 200;
const duration = 200;

function MessyReactionPopupTriangle({
  style,
}: Readonly<TMessyReactionPopupTriangle>) {
  const Sizes = useSizes();
  const Colors = useColors();

  return (
    <View
      style={[
        {
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: Sizes.padding,
          borderRightWidth: Sizes.padding,
          borderBottomWidth: Sizes.padding,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: Colors.background_emoji_popup,
        },
        style,
      ]}
    />
  );
}
function MessyReactionPopupTriangleUp() {
  return <MessyReactionPopupTriangle />;
}
function MessyReactionPopupTriangleDown() {
  return (
    <MessyReactionPopupTriangle style={{ transform: [{ rotate: '180deg' }] }} />
  );
}
function MessyReactionPopupItemDefault({
  data,
  direction,
}: Readonly<TMessyReactionPopupItem>) {
  const Sizes = useSizes();
  const Colors = useColors();
  const reactionMessage = useReactionMessage();
  const { reaction } = useMessyPropsContext();

  const zoomShared = useSharedValue(1);

  const animated = useAnimatedStyle(() => {
    const scale = interpolate(zoomShared.value, [1, 2], [1, 2], {
      extrapolateLeft: Extrapolation.CLAMP,
    });

    let translateYData = [0, Sizes.padding];
    if (direction === EMessyReactionPopupItemDirection.DOWN) {
      translateYData = [0, -Sizes.padding];
    }

    const translateY = interpolate(zoomShared.value, [1, 2], translateYData, {
      extrapolateLeft: Extrapolation.CLAMP,
    });
    return {
      transform: [{ scale }, { translateY }],
    };
  }, [direction]);

  const onPressIn = () => {
    zoomShared.value = withTiming(2);
  };
  const onPressOut = () => {
    zoomShared.value = withTiming(1);
  };
  const onPress = () => {
    if (typeof reaction?.onPress === 'function') {
      reaction.onPress({
        reaction: { ...data },
        message: reactionMessage?.message as TMessyMessage,
      });
    }
    setReactionMessage();
  };
  const isReacted = reactionMessage?.message.reactions?.find(
    (item) => item.reaction.key === data.key
  );
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={animated}>
        <Animated.View
          style={[
            CommonStyle.center,
            {
              width: Sizes.emoji_react + Sizes.padding,
              height: Sizes.emoji_react + Sizes.padding,
            },
          ]}
          entering={ZoomIn.springify()}
          exiting={ZoomOut.delay(delay)}
        >
          <MText
            style={{
              textAlign: 'center',
              fontSize: Sizes.emoji_react,
              textAlignVertical: 'center',
            }}
          >
            {data.value}
          </MText>
          {!!isReacted && (
            <View
              style={{
                width: Sizes.wpx(4),
                height: Sizes.wpx(4),
                backgroundColor: Colors.accent,
                borderRadius: Sizes.wpx(2),
                marginBottom: Sizes.wpx(2),
              }}
            />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export function MessyReactionPopupDefault() {
  const Colors = useColors();
  const Sizes = useSizes();
  const { reaction } = useMessyPropsContext();

  const reactionData = reaction?.data || REACTION_DATA;
  const componentRef = useRef<{ layout: { width: number; height: number } }>({
    layout: {
      width: reactionData.length * (Sizes.emoji_react + Sizes.padding),
      height: Sizes.emoji_react + Sizes.padding,
    },
  });
  //current message to react
  const reactionMessage = useReactionMessage();

  if (!reactionMessage) {
    return null;
  }

  const onLayout = (e: LayoutChangeEvent) => {
    componentRef.current.layout = e.nativeEvent.layout;
  };
  const onPress = () => {
    setReactionMessage();
  };
  /**
   * caculate left, x for pop up
   * @returns x: used for carret
   */
  const getPositonLeft = () => {
    const width = componentRef.current.layout.width ?? 0;
    const x = reactionMessage.layout.x;
    const carretX = x - reactionMessage.layout.width / 4 + 2;
    if (x - width / 2 < Sizes.padding) {
      return { left: Sizes.padding, x: carretX };
    }
    if (x + width / 2 >= Sizes.device_width) {
      return {
        left: Sizes.device_width - width - Sizes.padding,
        x: carretX,
      };
    }
    return { x: carretX, left: x - width / 2 };
  };
  /**
   * caculate top, y for pop up
   * @returns y: used for carret
   */
  const getPositonTop = () => {
    const height = componentRef.current.layout?.height ?? 0;
    const y = reactionMessage.layout.pageY - reactionMessage.layout.locationY;
    const top =
      y - height - reactionMessage.layout.height - (3 * Sizes.emoji_button) / 2;
    if (top >= height) {
      return {
        top,
        direction: EMessyReactionPopupItemDirection.DOWN,
        y: y - reactionMessage.layout.height - Sizes.padding * 2,
      };
    }
    return {
      top: y + Sizes.emoji_button / 2,
      direction: EMessyReactionPopupItemDirection.UP,
      y,
    };
  };
  const { left, x } = getPositonLeft();
  const { top, direction, y } = getPositonTop();
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        flex: 1,
        width: '100%',
        height: '100%',
        zIndex: 10,
      }}
    >
      {direction === 'up' && (
        <Animated.View
          style={{
            position: 'absolute',
            left: x,
            top: y,
          }}
          entering={FadeInDown.delay(delay).duration(duration)}
          exiting={FadeOutDown}
        >
          <MessyReactionPopupTriangleUp />
        </Animated.View>
      )}
      {direction === 'down' && (
        <Animated.View
          style={{
            position: 'absolute',
            left: x,
            top: y,
          }}
          entering={FadeInUp.delay(delay).duration(duration)}
          exiting={FadeOutUp}
        >
          <MessyReactionPopupTriangleDown />
        </Animated.View>
      )}

      <Animated.View
        style={{
          backgroundColor: Colors.background_emoji_popup,
          flexDirection: 'row',
          borderRadius: Sizes.border_radius,
          position: 'absolute',
          left,
          top,
        }}
        onLayout={onLayout}
        entering={FadeIn}
        exiting={ZoomOut.delay(delay).duration(duration)}
      >
        {reactionData.map((item, index) => {
          if (typeof reaction?.renderItems === 'function') {
            return reaction.renderItems({ item, index, direction });
          }
          return (
            <MessyReactionPopupItemDefault
              data={item}
              key={item.key}
              index={index}
              direction={direction}
            />
          );
        })}
      </Animated.View>
    </Pressable>
  );
}
