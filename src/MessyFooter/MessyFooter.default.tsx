import React, {
  useEffect,
  useRef,
  useState,
  type RefObject,
  cloneElement,
  isValidElement,
} from 'react';
import {
  Image,
  Pressable,
  TextInput,
  View,
  type LayoutChangeEvent,
  type TextInputSelectionChangeEventData,
  type NativeSyntheticEvent,
  type TextInputProps,
} from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import type { TMessyFooterSend } from '../types';

import {
  useColors,
  useMessyListAction,
  useSizes,
  selectEmoji,
  useSelectEmoji,
  insert,
  useMessyPropsContext,
} from '../modules';

import { MessyFooterAction } from './MessyFooterAction';
import { MessyFooterEmoji } from './MessyFooterEmoji.default';

type TMessyFooterTextInput = Readonly<{
  textInputRef: RefObject<TextInput>;
  inputProps?: TextInputProps;
  onChangeText: (text: string) => void;
  clearTextInput?: () => void;
}>;

export let setMessyFooterInputText: React.Dispatch<
  React.SetStateAction<string>
>;

function MessyFooterTextInput({
  textInputRef,
  onChangeText,
}: TMessyFooterTextInput) {
  const Sizes = useSizes();
  const Colors = useColors();
  const { footerProps } = useMessyPropsContext();
  const { dismissAll } = useBottomSheetModal();

  const { emoji: newEmoji, force } = useSelectEmoji();

  const [text, setText] = useState('');
  const componentRef = useRef({
    cursorStart: text.length - 1,
  });

  //create global setting text function
  useEffect(() => {
    setMessyFooterInputText = setText;
  }, []);

  useEffect(() => {
    if (!newEmoji) {
      return;
    }
    const newText = insert({
      str: text,
      index: componentRef.current.cursorStart,
      value: newEmoji.emoji,
    });
    setText(newText);
  }, [force]);
  //update text to parent
  useEffect(() => {
    onChangeText?.(text);
  }, [text]);

  const onSelectionChange = (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    componentRef.current.cursorStart = e.nativeEvent.selection.start;
  };
  const onInputFocus = () => {
    dismissAll();
  };
  return (
    <TextInput
      ref={textInputRef}
      editable={!footerProps?.disabled}
      onSelectionChange={onSelectionChange}
      style={{
        flex: 1,
        color: Colors.input.text,
        paddingTop: Sizes.input_message_line_heigh,
        paddingBottom: Sizes.padding / 2,
        minHeight: Sizes.input_height,
        fontSize: Sizes.input_message,
        textAlignVertical: 'center',
        paddingRight: Sizes.padding / 2,
      }}
      placeholder={'Input your message'}
      multiline={true}
      {...footerProps?.inputProps}
      value={text}
      onChangeText={setText}
      onFocus={onInputFocus}
    />
  );
}
function MessyFooterSend({ onPress }: TMessyFooterSend) {
  const Sizes = useSizes();
  const { footerProps } = useMessyPropsContext();
  const renderSend = () => {
    if (isValidElement(footerProps?.Send)) {
      return footerProps.Send;
    }
    return (
      <Image
        source={require('../utils/images/send.png')}
        style={{ width: Sizes.button_image, height: Sizes.button_image }}
        resizeMode={'contain'}
      />
    );
  };
  return (
    <Pressable
      disabled={footerProps?.disabled}
      onPress={onPress}
      style={{
        paddingLeft: Sizes.padding,
      }}
    >
      {renderSend()}
    </Pressable>
  );
}

export function MessyFooterDefault() {
  const Sizes = useSizes();
  const Colors = useColors();
  const { user, footerProps: props } = useMessyPropsContext();

  const { scrollToLast } = useMessyListAction();

  const [borderRadius, setBorderRadius] = useState(Sizes.input_border_radius);
  const textInputRef = useRef<TextInput>(null);
  const componentRef = useRef({
    text: '',
  });
  // const [inputKey, setInputKey] = useState(Date.now());
  const emojiShared = useSharedValue(Sizes.device_height);
  const leftExtraShared = useSharedValue(Sizes.device_height);
  const { height } = useReanimatedKeyboardAnimation();

  const fakeViewKeyboard = useAnimatedStyle(() => {
    const emojiHeight = Sizes.device_height - emojiShared.value;
    const leftExtraHeight = Sizes.device_height - leftExtraShared.value;

    const maxHeight = Math.max(
      Math.abs(emojiHeight),
      Math.abs(height.value),
      Math.abs(leftExtraHeight)
    );
    return {
      height: maxHeight,
    };
  }, [Sizes.device_height]);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    if (
      Math.floor(nativeEvent.layout.height) ===
      Math.floor(Sizes.input_height + Sizes.border * 2)
    ) {
      setBorderRadius(Sizes.input_border_radius);
      return;
    }
    setBorderRadius(Sizes.border_radius / 2);
  };
  const onChangeText = (text: string) => {
    componentRef.current.text = text;
  };
  const onPressSendText = () => {
    const text = componentRef.current.text;
    if (!text?.trim()) {
      return;
    }
    selectEmoji();
    textInputRef.current?.clear();
    componentRef.current.text = '';
    const createdTime = Date.now();
    // setInputKey(createdTime);
    props?.onSend?.({
      id: `${Date.now()}`,
      text,
      createdTime,
      status: 'sending',
      user,
      clientId: `${createdTime}`,
    });
    scrollToLast();
  };

  let ExtraLeftWithProps = props?.ExtraLeft;
  if (props?.ExtraLeft) {
    ExtraLeftWithProps = cloneElement(props.ExtraLeft as React.ReactElement, {
      animatedPosition: leftExtraShared,
    });
  }

  return (
    <View
      style={{ marginTop: Sizes.padding, backgroundColor: Colors.background }}
    >
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: Sizes.padding,
            backgroundColor: Colors.background,
            maxHeight: Sizes.input_height * 5,
          }}
        >
          {ExtraLeftWithProps}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: Sizes.padding,
              borderWidth: Sizes.border,
              borderColor: Colors.placeholder,
              borderRadius,
            }}
            onLayout={onLayout}
          >
            <MessyFooterTextInput
              // key={inputKey}
              textInputRef={textInputRef}
              onChangeText={onChangeText}
            />
            {!props?.hideEmoji && (
              <MessyFooterEmoji emojiShared={emojiShared} />
            )}
          </View>
          <MessyFooterSend onPress={onPressSendText} />
        </View>
        {!props?.hideFooterAction && <MessyFooterAction />}
      </View>
      {/* fakeview keyboard */}
      <Animated.View style={fakeViewKeyboard} />
    </View>
  );
}
