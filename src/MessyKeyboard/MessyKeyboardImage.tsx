/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  ImageURISource,
  Text,
} from 'react-native';

import { useSizes, useCameraRoll, messyTakePhoto } from '../modules';
import MessyKeyboard from './MessyKeyboard';

function MessyKeyboardImageCamera() {
  const Sizes = useSizes();
  const onPressTakePhoto = async () => {
    const result = await messyTakePhoto();
    if (result.errorCode) {
      console.warn(result);
    }
    MessyKeyboard?.KeyboardRegistry?.onItemSelected?.(
      'messy.MessyKeyboardImage',
      {
        data: result,
      }
    );
  };
  return (
    <Pressable
      onPress={onPressTakePhoto}
      style={{
        height: Sizes.image_width_keyboard,
        width: Sizes.image_width_keyboard,
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
      }}
    >
      <Image
        source={require('../utils/images/camera.png')}
        style={{
          height: Sizes.image_width_keyboard / 3,
          width: Sizes.image_width_keyboard / 3,
        }}
      />
    </Pressable>
  );
}

function MessyKeyboardImageItem({
  data,
  onSelectImage,
  selectedImages = [],
}: {
  data: any;
  onSelectImage: (image: ImageURISource, index?: number | undefined) => void;
  selectedImages?: ImageURISource[];
}) {
  const { image } = data.node;

  const Sizes = useSizes();

  const index = selectedImages.findIndex(
    (item: ImageURISource) => item.uri === image.uri
  );
  const onPress = () => {
    onSelectImage?.(image, index);
  };
  const renderSelectedView = () => {
    if (index === -1) {
      return null;
    }
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.2)',
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: Sizes.image_width_keyboard / 3,
            height: Sizes.image_width_keyboard / 3,
            borderRadius: Sizes.image_width_keyboard / 6,
            borderWidth: Sizes.border,
            borderColor: 'white',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: Sizes.message,
            }}
          >
            {index + 1}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <Pressable onPress={onPress}>
      <Image
        source={image}
        style={{
          height: Sizes.image_width_keyboard,
          width: Sizes.image_width_keyboard,
          borderWidth: StyleSheet.hairlineWidth,
        }}
      />

      {renderSelectedView()}
    </Pressable>
  );
}

function MessyKeyboardImageSend({
  selectedImages = [],
  setSelectedImages,
}: {
  selectedImages?: ImageURISource[];
  setSelectedImages: any;
}) {
  const Sizes = useSizes();

  const onPress = () => {
    MessyKeyboard?.KeyboardRegistry?.onItemSelected?.(
      'messy.MessyKeyboardImage',
      {
        assets: selectedImages,
      }
    );
    setSelectedImages([]);
  };

  if (selectedImages.length === 0) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        right: Sizes.padding,
        bottom: Sizes.padding,
        width: Sizes.image_width_keyboard / 3,
        height: Sizes.image_width_keyboard / 3,
        // backgroundColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Sizes.image_width_keyboard / 4,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
      }}
    >
      <Image
        style={{
          width: Sizes.image_width_keyboard / 5,
          height: Sizes.image_width_keyboard / 5,
        }}
        source={require('../utils/images/send.png')}
      />
    </Pressable>
  );
}

export function MessyKeyboardImage() {
  const { photos, getPhotos } = useCameraRoll();

  const [selectedImages, setSelectedImages] = useState<ImageURISource[]>([]);

  const onEndReached = () => {
    if (!photos.page_info.has_next_page) {
      return;
    }
    getPhotos({
      groupTypes: 'All',
      first: photos.edges.length + 20,
    });
  };
  /**
   *
   * @param image
   * @param index index of image in selectedImages
   */
  const onSelectImage = (image: ImageURISource, index: number | undefined) => {
    if (index === undefined || index === -1) {
      selectedImages.push(image);
    } else {
      selectedImages.splice(index, 1);
    }
    setSelectedImages([...selectedImages]);
  };

  return (
    <View>
      <FlatList
        keyExtractor={(item) => `${item.node.image.uri}`}
        numColumns={3}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={[{ node: { image: { uri: undefined } } }, ...photos.edges]}
        renderItem={({ item }) => {
          if (item.node.image.uri) {
            return (
              <MessyKeyboardImageItem
                selectedImages={selectedImages}
                data={item}
                onSelectImage={onSelectImage}
              />
            );
          }
          return <MessyKeyboardImageCamera />;
        }}
        onEndReachedThreshold={0.7}
        onEndReached={onEndReached}
      />
      <MessyKeyboardImageSend
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
      />
    </View>
  );
}
