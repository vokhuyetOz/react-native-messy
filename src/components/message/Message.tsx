import React, { useRef } from 'react';
import { Keyboard, Pressable, View, useWindowDimensions } from 'react-native';

import { useMessy } from '../../context';
import { isImageMessage, isVideoMessage } from '../../core/helpers';
import type { TMessyMessageSlotProps } from '../../types';
import {
  PANEL_ANIMATION_MS,
  useMessyComposerActions,
} from '../composer/ComposerContext';

/** Picks content slots for a message and wraps them in the Bubble slot. */
function MessageBody(props: TMessyMessageSlotProps) {
  const { components: C } = useMessy();
  const { message } = props;
  const image = isImageMessage(message);
  const video = !image && isVideoMessage(message);
  const location = !!message.location;
  const text = !!message.text;
  if (!text && !image && !video && !location) {
    return <C.MessageCustom {...props} />;
  }
  return (
    <C.Bubble {...props} media={!text}>
      {image && <C.MessageImage {...props} />}
      {video && <C.MessageVideo {...props} />}
      {location && <C.MessageLocation {...props} />}
      {text && <C.MessageText {...props} />}
    </C.Bubble>
  );
}

export function DefaultMessage(props: TMessyMessageSlotProps) {
  const { theme, components: C, props: messy, openReactionPicker } = useMessy();
  const { dismiss } = useMessyComposerActions();
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
    </View>
  );
}
