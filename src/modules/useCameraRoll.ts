import { useEffect, useState } from 'react';
import type {
  GetPhotosParamType,
  GetPhotosReturnType,
  CameraRoll as CameraRollType,
} from 'react-native';

let MessyCameraRoll: CameraRollType;

try {
  const CameraRoll = require('@react-native-community/cameraroll');
  if (CameraRoll) {
    MessyCameraRoll = CameraRoll;
  }
} catch (error) {
  console.warn(
    'please install @react-native-community/cameraroll to use image keyboard'
  );
}

const initialState: GetPhotosReturnType = {
  edges: [],
  page_info: {
    end_cursor: '',
    has_next_page: false,
    start_cursor: '',
  },
};

const defaultConfig: GetPhotosParamType = {
  first: 20,
  groupTypes: 'All',
};

export function useCameraRoll() {
  const [photos, setPhotos] = useState(initialState);

  useEffect(() => {
    getPhotos();
  }, []);

  async function getPhotos(config = defaultConfig) {
    try {
      const result = await MessyCameraRoll.getPhotos(config);
      setPhotos(result);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async function saveToCameraRoll(tag: string, type?: 'photo' | 'video') {
    try {
      await MessyCameraRoll.saveToCameraRoll(tag, type);
    } catch (err) {
      console.log('error saving to camera roll: ', err);
    }
  }

  return { photos, getPhotos, saveToCameraRoll };
}
