import React, { useRef, type ReactNode } from 'react';
import { Keyboard, Pressable, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useMessy } from '../../context';
import { isImageMessage, isVideoMessage } from '../../core/helpers';
import type { TMessyMessageSlotProps } from '../../types';
import { MText } from '../primitives';
import {
  PANEL_ANIMATION_MS,
  useMessyComposerActions,
} from '../composer/ComposerContext';

/** Picks content slots for a message and wraps them in the Bubble slot. */
const REPLY_DISTANCE = 56;

/** Drag the row by `direction` (1 = right) past REPLY_DISTANCE to reply. */
function SwipeToReply({
  direction,
  enabled,
  onReply,
  children,
}: Readonly<{
  direction: 1 | -1;
  enabled: boolean;
  onReply: () => void;
  children: ReactNode;
}>) {
  const { theme } = useMessy();
  const x = useSharedValue(0);
  const pan = Gesture.Pan()
    .enabled(enabled)
    // only starts on a horizontal drag in `direction`, so list scrolling wins
    .activeOffsetX(direction * 12)
    .failOffsetY([-12, 12])
    .onUpdate((e) => {
      const d = Math.min(
        Math.max(e.translationX * direction, 0),
        REPLY_DISTANCE * 1.3
      );
      x.value = d * direction;
    })
    .onEnd(() => {
      if (Math.abs(x.value) >= REPLY_DISTANCE) {
        runOnJS(onReply)();
      }
    })
    .onFinalize(() => {
      x.value = withSpring(0, { damping: 20, stiffness: 220 });
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));
  const iconStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.abs(x.value) / REPLY_DISTANCE, 1);
    return { opacity: p, transform: [{ scale: 0.5 + 0.5 * p }] };
  });
  const size = 28;
  return (
    <GestureDetector gesture={pan}>
      <Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              [direction > 0 ? 'left' : 'right']: 0,
            },
            iconStyle,
          ]}
        >
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.surface,
            }}
          >
            {/* FE0E: text style, otherwise iOS draws the emoji arrow */}
            <MText style={{ fontSize: 15, color: theme.colors.text }}>
              {'\u21A9\uFE0E'}
            </MText>
          </View>
        </Animated.View>
        <Animated.View style={rowStyle}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

function MessageBody(props: TMessyMessageSlotProps) {
  const { components: C } = useMessy();
  const { message } = props;
  const image = isImageMessage(message);
  const video = !image && isVideoMessage(message);
  const location = !!message.location;
  const text = !!message.text;
  const quoted = !!message.replyTo;
  if (!text && !image && !video && !location) {
    return <C.MessageCustom {...props} />;
  }
  return (
    <C.Bubble {...props} media={!text && !quoted}>
      {quoted && <C.MessageReply {...props} />}
      {image && <C.MessageImage {...props} />}
      {video && <C.MessageVideo {...props} />}
      {location && <C.MessageLocation {...props} />}
      {text && <C.MessageText {...props} />}
    </C.Bubble>
  );
}

export function DefaultMessage(props: TMessyMessageSlotProps) {
  const { theme, components: C, props: messy, openReactionPicker } = useMessy();
  const { dismiss, setReplyTo, focus } = useMessyComposerActions();
  const { width } = useWindowDimensions();
  const bodyRef = useRef<View>(null);
  const { message, isOwn, position, showDay, layout, isLatestOwn } = props;

  const day = showDay ? <C.DaySeparator date={message.createdTime!} /> : null;
  if (message.type === 'system') {
    return (
      <View>
        {day}
        <C.SystemMessage {...props} />
      </View>
    );
  }

  const list = layout === 'list';
  const right = !list && isOwn;
  const groupStart = position === 'single' || position === 'first';
  const groupEnd = position === 'single' || position === 'last';
  const avatarSize = list ? theme.avatarSize * 1.3 : theme.avatarSize;
  const withAvatar = list
    ? true
    : isOwn
    ? !!messy.showOwnAvatar
    : messy.showAvatar !== false;
  // bubble layout: avatar sits next to the last bubble; list: next to the header
  const avatarHere = list ? groupStart : groupEnd;
  const withName = list
    ? groupStart
    : !isOwn && !!messy.showSenderName && groupStart;

  const onPress = () => {
    dismiss();
    messy.onPressMessage?.(message);
  };
  const onLongPress = () => {
    messy.onLongPressMessage?.(message);
    if (!messy.reactions || message.status === 'sending') {
      return;
    }
    // closing the keyboard/panel moves the bubble: measure once it settled
    const keyboardOpen = Keyboard.isVisible();
    const panelOpen = dismiss() && !keyboardOpen;
    const measure = () =>
      bodyRef.current?.measureInWindow((x, y, w, h) =>
        openReactionPicker(props, { x, y, width: w, height: h })
      );
    if (keyboardOpen) {
      const sub = Keyboard.addListener('keyboardDidHide', () => {
        sub.remove();
        measure();
      });
      return;
    }
    setTimeout(measure, panelOpen ? PANEL_ANIMATION_MS + 20 : 0);
  };

  const row = (
    <View
      style={{
        flexDirection: right ? 'row-reverse' : 'row',
        alignItems: list ? 'flex-start' : 'flex-end',
      }}
    >
      {withAvatar && (
        <View style={{ width: avatarSize }}>
          {avatarHere && <C.Avatar user={message.user} size={avatarSize} />}
        </View>
      )}
      <View
        style={{
          flexShrink: 1,
          flexGrow: list ? 1 : 0,
          maxWidth: list ? undefined : width * theme.bubbleMaxWidth,
          alignItems: right ? 'flex-end' : 'flex-start',
          marginHorizontal: withAvatar ? theme.spacing.sm : 0,
        }}
      >
        {withName && <C.SenderName {...props} />}
        <Pressable
          ref={bodyRef}
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={300}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <MessageBody {...props} />
        </Pressable>
        <C.ThreadSummary {...props} />
        <C.Reactions {...props} />
        {isOwn && isLatestOwn && <C.MessageStatus {...props} />}
      </View>
    </View>
  );

  return (
    <View
      style={{
        paddingHorizontal: theme.spacing.md,
        paddingTop: groupStart
          ? list
            ? theme.spacing.lg + theme.spacing.xs
            : theme.spacing.md
          : theme.spacing.xxs,
      }}
    >
      {day}
      {/* mounted whenever the prop is on: toggling it would remount the row */}
      {messy.swipeToReply ? (
        <SwipeToReply
          // toward the middle of the screen
          direction={right ? -1 : 1}
          enabled={message.status !== 'sending' && message.status !== 'failed'}
          onReply={() => {
            setReplyTo(message);
            focus();
          }}
        >
          {row}
        </SwipeToReply>
      ) : (
        row
      )}
    </View>
  );
}
