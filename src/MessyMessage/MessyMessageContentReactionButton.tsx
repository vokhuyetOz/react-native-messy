import React, { useRef } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  Pressable,
} from 'react-native';

import type { TMessyMessageProps } from '../types';

import { useMessyPropsContext, useSizes } from '../modules';
import { MText } from '../elements/MText/MText';
import { setReactionMessage } from '../MessyReaction/modules/useReactionMessage';

export function MessyMessageContentReactionButton(props: TMessyMessageProps) {
  const Sizes = useSizes();
  const messyProps = useMessyPropsContext();

  const { user, reaction } = messyProps;
  const { value } = props;

  const componentRef = useRef<{ layout?: LayoutRectangle }>({
    layout: undefined,
  });

  if (reaction?.renderReactionButton) {
    return reaction.renderReactionButton({ ...messyProps, ...props });
  }

  if (user?.id === value?.user?.id) {
    return null;
  }
  const onLayout = (e: LayoutChangeEvent) => {
    componentRef.current.layout = e.nativeEvent.layout;
  };
  const onPress = (e: GestureResponderEvent) => {
    setReactionMessage({
      layout: { ...e.nativeEvent, ...componentRef.current.layout! },
      message: value,
    });
  };

  return (
    <Pressable onPress={onPress} hitSlop={Sizes.padding} onLayout={onLayout}>
      <MText style={{ fontSize: Sizes.emoji_button }}>🫥</MText>
    </Pressable>
  );
}
