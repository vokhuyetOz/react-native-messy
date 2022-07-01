/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Image, Pressable, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { IMessyMessageAudio } from '../MessyMessage';

import {
  AudioStatus,
  pausePlayer,
  startPlayer,
  startRecord,
  stopPlayer,
  stopRecord,
  useAudioRecorder,
  useColors,
  useSizes,
} from '../modules';
import MessyKeyboard from './MessyKeyboard';

import type { IMessyMessageProps } from '../Messy';
import { CommonStyle } from '../utils/CommonStyle';

function MessyKeyboardAudioSend({
  audio,
  setAudio,
}: {
  audio?: IMessyMessageAudio;
  setAudio: any;
}) {
  const Sizes = useSizes();

  const onPress = () => {
    setAudio();

    MessyKeyboard?.KeyboardRegistry?.onItemSelected?.(
      'messy.MessyKeyboardAudio',
      {
        audio,
      }
    );
  };

  if (!audio?.uri) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        CommonStyle.shadow,
        {
          position: 'absolute',
          right: Sizes.padding,
          bottom: Sizes.padding * 2,
          width: Sizes.image_width_keyboard / 3,
          height: Sizes.image_width_keyboard / 3,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: Sizes.image_width_keyboard / 4,
        },
      ]}
    >
      <Image
        style={{
          width: Sizes.image_width_keyboard / 5,
          height: Sizes.image_width_keyboard / 5,
        }}
        source={require('../utils/images/send.png')}
      />
    </Pressable>
  );
}

function MessyKeyboardAudioRecord({
  onPress,
  recording = false,
}: {
  onPress?: () => void;
  recording: boolean;
}) {
  const Sizes = useSizes();
  const Colors = useColors();

  const shared = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const tintColor = interpolateColor(
      shared.value,
      [0, 1],
      [Colors.shadow, Colors.accent]
    );
    return {
      width: Sizes.image_width_keyboard / 3,
      height: Sizes.image_width_keyboard / 3,
      tintColor,
    };
  });

  useEffect(() => {
    if (recording) {
      shared.value = withRepeat(withSpring(1), Number.NEGATIVE_INFINITY, true);
    } else {
      shared.value = 0;
    }
  }, [recording]);

  return (
    <Pressable
      onPress={onPress}
      style={[
        CommonStyle.shadow,
        {
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          width: Sizes.image_width_keyboard / 1.5,
          height: Sizes.image_width_keyboard / 1.5,
          borderRadius: Sizes.image_width_keyboard / 3,
        },
      ]}
    >
      <Animated.Image
        source={require('../utils/images/microphone.png')}
        style={animatedStyle}
      />
    </Pressable>
  );
}

function MessyKeyboardAudioItem(props: IMessyMessageProps) {
  const { renderMessageAudio, data } = props;

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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: Sizes.image_max_width * shared.value,
      height: Sizes.input_height,
      backgroundColor: Colors.message_right.audio,
      borderRadius: Sizes.border_radius,
    };
  });
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
      return;
    }
    await startPlayer?.(data?.audio?.uri, (e: any) => {
      setPlayListen(e);
    });
  };

  let source = require('../utils/images/play.png');

  if (playListen.status === AudioStatus.PLAYING) {
    source = require('../utils/images/pause.png');
  }

  return (
    <View
      style={[
        CommonStyle.shadow,
        {
          width: Sizes.image_max_width,
          height: Sizes.input_height,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: Sizes.border_radius,
          marginVertical: Sizes.padding,
          backgroundColor: Colors.primary,
        },
      ]}
    >
      <Animated.View style={animatedStyle} />
      <Pressable
        onPress={onPress}
        style={{ position: 'absolute', right: Sizes.padding }}
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
  );
}

export function MessyKeyboardAudio() {
  const Sizes = useSizes();
  const [audio, setAudio] = useState<IMessyMessageAudio>();
  const [recording, setRecording] = useState<boolean>(false);

  const onPress = async () => {
    try {
      if (recording) {
        const result = await stopRecord?.();
        console.log('result', result);
        if (result) {
          setAudio({ uri: result });
        }
        return;
      }
      setAudio(undefined);
      startRecord();
    } catch (error: any) {
      console.warn(error?.message);
    } finally {
      setRecording(!recording);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: Sizes.border,
        paddingTop: Sizes.padding,
      }}
    >
      <MessyKeyboardAudioRecord onPress={onPress} recording={recording} />
      <View
        style={{
          position: 'absolute',
          top: 0,
        }}
      >
        {!!audio?.uri && (
          //@ts-ignore
          <MessyKeyboardAudioItem key={audio.uri} data={{ audio }} />
        )}
      </View>
      <MessyKeyboardAudioSend audio={audio} setAudio={setAudio} />
    </View>
  );
}
