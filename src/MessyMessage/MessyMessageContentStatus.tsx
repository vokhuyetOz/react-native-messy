import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

import type { TMessyMessage } from '../types';

import { useColors, useMessyPropsContext, useSizes } from '../modules';

import { MImage } from '../elements/MImage/MImage';
import { MText } from '../elements/MText/MText';

type MessyMessageContentStatusProps = Readonly<{
  value: TMessyMessage;
  last: boolean;
}>;

export function MessyMessageContentStatus({
  value,
  last,
}: MessyMessageContentStatusProps) {
  const Colors = useColors();
  const Sizes = useSizes();
  const { user } = useMessyPropsContext();

  const [display, setDisplay] = useState(last);

  useEffect(() => {
    setDisplay(last);
  }, [last]);

  if (!display) {
    return null;
  }

  const alignItems: any = {
    true: 'flex-end',
    false: 'flex-start',
  }[`${user?.id === value?.user?.id}`];

  const renderContent = () => {
    if (value.seenBy && Array.isArray(value.seenBy) && value.seenBy.length) {
      return (
        <View
          style={{
            height: Sizes.avatar / 2,
            marginTop: Sizes.padding / 4,
            flexDirection: 'row',
            marginHorizontal: Sizes.padding / 2,
          }}
        >
          {value.seenBy.map((item) => {
            if (item.avatar) {
              return (
                <MImage
                  autoSize={false}
                  key={`${item.id}`}
                  source={item.avatar}
                  style={{
                    width: Sizes.avatar / 2,
                    height: Sizes.avatar / 2,
                    marginHorizontal: Sizes.padding / 4,
                    borderRadius: Sizes.avatar / 4,
                  }}
                />
              );
            }
            if (item.userName) {
              return (
                <View
                  key={`${item.id}`}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: Sizes.avatar / 2,
                    height: Sizes.avatar / 2,
                    borderRadius: Sizes.avatar / 4,
                    backgroundColor: Colors.message_left.background,
                    marginHorizontal: Sizes.padding / 4,
                  }}
                >
                  <MText
                    style={{
                      fontWeight: 'bold',
                      fontSize: Sizes.avatar / 4,
                      color: Colors.primary,
                    }}
                  >
                    {item.userName?.[0]}
                  </MText>
                </View>
              );
            }
            return null;
          })}
        </View>
      );
    }
    let source = require('../utils/images/circle_o.png');
    if (value.status === 'sent') {
      source = require('../utils/images/time_check.png');
    }
    if (value.status === 'seen') {
      source = require('../utils/images/time_check_done.png');
    }
    return (
      <MImage
        autoSize={false}
        source={source}
        style={{
          width: Sizes.date_time / 1.2,
          height: Sizes.date_time / 1.2,
          marginHorizontal: Sizes.padding,
          marginTop: Sizes.padding / 4,
          tintColor: Colors.success,
        }}
      />
    );
  };

  return (
    <View
      style={{
        alignItems,
      }}
    >
      <Animated.View entering={ZoomIn} exiting={ZoomOut}>
        {renderContent()}
      </Animated.View>
    </View>
  );
}
