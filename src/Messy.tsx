/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { FlatList, View } from 'react-native';
import type { TMessyMessage, TMessyProps } from './types';
import { BottomSheetFlatList } from '@discord/bottom-sheet';

import { MessyLoading } from './MessyLoading';

import { useColors, useInitColors, useMessyListRef } from './modules';
import { MessyFooter } from './MessyFooter';
import { MessyMessage } from './MessyMessage';
import { MessyPropsContext } from './modules/useMessyPropsContext';

export function Messy(props: TMessyProps) {
  useInitColors(props.theme);
  const Colors = useColors();

  const flatlistRef = useMessyListRef();

  const { loading, messages = [], listProps } = props;

  if (loading) {
    return <MessyLoading {...props} />;
  }

  const ListComponent = { true: BottomSheetFlatList, false: FlatList }[
    `${props.useInBottomSheet ?? false}`
  ];

  return (
    <MessyPropsContext.Provider value={props}>
      <View style={{ flex: 1 }}>
        <ListComponent
          //@ts-ignore
          ref={flatlistRef}
          keyExtractor={(item: TMessyMessage) => `${item.clientId || item.id}`}
          style={{
            backgroundColor: Colors.background,
            flex: 1,
          }}
          maintainVisibleContentPosition={{
            minIndexForVisible: 1,
            autoscrollToTopThreshold: 1,
          }}
          scrollsToTop={false}
          data={messages}
          renderItem={({ item, index }) => {
            return (
              <MessyMessage
                {...props}
                value={item}
                index={index}
                preMessage={messages[index - 1]}
              />
            );
          }}
          {...listProps}
          inverted
        />
        <MessyFooter {...props.footerProps} />
      </View>
    </MessyPropsContext.Provider>
  );
}
