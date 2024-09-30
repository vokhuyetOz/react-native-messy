/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from 'react';
import { View, Pressable } from 'react-native';

import { VideoRef } from 'react-native-video';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useBackHandler } from '@vokhuyet/native-hooks';

import type { TMessyMessageProps } from '../types';

import { MImage } from '../elements/MImage/MImage';
import { isImage, useColors, useMessyPropsContext, useSizes } from '../modules';

import { MLoading } from '../elements/Loading/Loading';
import { MVideo } from '../elements/MVideo/MVideo';

function ModalClose() {
  const Sizes = useSizes();
  const { dismiss } = useBottomSheetModal();
  const onClose = () => {
    dismiss();
  };
  return (
    <Pressable
      hitSlop={Sizes.padding}
      onPress={onClose}
      style={{
        position: 'absolute',
        left: Sizes.padding,
        top: Sizes.padding * 2,
        paddingTop: Sizes.padding * 2,
      }}
    >
      <MImage
        autoSize={false}
        source={require('../utils/images/x.png')}
        style={{ width: Sizes.emoji, height: Sizes.emoji, tintColor: 'white' }}
      />
    </Pressable>
  );
}

function MessyMessageContentVideoDefault({ value }: TMessyMessageProps) {
  const Sizes = useSizes();
  const Colors = useColors();

  const componentRef = useRef({
    sheetOpen: false,
  });

  const videoRef = useRef<VideoRef>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useBackHandler(() => {
    if (componentRef.current.sheetOpen) {
      bottomSheetRef.current?.dismiss();
      return true;
    }
    return false;
  });

  const onPress = () => {
    bottomSheetRef.current?.present();
    componentRef.current.sheetOpen = true;
  };

  const onDismiss = () => {
    componentRef.current.sheetOpen = false;
  };

  const renderLoading = () => {
    if (value.status !== 'sending') {
      return null;
    }
    return (
      <MLoading
        style={{
          position: 'absolute',
          alignSelf: 'center',
        }}
      />
    );
  };
  const VideoContent = (
    <MVideo
      displayProgress={false}
      videoRef={videoRef}
      controls={false}
      fullscreen={false}
      source={value.local || value.video}
      paused={true}
      playInBackground={false}
      playWhenInactive={false}
      resizeMode="contain"
    />
  );

  return (
    <View>
      <Pressable
        onPress={onPress}
        style={{
          borderRadius: Sizes.border_radius,
          overflow: 'hidden',
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        {VideoContent}
        <MImage
          source={require('../utils/images/play.png')}
          autoSize={false}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            width: Sizes.button_image,
            height: Sizes.button_image,
            tintColor: Colors.placeholder,
          }}
        />
        {renderLoading()}
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetRef}
        onDismiss={onDismiss}
        snapPoints={['100%']}
        backgroundStyle={{ backgroundColor: 'black' }}
        enableDynamicSizing={false}
        style={{
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        handleComponent={null}
      >
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          {React.cloneElement(VideoContent, {
            style: {
              ...VideoContent.props.style,
              width: Sizes.device_width,
              height: Sizes.device_height * 0.9,
            },
            paused: false,
            controls: false,
            fullscreen: false,
            displayProgress: true,
          })}
        </View>

        <ModalClose />
      </BottomSheetModal>
    </View>
  );
}

export function MessyMessageContentVideo(props: TMessyMessageProps) {
  const { value } = props;
  const messyProps = useMessyPropsContext();

  if (!value?.video && !value.local) {
    return null;
  }
  if (value.local && isImage(value.local?.uri)) {
    return null;
  }

  if (typeof messyProps.renderMessageVideo === 'function') {
    return messyProps.renderMessageVideo({ ...props, ...messyProps });
  }
  return <MessyMessageContentVideoDefault {...props} />;
}
