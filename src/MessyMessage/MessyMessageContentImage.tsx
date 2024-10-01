/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import {
  type ImageSourcePropType,
  View,
  type ImageStyle,
  type ViewStyle,
  Pressable,
  Text,
} from 'react-native';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import Zoom from 'react-native-zoom-reanimated';
import PagerView, {
  type PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';

import type { TMessyMessageProps } from '../types';

import { isImage, useMessyPropsContext, useSizes } from '../modules';

import { MImage } from '../elements/MImage/MImage';
import { MLoading } from '../elements/Loading/Loading';
import { useBackHandler } from '@vokhuyet/native-hooks';

type TImageContentListItem = Readonly<{
  data: ImageSourcePropType;
  onPresent: () => void;
  imageStyle: ImageStyle;
}>;
type TModalPageIndex = Readonly<{
  page: number;
  all: number;
}>;
type TMessyMessageContentImageList = Readonly<{
  data: ImageSourcePropType[];
  style: ViewStyle;
}>;
function ImageContentListItem({
  data,
  onPresent,
  imageStyle,
}: TImageContentListItem) {
  const Sizes = useSizes();
  return (
    <Pressable
      onPress={onPresent}
      style={{
        borderColor: 'white',
        borderWidth: Sizes.border,
        overflow: 'hidden',
      }}
    >
      <MImage
        autoSize={false}
        source={data}
        resizeMode="cover"
        style={imageStyle}
      />
    </Pressable>
  );
}
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
        top: Sizes.padding * 3,
        paddingTop: Sizes.padding * 1.5,
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
function ModalPageIndex({ page, all }: TModalPageIndex) {
  const Sizes = useSizes();

  return (
    <View
      style={{
        alignSelf: 'center',
        position: 'absolute',
        bottom: Sizes.padding,
      }}
    >
      <Text style={{ color: 'white', fontSize: Sizes.message }}>
        {page + 1}/{all}
      </Text>
    </View>
  );
}
function MessyMessageContentImageList({
  data,
  style,
}: TMessyMessageContentImageList) {
  const Sizes = useSizes();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [page, setPage] = useState(0);

  const onPresent = (index: number) => () => {
    bottomSheetRef.current?.present();
    setPage(index);
  };

  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setPage(e.nativeEvent.position);
  };

  let imageWidth = Sizes.image_max_width / 3 - Sizes.border * 2;
  if (data.length === 2) {
    imageWidth = Sizes.text_max_width / 2 - Sizes.border * 2;
  }
  const ImageContentList = data.map(
    (item: ImageSourcePropType, index: number) => {
      return (
        <ImageContentListItem
          key={`${index}`}
          onPresent={onPresent(index)}
          data={item}
          imageStyle={{
            width: imageWidth,
            height: imageWidth,
          }}
        />
      );
    }
  );
  return (
    <View
      style={[
        style,
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          overflow: 'hidden',
        },
      ]}
    >
      {ImageContentList}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['100%']}
        backgroundStyle={{ backgroundColor: 'black' }}
        style={{ backgroundColor: 'black' }}
        handleComponent={null}
        enableDynamicSizing={false}
      >
        <PagerView
          initialPage={page}
          style={{ flex: 1 }}
          onPageSelected={onPageSelected}
        >
          {React.Children.map(ImageContentList, (child, childIndex) => {
            return (
              <Zoom key={`$${childIndex}`}>
                {React.cloneElement(child, {
                  imageStyle: {
                    ...child.props.style,
                    width: Sizes.device_width,
                    height: Sizes.device_height,
                    resizeMode: 'contain',
                  },
                })}
              </Zoom>
            );
          })}
        </PagerView>
        <ModalClose />
        <ModalPageIndex page={page} all={data.length} />
      </BottomSheetModal>
    </View>
  );
}
function MessyMessageContentImageDefault({ value }: TMessyMessageProps) {
  const Sizes = useSizes();
  const componentRef = useRef({
    sheetOpen: false,
  });
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  useBackHandler(() => {
    if (componentRef.current.sheetOpen) {
      bottomSheetRef.current?.dismiss();
      return true;
    }
    return false;
  });

  const onPresent = () => {
    bottomSheetRef.current?.present();
  };

  let border: ImageStyle = {
    borderRadius: Sizes.border_radius,
  };
  if (value.text) {
    border = {
      borderBottomLeftRadius: Sizes.border_radius,
      borderBottomRightRadius: Sizes.border_radius,
    };
  }

  if (Array.isArray(value.image)) {
    return <MessyMessageContentImageList data={value.image} style={border} />;
  }
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

  const ImageContent = (
    <MImage autoSize source={value.local || value.image} style={border} />
  );

  return (
    <View style={{ alignContent: 'center', justifyContent: 'center' }}>
      <Pressable onPress={onPresent}>{ImageContent}</Pressable>
      {renderLoading()}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['100%']}
        backgroundStyle={{ backgroundColor: 'black' }}
        style={{ backgroundColor: 'black' }}
        handleComponent={null}
      >
        <Zoom>
          {React.cloneElement(ImageContent, {
            style: {
              ...ImageContent.props.style,
              width: Sizes.device_width,
              height: Sizes.device_height,
            },
          })}
        </Zoom>
        <ModalClose />
      </BottomSheetModal>
    </View>
  );
}
export function MessyMessageContentImage(props: TMessyMessageProps) {
  const { value } = props;
  const messyProps = useMessyPropsContext();

  if (!value?.image && !value.local) {
    return null;
  }
  if (value.local && !isImage(value.local?.uri)) {
    return null;
  }
  if (typeof messyProps.renderMessageImage === 'function') {
    return messyProps.renderMessageImage({ ...props, ...messyProps });
  }
  return <MessyMessageContentImageDefault {...props} />;
}
