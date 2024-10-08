import React from 'react';
import { View } from 'react-native';
import type { TMessyMessage, TMessyProps } from './types';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';

import { MessyLoading } from './MessyLoading';

import { useInitColors, useMessyListRef } from './modules';
import { MessyFooter } from './MessyFooter';
import { MessyMessage } from './MessyMessage';
import { MessyPropsContext } from './modules/useMessyPropsContext';
import { MessyReactionPopupDefault } from './MessyReaction/MessyReactionPopup';

type TListComponentItem = {
  item: TMessyMessage;
  index: number;
};
export function Messy(props: TMessyProps) {
  useInitColors(props.theme);

  const flatlistRef = useMessyListRef();

  const { loading, messages = [], listProps } = props;

  if (loading) {
    return <MessyLoading {...props} />;
  }

  let ListComponent:
    | typeof BottomSheetFlatList<TMessyMessage>
    | typeof FlashList<TMessyMessage> = FlashList<TMessyMessage>;

  if (props.useInBottomSheet) {
    ListComponent = BottomSheetFlatList<TMessyMessage>;
  }
  return (
    <MessyPropsContext.Provider value={props}>
      <View style={{ flex: 1 }}>
        <ListComponent
          //@ts-ignore
          ref={flatlistRef}
          estimatedItemSize={200}
          keyExtractor={(item: TMessyMessage) => `${item.clientId || item.id}`}
          maintainVisibleContentPosition={{
            minIndexForVisible: 1,
            autoscrollToTopThreshold: 1,
          }}
          scrollsToTop={false}
          data={[...messages]}
          renderItem={({ item, index }: TListComponentItem) => {
            return (
              <MessyMessage
                value={item}
                index={index}
                preMessage={messages[index - 1]}
              />
            );
          }}
          {...listProps}
          inverted
        />
        <MessyFooter />
        <MessyReactionPopupDefault />
      </View>
    </MessyPropsContext.Provider>
  );
}
