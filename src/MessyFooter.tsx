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

export interface IMessyFooterProps {
  onScrollToBottom?: () => void;
  renderFooter: undefined | ((data: IMessyFooterProps) => React.ReactNode);
  onSend: (message?: IMessyMessage) => Promise<void> | void;
  inputProps?: TextInputProps;
  enableKeyboardImage?: boolean;
  showImageKeyboard?: () => void;
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
    <Pressable onPress={showImageKeyboard}>
      <Image
        source={require('./utils/images/image.png')}
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
    <Pressable onPress={onPressSendText} style={{ padding: Sizes.padding }}>
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
    console.log('data', data);
    if (componentID === 'messy.MessyKeyboardImage') {
      if (!data) {
        return;
      }
      if (data.errorCode) {
        console.warn(data.errorCode, data.errorMessage);
        return;
      }
      if (data.assets) {
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
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.background,
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
            marginHorizontal: Sizes.padding,
            textAlignVertical: 'center',
          }}
          placeholder={inputProps?.placeholder || 'Type your message'}
          multiline={true}
          {...inputProps}
          value={text}
          onChangeText={setText}
          onFocus={onKeyboardResigned}
        />
        <MessyFooterImage
          {...props}
          showImageKeyboard={() => {
            setCustomKeyboard({
              component: 'messy.MessyKeyboardImage',
              initialProps: { title: 'Keyboard 1 opened by button' },
            });
          }}
        />
        <MessyFooterText {...props} onPressSendText={onPressSendText} />
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
