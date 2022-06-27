/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import MessyKeyboard from './MessyKeyboard/MessyKeyboard';

import { useColors, useSizes } from './modules';

import { MessyKeyboardImage } from './MessyKeyboard/MessyKeyboardImage';
import type { IMessyMessage } from './MessyMessage';
import { MessyKeyboardAudio } from './MessyKeyboard/MessyKeyboardAudio';

export interface IMessyFooterProps {
  onScrollToBottom?: () => void;
  renderFooter: undefined | ((data: IMessyFooterProps) => React.ReactNode);
  onSend: (message?: IMessyMessage) => Promise<void> | void;
  inputProps?: TextInputProps;
  enableKeyboardImage?: boolean;
  enableKeyboardAudio?: boolean;
  showImageKeyboard?: () => void;
  showAudioKeyboard?: () => void;
  useSafeArea?: boolean;
  addBottomView?: boolean;
  usesBottomTabs?: boolean;
  revealKeyboardInteractive?: boolean;
  onPressSendText?: () => void;
}

function MessyFooterImage(props: IMessyFooterProps) {
  const Sizes = useSizes();
  const { enableKeyboardImage, showImageKeyboard } = props;
  if (!enableKeyboardImage && !MessyKeyboard) return null;

  return (
    <Pressable
      onPress={showImageKeyboard}
      style={{ paddingTop: Sizes.padding / 2 }}
    >
      <Image
        source={require('./utils/images/image.png')}
        style={{ width: Sizes.button_image, height: Sizes.button_image }}
        resizeMode={'contain'}
      />
    </Pressable>
  );
}
function MessyFooterAudio(props: IMessyFooterProps) {
  const Sizes = useSizes();
  const { enableKeyboardAudio, showAudioKeyboard } = props;
  if (!enableKeyboardAudio) return null;

  return (
    <Pressable
      onPress={showAudioKeyboard}
      style={{ paddingTop: Sizes.padding / 2, marginLeft: Sizes.padding }}
    >
      <Image
        source={require('./utils/images/microphone.png')}
        style={{ width: Sizes.button_image, height: Sizes.button_image }}
        resizeMode={'contain'}
      />
    </Pressable>
  );
}

function MessyFooterText(props: IMessyFooterProps) {
  const Sizes = useSizes();
  const { enableKeyboardImage, onPressSendText } = props;
  if (!enableKeyboardImage && !MessyKeyboard) return null;

  return (
    <Pressable
      onPress={onPressSendText}
      style={{
        paddingLeft: Sizes.padding,
      }}
    >
      <Image
        source={require('./utils/images/send.png')}
        style={{ width: Sizes.button_image, height: Sizes.button_image }}
        resizeMode={'contain'}
      />
    </Pressable>
  );
}

export function MessyFooter(props: IMessyFooterProps) {
  const {
    inputProps,
    renderFooter,
    onSend,
    useSafeArea,
    usesBottomTabs,
    addBottomView,
    revealKeyboardInteractive,
  } = props;

  const Sizes = useSizes();
  const Colors = useColors();

  const componentRef = useRef<{ keyboard: NodeJS.Timeout | undefined }>({
    keyboard: undefined,
  });
  const [text, setText] = useState('');
  const [customKeyboard, setCustomKeyboard] = useState<{
    component?: string;
    initialProps?: any;
  }>({});
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    return () => {
      if (componentRef.current.keyboard) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(componentRef.current.keyboard);
      }
    };
  }, []);

  const onKeyboardResigned = () => {
    setCustomKeyboard({});
  };
  const onPressSendText = () => {
    if (!text) return;
    // Keyboard.dismiss();
    setText('');

    onSend?.({
      id: `${Date.now()}`,
      text,
      createdTime: Date.now(),
      status: 'sending',
    });
  };

  const onKeyboardItemSelected = (componentID: string, data: any) => {
    console.log('data', componentID, data);
    if (componentID === 'messy.MessyKeyboardImage') {
      if (data.errorCode) {
        console.warn(data.errorCode, data.errorMessage);
        return;
      }
      if (!data?.assets) {
        return;
      }
      const messsage: IMessyMessage = {
        createdTime: Date.now(),
        id: `${Date.now()}`,
        image: data?.assets,
        status: 'sending',
      };
      if (data.assets.length === 1) {
        messsage.image = data.assets[0];
      }
      onSend?.(messsage);
      return;
    }
    if (componentID === 'messy.MessyKeyboardAudio') {
      if (!data?.audio) {
        return;
      }
      const messsage: IMessyMessage = {
        createdTime: Date.now(),
        id: `${Date.now()}`,
        audio: data.audio,
        status: 'sending',
      };
      onSend?.(messsage);
      return;
    }
  };
  const renderContent = () => {
    if (typeof renderFooter === 'function') {
      return renderFooter(props);
    }
    return (
      <View
        style={{
          marginHorizontal: Sizes.padding,
          backgroundColor: Colors.background,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextInput
            ref={textInputRef}
            style={{
              flex: 1,
              minHeight: Sizes.input_height,
              paddingBottom: Sizes.padding / 2,
              paddingTop: Sizes.padding * 0.6,
              color: Colors.primary,
              paddingHorizontal: Sizes.padding,
              fontSize: Sizes.message,
              borderWidth: Sizes.border,
              borderRadius: Sizes.border_radius,
              textAlignVertical: 'center',
            }}
            placeholder={inputProps?.placeholder || 'Type your message'}
            multiline={true}
            {...inputProps}
            value={text}
            onChangeText={setText}
            onFocus={onKeyboardResigned}
          />
          <MessyFooterText {...props} onPressSendText={onPressSendText} />
        </View>
        <View
          style={{
            paddingBottom: Sizes.padding,
            flexDirection: 'row',
          }}
        >
          <MessyFooterImage
            {...props}
            showImageKeyboard={() => {
              setCustomKeyboard({
                component: 'messy.MessyKeyboardImage',
                initialProps: {},
              });
            }}
          />
          <MessyFooterAudio
            {...props}
            showAudioKeyboard={() => {
              setCustomKeyboard({
                component: 'messy.MessyKeyboardAudio',
                initialProps: {},
              });
            }}
          />
        </View>
      </View>
    );
  };
  return (
    <MessyKeyboard.KeyboardAccessoryView
      scrollBehavior={
        MessyKeyboard?.KeyboardAccessoryView?.scrollBehaviors?.NONE
      }
      renderContent={renderContent}
      // trackInteractive={true}
      // onHeightChanged={(h: number) => {
      //   console.log('onHeightChanged', h);
      //   // height.value = Math.abs(height.value) + h;
      // }}
      kbInputRef={textInputRef}
      kbComponent={customKeyboard.component}
      kbInitialProps={customKeyboard.initialProps}
      onItemSelected={onKeyboardItemSelected}
      onKeyboardResigned={onKeyboardResigned}
      revealKeyboardInteractive={revealKeyboardInteractive}
      useSafeArea={useSafeArea}
      addBottomView={addBottomView}
      usesBottomTabs={usesBottomTabs}
    />
  );
}
MessyKeyboard?.KeyboardRegistry?.registerKeyboard?.(
  'messy.MessyKeyboardImage',
  () => MessyKeyboardImage
);
MessyKeyboard?.KeyboardRegistry?.registerKeyboard?.(
  'messy.MessyKeyboardAudio',
  () => MessyKeyboardAudio
);
