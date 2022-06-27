/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  Dispatch,
  SetStateAction,
} from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { Layout, ZoomIn, ZoomOut } from 'react-native-reanimated';

import { useColors, useSizes } from '../modules';

import type { IMessyMessage } from './MessyMessage';

type MessyMessageContentStatusHandle = {
  setDisplay: Dispatch<SetStateAction<boolean>>;
};

type MessyMessageContentStatusProps = {
  data: IMessyMessage;
  last: boolean;
};

const MessyMessageContentStatus = forwardRef<
  MessyMessageContentStatusHandle,
  MessyMessageContentStatusProps
>(({ data, last }, ref) => {
  const Colors = useColors();
  const Sizes = useSizes();

  const [display, setDisplay] = useState(last);

  useImperativeHandle(ref, () => ({
    setDisplay,
  }));

  useEffect(() => {
    if (last !== display && display === true) {
      setDisplay(last);
    }
  }, [last]);
  if (!display) return null;

  const renderContent = () => {
    if (data.seenBy && Array.isArray(data.seenBy) && data.seenBy.length) {
      return (
        <View
          style={{
            height: Sizes.avatar / 2,
            marginTop: Sizes.padding / 4,
            flexDirection: 'row',
            marginHorizontal: Sizes.padding / 2,
          }}
        >
          {data.seenBy.map((item) => {
            if (item.avatar) {
              return (
                <Image
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
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: Sizes.avatar / 4,
                      color: Colors.primary,
                    }}
                  >
                    {item.userName?.[0]}
                  </Text>
                </View>
              );
            }
            return null;
          })}
        </View>
      );
    }
    let source = require('../utils/images/circle_o.png');
    if (data.status === 'sent') {
      source = require('../utils/images/time_check.png');
    }
    if (data.status === 'seen') {
      source = require('../utils/images/time_check_done.png');
    }
    return (
      <Image
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
    <Animated.View
      entering={ZoomIn}
      exiting={ZoomOut}
      layout={Layout.springify()}
    >
      {renderContent()}
    </Animated.View>
  );
});

export { MessyMessageContentStatus };
