let MessyImagePicker: any;

try {
  //@ts-ignore
  const ImagePicker = require('react-native-image-picker');
  MessyImagePicker = ImagePicker;
} catch {
  console.warn(
    'react-native-image-picker not found. Please install it to use this feature.'
  );
}
export async function messyTakePhoto() {
  return await MessyImagePicker?.launchCamera?.();
}
