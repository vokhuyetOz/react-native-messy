/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

import {
  AudioStatus,
  pausePlayer,
  startPlayer,
  stopPlayer,
  useColors,
  useSizes,
} from '../modules';

import type { IMessyMessageProps } from '../Messy';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CommonStyle } from '../utils/CommonStyle';

export function MessyMessageContentAudio(props: IMessyMessageProps) {
  const { renderMessageAudio, data, user } = props;

  const Colors = useColors();
  const Sizes = useSizes();

  const [playListen, setPlayListen] = useState({
    status: '',
    data: {
      currentPosition: 0,
      duration: 1,
    },
  });
  const shared = useSharedValue(0);

  const backgroundColor: string = {
    true: Colors.message_right.audio,
    false: Colors.message_left.audio,
  }[`${user?.id === data?.user?.id}`];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: Sizes.image_max_width * shared.value,
      height: Sizes.input_height + Sizes.padding,
      borderRadius: Sizes.border_radius,
      backgroundColor,
    };
  });
  console.log('shared', shared.value);
  useEffect(() => {
    if (playListen.status === AudioStatus.PLAYING) {
      shared.value = withTiming(
        playListen.data.currentPosition / playListen.data.duration,
        { duration: 500 }
      );
      return;
    }
    if (playListen.status === AudioStatus.STOPPED) {
      shared.value = withTiming(1, { duration: 500 });
      return;
    }
  }, [playListen]);
  useEffect(() => {
    return () => {
      stopPlayer();
    };
  }, []);

  if (!data?.audio?.uri) return null;

  if (typeof renderMessageAudio === 'function') {
    return renderMessageAudio(data);
  }

  const onPress = async () => {
    if (playListen.status === AudioStatus.PLAYING) {
      await pausePlayer?.();
    } else {
      console.log('onPress', data);
      await startPlayer?.(data?.audio?.uri, (e: any) => {
        console.log('e', e);
        setPlayListen(e);
      });
    }
  };

  let source = require('../utils/images/play.png');

  if (playListen.status === AudioStatus.PLAYING) {
    source = require('../utils/images/pause.png');
  }

  return (
    <View
      style={{
        width: Sizes.image_max_width,
        height: Sizes.input_height + Sizes.padding,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Animated.View style={[CommonStyle.shadow, animatedStyle]} />

      <View style={{ position: 'absolute', right: Sizes.padding }}>
        <Pressable
          onPress={onPress}
          hitSlop={{
            left: Sizes.padding,
            right: Sizes.padding,
            top: Sizes.padding,
            bottom: Sizes.padding,
          }}
        >
          <Image
            source={source}
            style={{
              width: Sizes.input_height / 2,
              height: Sizes.input_height / 2,
              tintColor: Colors.accent,
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}
