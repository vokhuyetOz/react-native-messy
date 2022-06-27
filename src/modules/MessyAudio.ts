import { useEffect, useState } from 'react';

let audioRecorderPlayer: any;

try {
  //@ts-ignore
  const AudioRecorderPlayer =
    require('react-native-audio-recorder-player').default;
  console.log('RecorderPlayer', AudioRecorderPlayer);
  audioRecorderPlayer = new AudioRecorderPlayer();
} catch {
  console.warn(
    'react-native-audio-recorder-player not found. Please install it to use this feature.'
  );
}

type PlayListenType = {
  currentPosition: number;
  duration: number;
};

type AudioPlayerType = {
  startPlayer?: (uri?: string | URL) => Promise<void>;
  stopPlayer?: () => Promise<string>;
  playListen: PlayListenType;
  pausePlayer?: () => Promise<string>;
};

export function useAudioPlayer(): AudioPlayerType {
  const [playListen, setPlayListen] = useState<PlayListenType>({
    currentPosition: 0,
    duration: 1,
  });

  if (!playListen.duration) playListen.duration = 1;

  useEffect(() => {
    audioRecorderPlayer?.addPlayBackListener?.(setPlayListen);
    return () => {
      audioRecorderPlayer?.stopPlayer?.();
      audioRecorderPlayer?.removeRecordBackListener?.();
    };
  }, []);

  return {
    playListen,
    startPlayer: audioRecorderPlayer?.startPlayer,
    stopPlayer: audioRecorderPlayer?.stopPlayer,
    pausePlayer: audioRecorderPlayer?.pausePlayer,
  };
}

type AudioRecorderType = {
  startRecorder?: (path?: string) => Promise<void>;
  stopRecorder?: () => Promise<string>;
  recordListen: Object;
};

export function useAudioRecorder(): AudioRecorderType {
  const [recordListen, setRecordListen] = useState({});

  useEffect(() => {
    audioRecorderPlayer?.addRecordBackListener?.(setRecordListen);
    return () => {
      audioRecorderPlayer?.removeRecordBackListener?.();
    };
  }, []);

  return {
    startRecorder: audioRecorderPlayer?.startRecorder,
    stopRecorder: audioRecorderPlayer?.stopRecorder,
    recordListen,
  };
}
