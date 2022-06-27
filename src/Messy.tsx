/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { FlatList } from 'react-native-bidirectional-infinite-scroll';

import { MessyLoading } from './MessyLoading';

import { IColor, useColors, useInitColors } from './modules';
import { IMessyFooterProps, MessyFooter } from './MessyFooter';
import { IMessyMessage, IUser, MessyMessage } from './MessyMessage';

import type { ParseShape } from 'react-native-parsed-text';
import type { LightboxProps } from 'react-native-lightbox-v2';

export interface IMessyProps {
  loading: boolean | undefined;
  messages: IMessyMessage[] | [] | undefined;
  user: IUser;
  theme: IColor;
  onEndReached: () => Promise<void>;
  onStartReached: () => Promise<void>;
  renderLoading: () => JSX.Element;
  renderAvatar: ({ user }: { user?: IUser }) => JSX.Element;
  renderMessageText: (data: IMessyMessage) => JSX.Element;
  renderMessageAudio: (data: IMessyMessage) => JSX.Element;
  renderMessageImage: (data: IMessyMessage) => JSX.Element;
  renderMessageDateTime: (data: IMessyMessage) => JSX.Element;
  footerProps: IMessyFooterProps;
  imageLightboxProps: LightboxProps;
  parsedShape: ParseShape[];
}

export interface IMessyMessageProps extends IMessyProps {
  data: IMessyMessage;
  preMessage?: IMessyMessage;
  index?: number;
}

export function Messy(props: IMessyProps) {
  useInitColors(props.theme);
  const Colors = useColors();

  const flatlistRef: any = useRef();

  const componentRef = useRef<{
    keyboard?: NodeJS.Timeout;
    scrollOffset: number;
    contentHeight: number;
  }>({
    keyboard: undefined,
    scrollOffset: 0,
    contentHeight: 0,
  });

  useEffect(() => {
    return () => {
      if (componentRef.current.keyboard) {
        clearTimeout(componentRef.current.keyboard);
      }
    };
  }, []);

  const { loading, onEndReached, onStartReached, messages = [], user } = props;

  const onScrollToOffset = (offset: number) => {
    if (componentRef.current.keyboard) {
      clearTimeout(componentRef.current.keyboard);
    }
    componentRef.current.keyboard = setTimeout(() => {
      // flatlistRef.current?.scrollToEnd?.({});
      flatlistRef.current?.scrollToOffset?.({
        offset,
      });
    }, 300);
  };

  if (loading) {
    return <MessyLoading {...props} />;
  }

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <FlatList
          // @ts-ignore
          ref={flatlistRef}
          style={{
            // flex: 1,
            backgroundColor: Colors.background,
          }}
          onLayout={({ nativeEvent }) => {
            onScrollToOffset(nativeEvent.layout.height);
          }}
          onContentSizeChange={(_w, h) => {
            if (
              //40 is height of dot icon
              //prevent scroll when show/hide message status
              componentRef.current.contentHeight !== 0 &&
              h < componentRef.current.contentHeight + 40
            ) {
              componentRef.current.contentHeight = h;
              return;
            }
            componentRef.current.contentHeight = h;
            if (
              componentRef.current.scrollOffset &&
              messages[messages.length - 1]?.user?.id !== user?.id
            ) {
              return;
            }
            //bottom of scrollview
            //extra keyboard
            onScrollToOffset(h + 500);
          }}
          onScroll={({ nativeEvent }) => {
            componentRef.current.scrollOffset = nativeEvent.contentOffset.y;
          }}
          data={messages}
          showDefaultLoadingIndicators={true}
          onEndReached={onEndReached}
          onStartReached={onStartReached}
          keyExtractor={(item: IMessyMessage) => `${item.id}`}
          renderItem={({
            item,
            index,
          }: {
            item: IMessyMessage;
            index: number;
          }) => {
            return (
              <MessyMessage
                {...props}
                data={item}
                index={index}
                preMessage={messages[index - 1]}
              />
            );
          }}
        />
      </View>
      <MessyFooter {...props.footerProps} />
    </>
  );
}
