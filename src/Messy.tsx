/* eslint-disable react-native/no-inline-styles */
import React, { type FC } from 'react';
import { View, FlatList, type FlatListProps } from 'react-native';

import type { ParseShape } from 'react-native-parsed-text';

import { MessyLoading } from './MessyLoading';

import {
  type IColor,
  useColors,
  useInitColors,
  useMessyListRef,
} from './modules';
import { type IMessyFooterProps, MessyFooter } from './MessyFooter';
import { type TMessyMessage, type IUser, MessyMessage } from './MessyMessage';
import { MessyPropsContext } from './modules/useMessyPropsContext';

type TListProps = Omit<
  FlatListProps<any>,
  'data' | 'renderItem' | 'keyExtractor'
>;
type TMessageProps = {
  hideOwnerAvatar: boolean;
  hidePartnerAvatar: boolean;
};

export type IMessyProps = Readonly<{
  loading?: boolean;
  messages?: TMessyMessage[];
  user?: IUser;
  theme?: IColor;
  footerProps?: IMessyFooterProps;
  listProps?: TListProps;
  messageProps?: TMessageProps;
  handleLocalMessage?: Function;
  parsedShape?: ParseShape[];
  showDateTime?: boolean;
  renderLoading?: FC<{}>;
  renderMessageSystem?: FC<{ data?: TMessyMessage }>;
  renderAvatar?: FC<{ user?: IUser }>;
  renderMessageText?: (data: IMessyMessageProps) => JSX.Element;
  renderMessageAudio?: (data: IMessyMessageProps) => JSX.Element;
  renderMessageImage?: (data: IMessyMessageProps) => JSX.Element;
  renderMessageDateTime?: (data: TMessyMessage) => JSX.Element;
  renderMessageLocation?: (data: IMessyMessageProps) => JSX.Element;
}>;

export type IMessyMessageProps = Readonly<
  Omit<IMessyProps, 'data'> & {
    value: TMessyMessage;
    preMessage?: TMessyMessage;
    index?: number;
  }
>;

export function Messy(props: IMessyProps) {
  useInitColors(props.theme);
  const Colors = useColors();

  const flatlistRef = useMessyListRef();

  const { loading, messages = [], listProps } = props;

  if (loading) {
    return <MessyLoading {...props} />;
  }

  return (
    <MessyPropsContext.Provider value={props}>
      <View style={{ flex: 1 }}>
        <FlatList
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
