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
import { TMessyFooterActionItemDefault } from '../types';

type TMessyFooterActionItem = Readonly<{
  onPress: () => Promise<void> | void;
  style: ImageStyle;
  source: ImageSourcePropType;
}>;

const useHandleFile = () => {
  const { scrollToLast } = useMessyListAction();
  const { footerProps, user } = useMessyPropsContext();
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
  const handleCamera = async () => {
    //check permission
    const result = await launchCamera({
      mediaType: 'photo',
      includeBase64: false,
      includeExtra: false,
      assetRepresentationMode: 'current',
      quality: 0.8,
    });
    handleOnSendFile(result);
  };
  const handleLibrary = async () => {
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
  };
  return { handleCamera, handleLibrary };
};

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

export function MessyFooterActionCameraDefault({
  onPress,
  handlePermission,
  style,
  source = require('../utils/images/camera.png'),
}: TMessyFooterActionItemDefault) {
  const { handleCamera } = useHandleFile();
  const onPressDefault = async () => {
    // use your own onPress handler
    if (onPress) {
      return onPress();
    }

    let validate = true;
    if (typeof handlePermission === 'function') {
      validate = await handlePermission();
    }
    if (!validate) return;
    return handleCamera();
  };

  return (
    <MessyFooterActionItem
      onPress={onPressDefault}
      source={source}
      style={style}
    />
  );
}
export function MessyFooterActionLibraryDefault({
  handlePermission,
  style,
  source = require('../utils/images/image.png'),
  onPress,
}: TMessyFooterActionItemDefault) {
  const Sizes = useSizes();
  const { handleLibrary } = useHandleFile();

  const onPressDefault = async () => {
    //use your own onPress handler
    if (onPress) {
      return onPress();
    }
    let validate = true;
    if (typeof handlePermission === 'function') {
      validate = await handlePermission();
    }
    if (!validate) return;
    return handleLibrary();
  };

  return (
    <MessyFooterActionItem
      onPress={onPressDefault}
      source={source}
      style={{ marginRight: Sizes.padding, ...style }}
    />
  );
}

export function MessyFooterAction() {
  const Sizes = useSizes();
  const { footerProps } = useMessyPropsContext();
  if (typeof footerProps?.renderFooterAction === 'function') {
    return footerProps.renderFooterAction(footerProps);
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingLeft: Sizes.padding,
        paddingTop: Sizes.padding / 2,
      }}
    >
      {footerProps?.ExtraActionLeft}
      <MessyFooterActionLibraryDefault />
      <MessyFooterActionCameraDefault />
    </View>
  );
}
