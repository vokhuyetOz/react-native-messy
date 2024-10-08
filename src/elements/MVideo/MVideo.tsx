import React, { RefObject, useState } from 'react';
import { View } from 'react-native';
import Video, {
  OnLoadData,
  OnProgressData,
  ReactVideoProps,
  VideoRef,
} from 'react-native-video';
import { useColors, useMessyPropsContext, useSizes } from '../../modules';

type TMVideo = Readonly<
  ReactVideoProps & {
    videoRef?: RefObject<VideoRef> | null;
    displayProgress: boolean;
  }
>;

export function MVideo({ displayProgress, ...props }: TMVideo) {
  const Sizes = useSizes();
  const Colors = useColors();
  const { BaseModule } = useMessyPropsContext();
  const [progress, setProgress] = useState<OnProgressData>({
    playableDuration: 1,
    seekableDuration: 1,
    currentTime: 0,
  });
  const [videoSize, setVideoSize] = useState(() => {
    if (BaseModule?.Cache && typeof props.source?.uri === 'string') {
      const size = BaseModule.Cache.get<{ width: number; height: number }>(
        props.source.uri
      );

      if (size) {
        return {
          width: size.width,
          height: size.height,
        };
      }
    }
    return {
      width: Sizes.image_max_width,
      height: Sizes.image_max_height,
    };
  });
  const onLoad = ({ naturalSize }: OnLoadData) => {
    const maxWidth = Sizes.image_max_width;
    const maxHeight = Sizes.image_max_height;

    let width = naturalSize.width;
    let height = naturalSize.height;
    if (naturalSize.orientation === 'portrait') {
      height = naturalSize.width;
      width = naturalSize.height;
    }

    const aspectRatio = width / height;

    const maxRatio = maxWidth / maxHeight;
    if (aspectRatio > maxRatio) {
      width = maxWidth;
      height = maxWidth / aspectRatio;
    } else {
      height = maxHeight;
      width = maxHeight * aspectRatio;
    }
    if (BaseModule?.Cache && typeof props.source?.uri === 'string') {
      BaseModule.Cache.set(props.source?.uri, { width, height });
    }
    setVideoSize({ width, height });
  };

  const width =
    (Sizes.device_width * progress.currentTime) / progress.seekableDuration;
  return (
    <View style={{ backgroundColor: Colors.shadow }}>
      <Video
        style={videoSize}
        {...props}
        ref={props.videoRef}
        onProgress={setProgress}
        onLoad={onLoad}
      />
      {displayProgress && (
        <View
          style={{
            width: width,
            height: 2,
            backgroundColor: 'white',
          }}
        />
      )}
    </View>
  );
}
