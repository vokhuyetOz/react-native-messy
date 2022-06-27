/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, ImageSourcePropType, ScrollView, View } from 'react-native';

// @ts-ignore
import Lightbox from 'react-native-lightbox-v2';

import { useSizes } from '../modules';

import type { IMessyMessageProps } from '../Messy';

export function MessyMessageContentImage(props: IMessyMessageProps) {
  const { renderMessageImage, data, imageLightboxProps } = props;

  const Sizes = useSizes();

  if (!data?.image) {
    return null;
  }

  if (typeof renderMessageImage === 'function') {
    return renderMessageImage(data);
  }
  if (Array.isArray(data.image)) {
    let marginTop = Sizes.padding;
    if (data.text || data.audio) {
      marginTop = 0;
    }

    return (
      <ScrollView
        horizontal
        style={{ marginBottom: Sizes.padding, marginTop }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {data.image.map((item: ImageSourcePropType, index: number) => {
          let marginLeft = 0;
          if (index === 0) {
            marginLeft = Sizes.padding;
          }
          return (
            <View
              style={{ marginLeft, marginRight: Sizes.padding }}
              key={`${item}-${index}`}
            >
              {/* @ts-ignore */}
              <Lightbox
                activeProps={{
                  style: {
                    flex: 1,
                    resizeMode: 'contain',
                  },
                }}
                {...imageLightboxProps}
              >
                <Image
                  source={item}
                  style={{
                    width: Sizes.image_max_width / 2,
                    height: Sizes.image_max_width / 2,
                    borderRadius: Sizes.border_radius,
                    resizeMode: 'cover',
                  }}
                />
              </Lightbox>
            </View>
          );
        })}
      </ScrollView>
    );
  }

  return (
    // @ts-ignore
    <Lightbox
      activeProps={{
        style: {
          flex: 1,
          resizeMode: 'contain',
        },
      }}
      style={{ alignSelf: 'center' }}
      {...imageLightboxProps}
    >
      <Image
        source={data.image}
        style={{
          width: Sizes.image_max_width,
          height: Sizes.image_max_height,
          borderRadius: Sizes.border_radius,
          resizeMode: 'cover',
        }}
      />
    </Lightbox>
  );
}
