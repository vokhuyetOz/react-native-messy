import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Zoom from 'react-native-zoom-reanimated';

import { useMessy } from '../context';
import type {
  TMessyMediaItem,
  TMessyMediaViewerProps,
  TMessyReactionPickerProps,
} from '../types';
import { MImage, MText } from './primitives';

/** Full-screen swipeable viewer for images and videos. */
export function DefaultMediaViewer({
  items,
  initialIndex,
  onClose,
}: TMessyMediaViewerProps) {
  const { components: C } = useMessy();
  const { width, height } = useWindowDimensions();
  const [page, setPage] = useState(initialIndex);

  const renderItem = ({
    item,
    index,
  }: {
    item: TMessyMediaItem;
    index: number;
  }) => (
    <View style={{ width, height, justifyContent: 'center' }}>
      {item.type === 'image' ? (
        <Zoom>
          <MImage
            source={item.source as ImageSourcePropType}
            resizeMode="contain"
            style={{ width, height }}
          />
        </Zoom>
      ) : (
        <C.Video
          source={item.source as { uri: string }}
          controls
          paused={index !== page}
          resizeMode="contain"
          style={{ width, height: height * 0.85 }}
        />
      )}
    </View>
  );

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
    >
      {/* gestures inside an RN Modal need their own root on Android */}
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
        <FlatList
          data={items}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          keyExtractor={(_, index) => `${index}`}
          onMomentumScrollEnd={(e) =>
            setPage(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={renderItem}
        />
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={{
            position: 'absolute',
            top: 52,
            left: 16,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.15)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MImage
            source={require('../utils/images/x.png')}
            style={{ width: 16, height: 16, tintColor: 'white' }}
          />
        </Pressable>
        {items.length > 1 && (
          <MText
            style={{
              position: 'absolute',
              bottom: 40,
              alignSelf: 'center',
              color: 'white',
              fontSize: 14,
            }}
          >
            {page + 1} / {items.length}
          </MText>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}

/** Emoji pill shown above (or below) a long-pressed message. */
export function DefaultReactionPicker({
  message,
  anchor,
  isOwn,
  data,
  onSelect,
  onClose,
}: TMessyReactionPickerProps) {
  const { theme, props } = useMessy();
  const { width: screenWidth } = useWindowDimensions();
  const item = theme.font.emoji + theme.spacing.md;
  const pad = theme.spacing.xs;
  const width = data.length * item + pad * 2;
  const height = item + pad * 2;
  const gap = theme.spacing.sm;
  const margin = theme.spacing.md;

  const above = anchor.y - height - gap;
  const top = above > 60 ? above : anchor.y + anchor.height + gap;
  const preferred = isOwn ? anchor.x + anchor.width - width : anchor.x;
  const left = Math.max(
    margin,
    Math.min(preferred, screenWidth - width - margin)
  );
  const userId = props.user?.id;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: theme.colors.overlay }}
        onPress={onClose}
        accessibilityLabel="Close reactions"
      >
        <View
          style={{
            position: 'absolute',
            top,
            left,
            width,
            height,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: pad,
            borderRadius: height / 2,
            backgroundColor: theme.colors.popup,
            shadowColor: '#000',
            shadowOpacity: 0.18,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          }}
        >
          {data.map((reaction) => {
            const reacted = message.reactions?.some(
              (r) => r.reaction.key === reaction.key && r.user?.id === userId
            );
            return (
              <Pressable
                key={reaction.key}
                onPress={() => onSelect(reaction)}
                accessibilityRole="button"
                accessibilityLabel={`React ${reaction.value}`}
                accessibilityState={{ selected: !!reacted }}
                style={({ pressed }) => ({
                  width: item,
                  height: item,
                  borderRadius: item / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: reacted
                    ? theme.colors.reactionChipActive
                    : 'transparent',
                  transform: [{ scale: pressed ? 1.3 : 1 }],
                })}
              >
                <MText style={{ fontSize: theme.font.emoji }}>
                  {reaction.value}
                </MText>
              </Pressable>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

export function DefaultScrollToBottomButton({
  onPress,
}: {
  onPress: () => void;
}) {
  const { theme } = useMessy();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Scroll to latest"
      style={{
        position: 'absolute',
        right: theme.spacing.lg,
        bottom: theme.spacing.md,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.popup,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      }}
    >
      <MText style={{ color: theme.colors.text, fontSize: 18, marginTop: -2 }}>
        ↓
      </MText>
    </Pressable>
  );
}
