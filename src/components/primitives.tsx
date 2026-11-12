import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  type ImageProps,
  type ImageURISource,
  type TextProps,
} from 'react-native';
import Video, {
  type OnLoadData,
  type ReactVideoProps,
} from 'react-native-video';

import { useMessy, useMessyComponents } from '../context';

type TSize = { width: number; height: number };

/** Text that goes through the `Text` slot. */
export function MText(props: TextProps) {
  const C = useMessyComponents();
  return <C.Text {...props} />;
}

/** Plain image through the `Image` slot. */
export function MImage(props: ImageProps) {
  const C = useMessyComponents();
  if (!props.source) {
    return null;
  }
  return <C.Image {...props} />;
}

function fit(width: number, height: number, max: TSize): TSize {
  const ratio = width / height;
  return ratio > max.width / max.height
    ? { width: max.width, height: max.width / ratio }
    : { width: max.height * ratio, height: max.height };
}

/** Image sized to its aspect ratio within theme media bounds, cached by uri. */
export function MAutoImage(props: ImageProps) {
  const { theme, props: messy, components: C } = useMessy();
  const uri = (props.source as ImageURISource)?.uri;
  const max = { width: theme.mediaMaxWidth, height: theme.mediaMaxHeight };
  const [failed, setFailed] = useState(false);
  const [size, setSize] = useState<TSize>(
    // 4:3 until loaded
    () =>
      (uri && messy.cache?.get(uri)) || {
        width: max.width,
        height: (max.width * 3) / 4,
      }
  );

  // size from the image's own load event: a separate Image.getSize request for
  // a uri already loading elsewhere (e.g. as an avatar) can stall on iOS
  const onLoad = (e: any) => {
    props.onLoad?.(e);
    // RN Image: nativeEvent.source; FastImage-like slots: nativeEvent itself
    const src = e?.nativeEvent?.source ?? e?.nativeEvent;
    if (!src?.width || !src?.height) {
      return;
    }
    const next = fit(src.width, src.height, max);
    if (uri) {
      messy.cache?.set(uri, next);
    }
    if (next.width !== size.width || next.height !== size.height) {
      setSize(next);
    }
  };

  if (failed) {
    // keep the slot's footprint and show a neutral placeholder, not a blank hole
    return (
      <View
        accessibilityLabel="Image unavailable"
        style={[
          size,
          {
            backgroundColor: theme.colors.surface,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
          },
          props.style,
        ]}
      >
        <C.Image
          source={require('../utils/images/image.png')}
          style={{
            width: 28,
            height: 28,
            tintColor: theme.colors.textSecondary,
          }}
        />
      </View>
    );
  }

  return (
    <C.Image
      {...props}
      onLoad={onLoad}
      onError={(e) => {
        props.onError?.(e);
        setFailed(true);
      }}
      resizeMode="cover"
      style={[size, props.style]}
    />
  );
}

/** Video sized like MAutoImage, through the `Video` slot. */
export function MVideo(props: ReactVideoProps) {
  const { theme, props: messy, components: C } = useMessy();
  const uri = (props.source as { uri?: string })?.uri;
  const max = { width: theme.mediaMaxWidth, height: theme.mediaMaxHeight };
  const [size, setSize] = useState<TSize>(
    // 16:9 until loaded: most videos are landscape, and a failed load stays compact
    () =>
      (uri && messy.cache?.get(uri)) || {
        width: max.width,
        height: (max.width * 9) / 16,
      }
  );

  const onLoad = (data: OnLoadData) => {
    props.onLoad?.(data);
    let { width, height } = data.naturalSize;
    if (data.naturalSize.orientation === 'portrait' && width > height) {
      [width, height] = [height, width];
    }
    if (!width || !height) {
      return;
    }
    const next = fit(width, height, max);
    if (uri) {
      messy.cache?.set(uri, next);
    }
    setSize(next);
  };

  return (
    <View style={{ backgroundColor: theme.colors.media }}>
      <C.Video {...props} style={[size, props.style]} onLoad={onLoad} />
    </View>
  );
}

export function DefaultLoading() {
  const theme = useMessy().theme;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={theme.colors.textSecondary} />
    </View>
  );
}

export const DefaultText = Text;
export const DefaultImage = Image;
export const DefaultVideo = Video;
