import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { MessyContext, type TMessyContext } from './context';
import { buildItems } from './core/grouping';
import {
  DEFAULT_REACTIONS,
  DEFAULT_TEXTS,
  isImageMessage,
  isVideoMessage,
} from './core/helpers';
import { mergeTheme } from './theme';
import type {
  TMessyAnchor,
  TMessyComponents,
  TMessyItem,
  TMessyMediaItem,
  TMessyProps,
  TMessyRef,
} from './types';

import { DefaultMessage } from './components/message/Message';
import {
  DefaultAvatar,
  DefaultBubble,
  DefaultDaySeparator,
  DefaultMessageReply,
  DefaultMessageStatus,
  DefaultReactions,
  DefaultSenderName,
  DefaultSystemMessage,
  DefaultThreadSummary,
} from './components/message/parts';
import {
  DefaultMessageCustom,
  DefaultMessageImage,
  DefaultMessageLocation,
  DefaultMessageText,
  DefaultMessageVideo,
} from './components/message/content';
import {
  ComposerProvider,
  type TMessyComposerActions,
} from './components/composer/ComposerContext';
import {
  DefaultComposer,
  DefaultReplyPreview,
  DefaultSendButton,
} from './components/composer/Composer';
import { DefaultComposerActions } from './components/composer/Attachments';
import { DefaultEmojiPanel } from './components/composer/EmojiPanel';
import {
  DefaultMediaViewer,
  DefaultReactionPicker,
  DefaultScrollToBottomButton,
} from './components/overlays';
import {
  DefaultImage,
  DefaultLoading,
  DefaultText,
  DefaultVideo,
} from './components/primitives';

export const defaultComponents: TMessyComponents = {
  Message: DefaultMessage,
  Bubble: DefaultBubble,
  Avatar: DefaultAvatar,
  SenderName: DefaultSenderName,
  DaySeparator: DefaultDaySeparator,
  SystemMessage: DefaultSystemMessage,
  MessageText: DefaultMessageText,
  MessageImage: DefaultMessageImage,
  MessageVideo: DefaultMessageVideo,
  MessageLocation: DefaultMessageLocation,
  MessageCustom: DefaultMessageCustom,
  MessageStatus: DefaultMessageStatus,
  ThreadSummary: DefaultThreadSummary,
  Reactions: DefaultReactions,
  MessageReply: DefaultMessageReply,
  ReplyPreview: DefaultReplyPreview,
  ReactionPicker: DefaultReactionPicker,
  MediaViewer: DefaultMediaViewer,
  Composer: DefaultComposer,
  ComposerActions: DefaultComposerActions,
  SendButton: DefaultSendButton,
  EmojiPanel: DefaultEmojiPanel,
  ScrollToBottomButton: DefaultScrollToBottomButton,
  Loading: DefaultLoading,
  Text: DefaultText,
  Image: DefaultImage,
  Video: DefaultVideo,
};

const SCROLL_BUTTON_OFFSET = 400;

function getItemType({ message }: TMessyItem) {
  if (message.type === 'system') {
    return 'system';
  }
  return isImageMessage(message) || isVideoMessage(message) || message.location
    ? 'media'
    : 'text';
}

export const Messy = forwardRef<TMessyRef, TMessyProps>(function Messy(
  props,
  ref
) {
  const { messages, user, layout = 'bubble', groupInterval, listProps } = props;
  const listRef = useRef<FlashList<TMessyItem>>(null);
  const composerRef = useRef<TMessyComposerActions | null>(null);
  const [viewer, setViewer] = useState<{
    items: TMessyMediaItem[];
    index: number;
  } | null>(null);
  const [picker, setPicker] = useState<{
    item: TMessyItem;
    anchor: TMessyAnchor;
  } | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const theme = useMemo(() => mergeTheme(props.theme), [props.theme]);
  const components = useMemo(
    () => ({ ...defaultComponents, ...props.components }),
    [props.components]
  );
  const texts = useMemo(
    () => ({ ...DEFAULT_TEXTS, ...props.texts }),
    [props.texts]
  );
  const items = useMemo(
    () => buildItems(messages ?? [], user?.id, groupInterval),
    [messages, user?.id, groupInterval]
  );

  const scrollToEnd = useCallback((animated = true) => {
    // wait a frame so a just-sent message is laid out
    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated });
    }, 50);
  }, []);
  const openMediaViewer = useCallback(
    (mediaItems: TMessyMediaItem[], index = 0) =>
      setViewer({ items: mediaItems, index }),
    []
  );
  const openReactionPicker = useCallback(
    (item: TMessyItem, anchor: TMessyAnchor) => setPicker({ item, anchor }),
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      scrollToEnd,
      setText: (text) => {
        composerRef.current?.setText(text);
        composerRef.current?.setSelection(text.length);
      },
      focus: () => composerRef.current?.focus(),
    }),
    [scrollToEnd]
  );

  const context = useMemo<TMessyContext>(
    () => ({
      props,
      theme,
      components,
      texts,
      layout,
      openMediaViewer,
      openReactionPicker,
      scrollToEnd,
    }),
    [
      props,
      theme,
      components,
      texts,
      layout,
      openMediaViewer,
      openReactionPicker,
      scrollToEnd,
    ]
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    listProps?.onScroll?.(e);
    // inverted: offset 0 is the newest message
    const away = e.nativeEvent.contentOffset.y > SCROLL_BUTTON_OFFSET;
    if (away !== showScrollButton) {
      setShowScrollButton(away);
    }
  };

  const C = components;
  const reactionConfig = props.reactions;

  return (
    <MessyContext.Provider value={context}>
      <ComposerProvider actionsRef={composerRef}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          {props.loading ? (
            <C.Loading />
          ) : (
            <View style={{ flex: 1 }}>
              <FlashList
                ref={listRef}
                estimatedItemSize={64}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                getItemType={getItemType}
                keyExtractor={(item) =>
                  `${item.message.clientId ?? item.message.id ?? item.index}`
                }
                {...listProps}
                data={items}
                extraData={context}
                inverted
                onScroll={onScroll}
                onScrollBeginDrag={(e) => {
                  composerRef.current?.closePanel();
                  listProps?.onScrollBeginDrag?.(e);
                }}
                scrollEventThrottle={64}
                renderItem={({ item }) => (
                  <C.Message {...item} layout={layout} />
                )}
              />
              {showScrollButton && (
                <C.ScrollToBottomButton onPress={() => scrollToEnd()} />
              )}
            </View>
          )}
          <C.Composer />
        </View>
        {viewer && (
          <C.MediaViewer
            items={viewer.items}
            initialIndex={viewer.index}
            onClose={() => setViewer(null)}
          />
        )}
        {picker && reactionConfig && (
          <C.ReactionPicker
            message={picker.item.message}
            isOwn={picker.item.isOwn}
            anchor={picker.anchor}
            data={reactionConfig.data ?? DEFAULT_REACTIONS}
            onClose={() => setPicker(null)}
            onSelect={(reaction) => {
              setPicker(null);
              reactionConfig.onPress?.({
                message: picker.item.message,
                reaction,
              });
            }}
          />
        )}
      </ComposerProvider>
    </MessyContext.Provider>
  );
});
