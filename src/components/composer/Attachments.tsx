import React from 'react';
import { View, type ImageSourcePropType } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';

import { useMessy } from '../../context';
import { ComposerIconButton } from './Composer';
import { useMessyComposerActions } from './ComposerContext';

export type TMessyAttachmentButtonProps = Readonly<{
  /** replaces the built-in picker */
  onPress?: () => void | Promise<void>;
  /** runs before the built-in picker; return false to abort */
  handlePermission?: () => Promise<boolean>;
  source?: ImageSourcePropType;
  tintColor?: string;
}>;

function useSendPicked() {
  const { send } = useMessyComposerActions();
  return (result: ImagePickerResponse) => {
    if (result.didCancel || result.errorCode) {
      return;
    }
    result.assets?.forEach((local) => send({ local }));
  };
}

function AttachmentButton({
  onPress,
  handlePermission,
  pick,
  label,
  ...rest
}: TMessyAttachmentButtonProps & {
  pick: () => Promise<void>;
  label: string;
  source: ImageSourcePropType;
}) {
  const { props } = useMessy();
  const press = async () => {
    if (onPress) {
      return onPress();
    }
    if (handlePermission && !(await handlePermission())) {
      return;
    }
    return pick();
  };
  return (
    <ComposerIconButton
      {...rest}
      accessibilityLabel={label}
      disabled={props.composerProps?.disabled}
      onPress={press}
    />
  );
}

export function DefaultLibraryButton({
  source = require('../../utils/images/image.png'),
  ...props
}: TMessyAttachmentButtonProps) {
  const sendPicked = useSendPicked();
  const pick = async () =>
    sendPicked(
      await launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 1,
        assetRepresentationMode: 'current',
        quality: 0.8,
        videoQuality: 'medium',
        maxWidth: 1280,
        maxHeight: 1280,
      })
    );
  return (
    <AttachmentButton
      {...props}
      source={source}
      pick={pick}
      label="Photo library"
    />
  );
}

export function DefaultCameraButton({
  source = require('../../utils/images/camera.png'),
  ...props
}: TMessyAttachmentButtonProps) {
  const sendPicked = useSendPicked();
  const pick = async () =>
    sendPicked(
      await launchCamera({
        mediaType: 'photo',
        assetRepresentationMode: 'current',
        quality: 0.8,
      })
    );
  return (
    <AttachmentButton {...props} source={source} pick={pick} label="Camera" />
  );
}

/** Buttons left of the input. Replace via `components.ComposerActions`. */
export function DefaultComposerActions() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <DefaultLibraryButton />
      <DefaultCameraButton />
    </View>
  );
}
