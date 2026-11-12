import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';

import { useMessy } from '../../context';
import { displayName, previewText } from '../../core/helpers';
import type {
  TMessyReplyPreviewProps,
  TMessySendButtonProps,
} from '../../types';
import { MImage, MText } from '../primitives';
import {
  PANEL_ANIMATION_MS,
  useMessyComposer,
  type TMessyComposerPanel,
} from './ComposerContext';

// remembered across mounts so panels open at the real keyboard height
let lastKeyboardHeight = 0;
const MIN_PANEL_HEIGHT = 200;

export function ComposerIconButton({
  source,
  onPress,
  tintColor,
  disabled,
  accessibilityLabel,
}: Readonly<{
  source: ImageSourcePropType;
  onPress: () => void;
  tintColor?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
}>) {
  const { theme } = useMessy();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        width: theme.composerMinHeight - 4,
        height: theme.composerMinHeight,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.4 : pressed ? 0.6 : 1,
      })}
    >
      <MImage
        source={source}
        resizeMode="contain"
        style={{
          width: 22,
          height: 22,
          tintColor: tintColor ?? theme.colors.textSecondary,
        }}
      />
    </Pressable>
  );
}

export function DefaultSendButton({
  disabled,
  onPress,
}: TMessySendButtonProps) {
  const { theme } = useMessy();
  const size = theme.composerMinHeight - 8;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Send"
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        width: size,
        height: size,
        margin: 4,
        borderRadius: size / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
        transform: [{ scale: pressed ? 0.92 : 1 }],
      })}
    >
      {/* paper-plane glyph (as in the Mobbin reference); a font glyph tints with the theme */}
      <MText
        allowFontScaling={false}
        style={{
          fontSize: size * 0.48,
          lineHeight: size * 0.56,
          marginLeft: size * 0.06,
          color: disabled ? theme.colors.textSecondary : theme.colors.onPrimary,
        }}
      >
        {'\u27A4'}
      </MText>
    </Pressable>
  );
}

export function DefaultReplyPreview({
  message,
  onClose,
}: TMessyReplyPreviewProps) {
  const { theme, texts, props } = useMessy();
  const small = {
    fontSize: theme.font.name,
    color: theme.colors.textSecondary,
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.colors.border,
      }}
    >
      <View
        style={{
          width: 3,
          alignSelf: 'stretch',
          borderRadius: 2,
          backgroundColor: theme.colors.primary,
        }}
      />
      <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
        <MText numberOfLines={1} style={small}>
          {texts.replyingTo}{' '}
          <MText style={{ fontWeight: '600', color: theme.colors.text }}>
            {displayName(message.user, props.user, texts)}
          </MText>
        </MText>
        <MText numberOfLines={1} style={small}>
          {previewText(message, texts)}
        </MText>
      </View>
      <Pressable
        onPress={onClose}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Cancel reply"
        style={({ pressed }) => ({
          paddingHorizontal: theme.spacing.md,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <MText style={{ fontSize: 16, color: theme.colors.textSecondary }}>
          {'\u2715'}
        </MText>
      </Pressable>
    </View>
  );
}

/** Space under the composer: follows the keyboard, or hosts the open panel. */
function KeyboardArea({
  panel,
  bottomInset,
}: Readonly<{ panel: TMessyComposerPanel | null; bottomInset: number }>) {
  const { height: screenHeight } = useWindowDimensions();
  const [panelHeight, setPanelHeight] = useState(
    () => lastKeyboardHeight || Math.round(screenHeight * 0.35)
  );
  const { height: keyboard } = useReanimatedKeyboardAnimation();
  const panelShared = useSharedValue(0);

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', (e) => {
      // hardware keyboards / floating toolbars report tiny heights: keep the fallback
      if (e.endCoordinates.height < MIN_PANEL_HEIGHT) {
        return;
      }
      lastKeyboardHeight = e.endCoordinates.height;
      setPanelHeight(lastKeyboardHeight);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    panelShared.value = withTiming(panel ? panelHeight : 0, {
      duration: PANEL_ANIMATION_MS,
    });
  }, [panel, panelHeight, panelShared]);

  const style = useAnimatedStyle(() => ({
    // keyboard height already includes the home-indicator inset, so the inset is a floor, not an addition
    height: Math.max(bottomInset, Math.abs(keyboard.value), panelShared.value),
  }));

  return (
    <Animated.View style={[{ overflow: 'hidden' }, style]}>
      {panel && <View style={{ height: panelHeight }}>{panel.node}</View>}
    </Animated.View>
  );
}

export function DefaultComposer() {
  const { theme, texts, components: C, props } = useMessy();
  const composer = useMessyComposer();
  const { text, panel, replyTo } = composer;
  const options = props.composerProps ?? {};
  const { inputProps } = options;
  const disabled = !!options.disabled;
  const emojiOpen = panel?.key === 'emoji';
  const padV = Platform.OS === 'ios' ? 10 : 6;

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {replyTo && (
        <C.ReplyPreview
          message={replyTo}
          onClose={() => composer.setReplyTo(null)}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.sm,
          gap: theme.spacing.xs,
        }}
      >
        {!options.hideActions && <C.ComposerActions />}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            minHeight: theme.composerMinHeight,
            borderRadius: theme.radius.input,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            paddingLeft: theme.spacing.md,
          }}
        >
          <TextInput
            placeholder={texts.placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            {...inputProps}
            ref={composer.inputRef}
            value={text}
            editable={!disabled && inputProps?.editable !== false}
            // user handlers run alongside ours, never instead
            onChangeText={(value) => {
              composer.setText(value);
              inputProps?.onChangeText?.(value);
            }}
            onSelectionChange={(e) => {
              composer.setSelection(e.nativeEvent.selection.start);
              inputProps?.onSelectionChange?.(e);
            }}
            onFocus={(e) => {
              composer.closePanel();
              inputProps?.onFocus?.(e);
            }}
            style={[
              {
                flex: 1,
                maxHeight: 120,
                color: theme.colors.text,
                fontSize: theme.font.message,
                paddingTop: padV,
                paddingBottom: padV,
                paddingRight: theme.spacing.xs,
                textAlignVertical: 'center',
              },
              inputProps?.style,
            ]}
          />
          {!options.hideEmoji && (
            <ComposerIconButton
              accessibilityLabel={emojiOpen ? 'Keyboard' : 'Emoji'}
              source={require('../../utils/images/emoji.png')}
              tintColor={emojiOpen ? theme.colors.primary : undefined}
              disabled={disabled}
              onPress={() => composer.togglePanel('emoji', <C.EmojiPanel />)}
            />
          )}
          <C.SendButton
            disabled={disabled || !text.trim()}
            onPress={() => composer.send()}
          />
        </View>
      </View>
      <KeyboardArea panel={panel} bottomInset={options.bottomInset ?? 0} />
    </View>
  );
}
