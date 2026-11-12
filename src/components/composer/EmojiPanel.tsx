import React, { useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import groups from 'unicode-emoji-json/data-by-group.json';

import { useMessy } from '../../context';
import { MText } from '../primitives';
import { useMessyComposerActions } from './ComposerContext';

const COLUMNS = 8;

/** Emoji grid shown in the keyboard area; tapping inserts at the cursor. */
export function DefaultEmojiPanel() {
  const { theme } = useMessy();
  const { insertText } = useMessyComposerActions();
  const { width } = useWindowDimensions();
  const [groupIndex, setGroupIndex] = useState(0);
  const cell = width / COLUMNS;
  const group = groups[groupIndex]!;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        borderTopWidth: 0.5,
        borderTopColor: theme.colors.border,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.xs }}
      >
        {groups.map((g, i) => (
          <Pressable
            key={g.slug}
            accessibilityRole="tab"
            accessibilityLabel={g.name}
            accessibilityState={{ selected: i === groupIndex }}
            onPress={() => setGroupIndex(i)}
            style={{
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.sm,
              borderBottomWidth: 2,
              borderBottomColor:
                i === groupIndex ? theme.colors.primary : 'transparent',
              opacity: i === groupIndex ? 1 : 0.5,
            }}
          >
            <MText style={{ fontSize: 20 }}>{g.emojis[0]?.emoji}</MText>
          </Pressable>
        ))}
      </ScrollView>
      <MText
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.font.caption,
          fontWeight: '600',
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs,
        }}
      >
        {group.name}
      </MText>
      <FlashList
        key={group.slug}
        data={group.emojis}
        numColumns={COLUMNS}
        estimatedItemSize={cell}
        keyExtractor={(e) => e.slug}
        keyboardShouldPersistTaps="always"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => insertText(item.emoji)}
            accessibilityLabel={item.name}
            style={({ pressed }) => ({
              height: cell,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: cell / 2,
              backgroundColor: pressed ? theme.colors.surface : 'transparent',
            })}
          >
            <MText style={{ fontSize: theme.font.emoji }}>{item.emoji}</MText>
          </Pressable>
        )}
      />
    </View>
  );
}
