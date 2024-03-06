import { StyleSheet, PixelRatio, useWindowDimensions } from 'react-native';

type Size = {
  image_max_width: number;
  image_max_height: number;
  text_max_width: number;
  padding: number;
  border_radius: number;
  avatar: number;
  input_height: number;
  border: number;
  date_time: number;
  message: number;
  message_line_height: number;
  button_image: number;
  device_width: number;
  device_height: number;
  system: number;
  input_border_radius: number;
  input_message: number;
  input_message_line_heigh: number;
  emoji: number;
  action_width: number;
  wpx: (px: number) => number;
};

export function useSizes(): Size {
  const { width, height } = useWindowDimensions();
  const wpx = (px: number) =>
    PixelRatio.roundToNearestPixel((px / 375) * width);

  return {
    wpx,
    device_height: height,
    emoji: wpx(20),
    message_line_height: wpx(21),
    message: wpx(14),
    image_max_width: wpx(260),
    image_max_height: height * 0.3,
    text_max_width: wpx(260),
    padding: wpx(12),
    border_radius: wpx(18),
    avatar: width * 0.1,
    input_height: wpx(48),
    border: StyleSheet.hairlineWidth,
    date_time: wpx(8),
    button_image: wpx(24),
    device_width: width,
    system: wpx(10),
    input_border_radius: wpx(100),
    input_message: wpx(16),
    input_message_line_heigh: wpx(16),
    action_width: wpx(20),
  };
}
