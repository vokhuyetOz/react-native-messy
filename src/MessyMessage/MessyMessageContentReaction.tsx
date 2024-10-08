import React from 'react';
import { View, ViewProps } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

import type { TMessyMessageProps } from '../types';

import { useColors, useMessyPropsContext, useSizes } from '../modules';

import { MText } from '../elements/MText/MText';
import { useReactionConverter } from '../MessyReaction/modules/useReactionMessage';

/**
 * user's reaction
 * @param param0
 * @returns
 */
export function MessyMessageContentReaction(props: TMessyMessageProps) {
  const Colors = useColors();
  const Sizes = useSizes();
  const messyProps = useMessyPropsContext();
  const { messageProps = { hideOwnerAvatar: true, hidePartnerAvatar: false } } =
    messyProps;
  const { value } = props;

  const { list } = useReactionConverter(value.reactions);

  if (typeof messageProps?.renderMessyMessageContentReaction === 'function') {
    return messageProps.renderMessyMessageContentReaction({
      ...messyProps,
      ...props,
    });
  }

  if (!value.reactions?.length) {
    return null;
  }

  return (
    <View
      style={
        {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginHorizontal: Sizes.padding / 2,
        } as ViewProps
      }
    >
      {list.map((item, index) => {
        return (
          <Animated.View
            entering={ZoomIn}
            exiting={ZoomOut}
            key={`${index}`}
            style={{
              borderWidth: Sizes.border,
              borderColor: Colors.shadow,
              padding: Sizes.padding / 4,
              borderRadius: Sizes.wpx(4),
              marginTop: Sizes.padding / 8,
              marginHorizontal: Sizes.padding / 8,
            }}
          >
            <MText style={{ fontSize: Sizes.system, color: Colors.input.text }}>
              {item.react.value}
              {item.users.length}{' '}
            </MText>
          </Animated.View>
        );
      })}
    </View>
  );
}
