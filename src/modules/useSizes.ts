import { useWindowDimensions } from 'react-native';

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
  button_image: number;
  image_width_keyboard: number;
  device_width: number;
};

export function useSizes(): Size {
  const { width, height } = useWindowDimensions();

  return {
    image_max_width: width * 0.6,
    image_max_height: height * 0.3,
    text_max_width: width * 0.7,
    padding: width * 0.04,
    border_radius: width * 0.0225,
    avatar: width * 0.1,
    input_height: 48,
    border: 1,
    date_time: width * 0.035,
    message: width * 0.05,
    button_image: 30,
    image_width_keyboard: width / 3,
    device_width: width,
  };
}
