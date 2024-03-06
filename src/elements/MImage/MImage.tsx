import React from 'react';
import { Image, type ImageProps } from 'react-native';
import { useImageDimensions } from '@vokhuyet/native-hooks';

import { useSizes } from '../../modules';

type TMImage = Readonly<
  ImageProps & {
    autoSize: boolean;
  }
>;

function MImageAuto(props: TMImage) {
  const Sizes = useSizes();

  const { dimensions } = useImageDimensions(props.source as any);
  let width = Sizes.image_max_width;
  let height = Sizes.image_max_height;

  if (dimensions?.aspectRatio) {
    const maxRatio = Sizes.image_max_width / Sizes.image_max_height;
    if (dimensions.aspectRatio > maxRatio) {
      height = Sizes.image_max_width / dimensions.aspectRatio;
    } else {
      width = Sizes.image_max_height * dimensions.aspectRatio;
    }
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
  if (props.autoSize) {
    return <MImageAuto {...props} />;
  }
  return <Image {...props} />;
}
