import React from 'react';
import { Image, ImageURISource, type ImageProps } from 'react-native';
import { useImageDimensions } from '@vokhuyet/native-hooks';

import { useMessyPropsContext, useSizes } from '../../modules';

type TMImage = Readonly<
  ImageProps & {
    autoSize: boolean;
  }
>;

function MImageAuto(props: TMImage) {
  const Sizes = useSizes();
  const { BaseModule } = useMessyPropsContext();

  const { dimensions } = useImageDimensions(props.source as any);
  let width = Sizes.image_max_width;
  let height = Sizes.image_max_height;
  if ((props?.source as ImageURISource)?.uri && BaseModule?.Cache) {
    const size = BaseModule.Cache.get<{ width: number; height: number }>(
      (props?.source as ImageURISource)?.uri as string
    );
    if (size) {
      width = size.width;
      height = size.height;
    }
  }

  if (dimensions?.aspectRatio) {
    const maxRatio = Sizes.image_max_width / Sizes.image_max_height;
    if (dimensions.aspectRatio > maxRatio) {
      height = Sizes.image_max_width / dimensions.aspectRatio;
    } else {
      width = Sizes.image_max_height * dimensions.aspectRatio;
    }
    if (
      BaseModule?.Cache &&
      typeof (props.source as ImageURISource)?.uri === 'string'
    ) {
      BaseModule.Cache.set((props.source as ImageURISource)?.uri as string, {
        width,
        height,
      });
    }
  }
  if (BaseModule?.Image) {
    return (
      <BaseModule.Image
        {...props}
        style={[{ width, height }, props.style]}
        resizeMode="contain"
      />
    );
  }
  return (
    <Image
      {...props}
      style={[{ width, height }, props.style]}
      resizeMode="contain"
    />
  );
}
export function MImage(props: TMImage) {
  const { BaseModule } = useMessyPropsContext();
  if (!props.source) {
    return null;
  }

  if (props.autoSize) {
    return <MImageAuto {...props} />;
  }
  if (BaseModule?.Image) {
    return <BaseModule.Image {...props} />;
  }
  return <Image {...props} />;
}
