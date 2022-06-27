// import AudioRecorderPlayer, {
//   PlayBackType,
// } from 'react-native-audio-recorder-player';

let audioRecorderPlayer: any;
let AudioRecorderPlayer: any;

try {
  //@ts-ignore
  AudioRecorderPlayer = require('react-native-audio-recorder-player').default;
} catch {
  console.warn(
    'react-native-audio-recorder-player not found. Please install it to use this feature.'
  );
}

type Callback = (args: { status: AudioStatus; data?: any }) => void;
type Path = string | undefined;
export enum AudioStatus {
  PLAYING = 'PLAYING',
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
  RESUMED = 'RESUMED',
  STOPPED = 'STOPPED',
}

let currentPath: Path;
let currentCallback: Callback = () => {};
let currentPosition = 0;

export const startPlayer = async (path?: string, callback: Callback) => {
  if (!audioRecorderPlayer && AudioRecorderPlayer) {
    audioRecorderPlayer = new AudioRecorderPlayer();
  }
  if (currentPath === undefined) {
    currentPath = path;
    currentCallback = callback;
  } else if (currentPath !== path) {
    if (audioRecorderPlayer !== undefined) {
      await stopPlayer();
    }
    currentPath = path;
    currentCallback = callback;
  }

  const shouldBeResumed = currentPath === path && currentPosition > 0;

  if (shouldBeResumed) {
    await audioRecorderPlayer.resumePlayer();
    currentCallback({
      status: AudioStatus.RESUMED,
    });
    return;
  }
  if (!audioRecorderPlayer && AudioRecorderPlayer) {
    audioRecorderPlayer = new AudioRecorderPlayer();
  }
  await audioRecorderPlayer.startPlayer(currentPath);
  currentCallback({
    status: AudioStatus.STARTED,
  });
  audioRecorderPlayer.addPlayBackListener(async (e: any) => {
    if (e.currentPosition === e.duration) {
      await stopPlayer();
    } else {
      currentPosition = e.currentPosition;
      currentCallback({
        status: AudioStatus.PLAYING,
        data: e,
      });
    }
    return;
  });
};

export const pausePlayer = async () => {
  await audioRecorderPlayer?.pausePlayer();
  currentCallback({ status: AudioStatus.PAUSED });
};

export const stopPlayer = async () => {
  if (!audioRecorderPlayer && AudioRecorderPlayer) {
    audioRecorderPlayer = new AudioRecorderPlayer();
  }

  await audioRecorderPlayer?.stopPlayer();
  audioRecorderPlayer?.removePlayBackListener();
  currentPosition = 0;
  currentCallback({ status: AudioStatus.STOPPED });
  audioRecorderPlayer = undefined;
  currentPath = undefined;
  currentCallback = () => {};
};
