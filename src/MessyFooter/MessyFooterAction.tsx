/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Pressable,
  type ImageStyle,
  type ImageSourcePropType,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';

import { MImage } from '../elements/MImage/MImage';
import { useSizes, useMessyPropsContext, useMessyListAction } from '../modules';

type TMessyFooterActionItem = Readonly<{
  onPress: () => Promise<void> | void;
  style: ImageStyle;
  source: ImageSourcePropType;
}>;

function MessyFooterActionItem({
  onPress,
  style,
  source,
}: TMessyFooterActionItem) {
  const Sizes = useSizes();

  return (
    <Pressable onPress={onPress}>
      <MImage
        source={source}
        autoSize={false}
        style={[
          {
            width: Sizes.action_width,
            height: Sizes.action_width,
          },
          style,
        ]}
      />
    </Pressable>
  );
}

export function MessyFooterAction() {
  const Sizes = useSizes();
  const { footerProps, user } = useMessyPropsContext();
  const { scrollToLast } = useMessyListAction();
  const handleOnSendFile = (result: ImagePickerResponse) => {
    if (result.didCancel) {
      return;
    }
    if (result.errorCode) {
      return;
    }
    const asset = result.assets?.[0];
    const createdTime = Date.now();
    footerProps?.onSend?.({
      user,
      type: 'message',
      createdTime,
      status: 'sending',
      local: asset,
      clientId: `${createdTime}`,
    });
    scrollToLast();
  };
  const list: TMessyFooterActionItem[] = [
    {
      onPress: async () => {
        const result = await launchImageLibrary({
          includeBase64: false,
          includeExtra: false,
          selectionLimit: 1,
          mediaType: 'mixed',
          assetRepresentationMode: 'current',
          quality: 0.8,
          videoQuality: 'medium',
          maxWidth: 960,
          maxHeight: 1280,
        });

        handleOnSendFile(result);
      },
      style: { marginRight: Sizes.padding },
      source: require('../utils/images/image.png'),
    },
    {
      onPress: async () => {
        const result = await launchCamera({
          mediaType: 'photo',
          includeBase64: false,
          includeExtra: false,
          assetRepresentationMode: 'current',
          quality: 0.8,
        });
        handleOnSendFile(result);
      },
      style: {},
      source: require('../utils/images/camera.png'),
    },
  ];
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingLeft: Sizes.padding,
        paddingTop: Sizes.padding / 2,
      }}
    >
      {footerProps?.ExtraActionLeft}
      {list.map((item, index) => {
        return <MessyFooterActionItem key={`${index}`} {...item} />;
      })}
    </View>
  );
}
