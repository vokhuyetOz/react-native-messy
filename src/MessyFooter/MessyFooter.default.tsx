/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  type RefObject,
  useCallback,
} from 'react';
import {
  Image,
  Pressable,
  TextInput,
  View,
  type LayoutChangeEvent,
  Text,
  type TextInputSelectionChangeEventData,
  type NativeSyntheticEvent,
  Keyboard,
  type TextInputProps,
} from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  useBottomSheet,
} from '@gorhom/bottom-sheet';
import emojiJson from 'unicode-emoji-json/data-by-group.json';
import {
  TabView,
  TabBar,
  type TabBarProps,
  type SceneRendererProps,
  type Route,
} from 'react-native-tab-view';
import { FlashList } from '@shopify/flash-list';
import emoji from 'emojilib';

import {
  useColors,
  useMessyListAction,
  useSizes,
  selectEmoji,
  useSelectEmoji,
  type TEmoji,
  insert,
  useMessyEmojiSheetRef,
  useMessyPropsContext,
  setBotomSheetEmojiIndex,
  useBotomSheetEmojiIndex,
} from '../modules';

import type { IMessyFooterProps, TMessyFooterSend } from '../MessyFooter';
import { CommonStyle } from '../utils/CommonStyle';
import { MessyFooterAction } from './MessyFooterAction';
import { MImage } from '../elements/MImage/MImage';
import { MLoading } from '../elements/Loading/Loading';

const emojiAllArray = Object.entries(emojiJson);
const emojiAll = emojiAllArray.map(([key, value]) => ({
  key,
  title: value[0]?.emoji,
  data: value.map((item) => ({
    ...item,
    //@ts-ignore
    keywords: emoji[item.emoji as keyof emoji] as Array<string>,
  })),
}));

type TMessyFooterEmojiSearch = Readonly<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}>;

type TMessyFooterEmoji = Readonly<{
  emojiShared: SharedValue<number>;
}>;

type TMessyFooterTextInput = Readonly<{
  textInputRef: RefObject<TextInput>;
  inputProps?: TextInputProps;
}>;
type TMessyFooterEmojiContentPage = Readonly<{
  data: TEmoji[];
}>;

function MessyFooterEmojiSearch({ query, setQuery }: TMessyFooterEmojiSearch) {
  const Sizes = useSizes();
  const Colors = useColors();
  const bottomSheet = useBottomSheet();

  const onPress = () => {
    bottomSheet.close();
  };
  return (
    <View
      renderToHardwareTextureAndroid={true}
      style={{
        paddingHorizontal: Sizes.padding,
        paddingBottom: Sizes.padding,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <BottomSheetTextInput
        style={{
          height: Sizes.wpx(40),
          borderWidth: Sizes.border,
          paddingHorizontal: Sizes.padding,
          borderRadius: Sizes.input_border_radius,
          flex: 1,
        }}
        placeholder="Emoji"
        value={query}
        onChangeText={setQuery}
      />
      <Pressable
        style={{ marginLeft: Sizes.padding }}
        hitSlop={Sizes.padding}
        onPress={onPress}
      >
        <MImage
          autoSize={false}
          style={{
            width: Sizes.message,
            height: Sizes.message,
            tintColor: Colors.input.text,
          }}
          source={require('../utils/images/x.png')}
        />
      </Pressable>
    </View>
  );
}
function MessyFooterEmojiContentPage({ data }: TMessyFooterEmojiContentPage) {
  const Sizes = useSizes();
  const bottomSheet = useBottomSheet();
  const sheetIndex = useBotomSheetEmojiIndex();
  const componentRef = useRef({
    firstOnEndReached: false,
  });
  if (sheetIndex === -1) {
    return <MLoading style={{ marginTop: Sizes.padding }} />;
  }
  const onRefresh = () => {
    Keyboard.dismiss();
    bottomSheet.snapToIndex(0);
  };
  const onEndReached = () => {
    if (!componentRef.current.firstOnEndReached) {
      componentRef.current.firstOnEndReached = true;
      return;
    }
    bottomSheet.expand();
  };

  return (
    <FlashList
      numColumns={9}
      estimatedItemSize={39}
      onEndReached={onEndReached}
      data={data}
      onRefresh={onRefresh}
      progressViewOffset={1000}
      refreshing={false}
      renderItem={({ item }) => {
        const onPress = () => {
          selectEmoji(item);
          bottomSheet.snapToIndex(0);
        };
        return (
          <Pressable key={item.name} onPress={onPress}>
            <Text
              style={{
                paddingVertical: Sizes.padding / 2,
                fontSize: Sizes.emoji,
                minWidth: Sizes.wpx(39),
                textAlign: 'center',
              }}
            >
              {item.emoji}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

function MessyFooterEmojiContent() {
  const Sizes = useSizes();
  const Colors = useColors();

  const [query, setQuery] = useState('');
  const [emojiData, setEmojiData] = useState(emojiAll);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const handleSearch = () => {
      if (!query) {
        return emojiAll;
      }
      return emojiAll.map((item) => {
        return {
          ...item,
          data: item.data.filter((e) =>
            e.keywords.some((k) =>
              k.toLowerCase().includes(query.trim().toLowerCase())
            )
          ),
        };
      });
    };

    const timeout = setTimeout(() => {
      const data = handleSearch();
      setEmojiData(data);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  const pages = emojiData.filter((item) => item.data.length);

  const renderScene = useCallback(
    ({ route }: SceneRendererProps & { route: Route }) => {
      //@ts-ignore
      const data = emojiJson[route.key];
      if (!data?.length) return null;

      return <MessyFooterEmojiContentPage data={data} />;
    },
    []
  );
  const renderTabBar = (props: TabBarProps<any>) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: Colors.primary,
          maxWidth: Sizes.device_width / 9,
        }}
        style={{ backgroundColor: Colors.background }}
        labelStyle={{
          fontSize: Sizes.message,
          width: Sizes.emoji,
        }}
        tabStyle={{ maxWidth: Sizes.device_width / 9 }}
      />
    );
  };
  return (
    <Fragment>
      <MessyFooterEmojiSearch query={query} setQuery={setQuery} />
      <TabView
        lazy
        navigationState={{ routes: pages, index }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Sizes.device_width }}
        renderTabBar={renderTabBar}
      />
    </Fragment>
  );
}

function MessyFooterEmoji({ emojiShared }: TMessyFooterEmoji) {
  const Sizes = useSizes();
  const bottomSheetRef = useMessyEmojiSheetRef();

  const onPress = () => {
    Keyboard.dismiss();
    bottomSheetRef?.current?.present();
  };
  const renderBackdrop = (props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop {...props} pressBehavior={'close'} />;
  };

  return (
    <View>
      <Pressable onPress={onPress}>
        <Image
          source={require('../utils/images/emoji.png')}
          style={{ width: Sizes.button_image, height: Sizes.button_image }}
          resizeMode={'contain'}
        />
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetRef}
        //FIXME: don't know why bottomsheet alway open after sending text, image if enableDismissOnClose={false}
        // enableDismissOnClose={false}
        snapPoints={[Sizes.wpx(300), '95%']}
        index={0}
        keyboardBehavior="extend"
        backdropComponent={renderBackdrop}
        animatedPosition={emojiShared}
        animationConfigs={{ duration: 300 }}
        backgroundStyle={CommonStyle.shadow}
        onChange={setBotomSheetEmojiIndex}
      >
        <MessyFooterEmojiContent />
      </BottomSheetModal>
    </View>
  );
}
function MessyFooterTextInput({
  textInputRef,
  inputProps,
}: TMessyFooterTextInput) {
  const Sizes = useSizes();
  const Colors = useColors();

  const { emoji: newEmoji, force } = useSelectEmoji();

  const [text, setText] = useState('');
  const componentRef = useRef({
    cursorStart: text.length - 1,
  });
  const bottomSheetRef = useMessyEmojiSheetRef();

  useEffect(() => {
    if (!newEmoji) return;
    const newText = insert({
      str: text,
      index: componentRef.current.cursorStart,
      value: newEmoji.emoji,
    });
    setText(newText);
  }, [force]);

  const onSelectionChange = (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    componentRef.current.cursorStart = e.nativeEvent.selection.start;
  };
  const onInputFocus = () => {
    bottomSheetRef.current?.close();
  };
  return (
    <TextInput
      ref={textInputRef}
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
      {...inputProps}
      value={text}
      onChangeText={setText}
      onFocus={onInputFocus}
    />
  );
}
function MessyFooterSend({ onPress }: TMessyFooterSend) {
  const Sizes = useSizes();

  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingLeft: Sizes.padding,
      }}
    >
      <Image
        source={require('../utils/images/send.png')}
        style={{ width: Sizes.button_image, height: Sizes.button_image }}
        resizeMode={'contain'}
      />
    </Pressable>
  );
}

export function MessyFooterDefault(props: IMessyFooterProps) {
  const Sizes = useSizes();
  const Colors = useColors();
  const { user } = useMessyPropsContext();

  const { scrollToLast } = useMessyListAction();

  const [borderRadius, setBorderRadius] = useState(Sizes.input_border_radius);
  const textInputRef = useRef<TextInput>(null);

  const emojiShared = useSharedValue(Sizes.device_height);
  const { height } = useReanimatedKeyboardAnimation();

  const fakeViewKeyboard = useAnimatedStyle(() => {
    const emojiHeight = Sizes.device_height - emojiShared.value;

    const maxHeight = Math.max(Math.abs(emojiHeight), Math.abs(height.value));
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

  const onPressSendText = () => {
    const text =
      //@ts-ignore
      textInputRef.current?._internalFiberInstanceHandleDEV?.memoizedProps
        ?.value;
    if (!text) return;

    textInputRef.current?.clear();

    const createdTime = Date.now();
    props.onSend?.({
      id: `${Date.now()}`,
      text,
      createdTime,
      status: 'sending',
      user,
      clientId: `${createdTime}`,
    });
    scrollToLast();
  };

  return (
    <View style={{ marginTop: Sizes.padding }}>
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
          {props.ExtraLeft}
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
              inputProps={props.inputProps}
              textInputRef={textInputRef}
            />
            <MessyFooterEmoji emojiShared={emojiShared} />
          </View>
          <MessyFooterSend onPress={onPressSendText} />
        </View>
        <MessyFooterAction />
      </View>
      {/* fakeview keyboard */}
      <Animated.View style={fakeViewKeyboard} />
    </View>
  );
}
