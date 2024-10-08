import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  useCallback,
  isValidElement,
} from 'react';
import { Image, Pressable, View, Keyboard } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  useBottomSheet,
  useBottomSheetModal,
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

import {
  useColors,
  useSizes,
  selectEmoji,
  type TEmoji,
  useMessyEmojiSheetRef,
  useMessyPropsContext,
  setBottomSheetEmojiIndex,
  useBotomSheetEmojiIndex,
} from '../modules';

import { CommonStyle } from '../utils/CommonStyle';
import { MImage } from '../elements/MImage/MImage';
import { MLoading } from '../elements/Loading/Loading';
import { MText } from '../elements/MText/MText';

const emojiAll = emojiJson.map(({ slug, emojis }) => {
  return {
    key: slug,
    title: emojis[0].emoji,
    data: emojis,
  };
});

type TMessyFooterEmojiSearch = Readonly<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}>;

type TMessyFooterEmoji = Readonly<{
  emojiShared: SharedValue<number>;
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
            <MText
              style={{
                paddingVertical: Sizes.padding / 2,
                fontSize: Sizes.emoji,
                minWidth: Sizes.wpx(39),
                textAlign: 'center',
              }}
            >
              {item.emoji}
            </MText>
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
            e.name?.toLowerCase().includes(query.trim().toLowerCase())
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

  const renderScene = useCallback(
    ({ route }: SceneRendererProps & { route: Route & { data: TEmoji[] } }) => {
      if (!route?.data?.length) {
        return null;
      }

      return <MessyFooterEmojiContentPage data={route.data} />;
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

  const pages = emojiData.filter((item) => item.data.length);

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

export function MessyFooterEmoji({ emojiShared }: TMessyFooterEmoji) {
  const { footerProps } = useMessyPropsContext();
  const Sizes = useSizes();
  const { dismissAll } = useBottomSheetModal();

  const bottomSheetRef = useMessyEmojiSheetRef();

  const componentRef = useRef<{
    timeout?: NodeJS.Timeout;
    modalePresentTimeout?: NodeJS.Timeout;
  }>({
    timeout: undefined,
    modalePresentTimeout: undefined,
  });

  const clear = () => {
    if (componentRef.current.timeout) {
      clearTimeout(componentRef.current.timeout);
    }
  };
  useEffect(() => {
    return clear;
  }, []);

  const onPress = () => {
    Keyboard.dismiss();
    dismissAll();
    clear();
    clearTimeout(componentRef.current.modalePresentTimeout);
    componentRef.current.modalePresentTimeout = setTimeout(() => {
      bottomSheetRef?.current?.present();
    }, 200);
  };

  const renderBackdrop = (props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop {...props} pressBehavior={'close'} />;
  };
  const renderEmoji = () => {
    if (isValidElement(footerProps?.Emoji)) {
      return footerProps.Emoji;
    }
    return (
      <Image
        source={require('../utils/images/emoji.png')}
        style={{ width: Sizes.button_image, height: Sizes.button_image }}
        resizeMode={'contain'}
      />
    );
  };

  return (
    <View>
      <Pressable disabled={footerProps?.disabled} onPress={onPress}>
        {renderEmoji()}
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetRef}
        //FIXME: don't know why bottomsheet alway open after sending text or image if enableDismissOnClose={false}
        // enableDismissOnClose={false}
        enableDynamicSizing={false}
        snapPoints={[Sizes.wpx(300), '95%']}
        index={0}
        keyboardBehavior="extend"
        backdropComponent={renderBackdrop}
        animatedPosition={emojiShared}
        animationConfigs={{ duration: 300 }}
        backgroundStyle={CommonStyle.shadow}
        onChange={setBottomSheetEmojiIndex}
      >
        <MessyFooterEmojiContent />
      </BottomSheetModal>
    </View>
  );
}
