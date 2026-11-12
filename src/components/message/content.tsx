import React from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
//@ts-ignore no types shipped
import ParsedText from 'react-native-parsed-text';

import { useMessy } from '../../context';
import type { TMessyMessage, TMessyMessageSlotProps } from '../../types';
import { MAutoImage, MImage, MText, MVideo } from '../primitives';

function openUrl(url: string) {
  // parsed-text accepts "www.x.com", Linking needs a scheme
  Linking.openURL(/^www\./i.test(url) ? `https://${url}` : url).catch(
    () => undefined
  );
}

export function DefaultMessageText({
  message,
  isOwn,
  layout,
}: TMessyMessageSlotProps) {
  const { theme, props } = useMessy();
  const bubble = layout === 'bubble';
  const color = bubble && isOwn ? theme.colors.ownText : theme.colors.otherText;
  const link = bubble && isOwn ? theme.colors.ownLink : theme.colors.otherLink;
  const linkStyle = { color: link, textDecorationLine: 'underline' as const };
  return (
    <ParsedText
      style={{
        color: layout === 'list' ? theme.colors.text : color,
        fontSize: theme.font.message,
        lineHeight: theme.font.messageLineHeight,
        paddingHorizontal: bubble ? theme.spacing.md : 0,
        paddingVertical: bubble ? theme.spacing.sm : 0,
      }}
      parse={[
        { type: 'url', style: linkStyle, onPress: openUrl },
        {
          type: 'phone',
          style: linkStyle,
          onPress: (p: string) => openUrl(`tel:${p}`),
        },
        {
          type: 'email',
          style: linkStyle,
          onPress: (e: string) => openUrl(`mailto:${e}`),
        },
        ...(props.parsedShape ?? []),
      ]}
    >
      {message.text}
    </ParsedText>
  );
}

function SendingOverlay({ message }: { message: TMessyMessage }) {
  if (message.status !== 'sending') {
    return null;
  }
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(0,0,0,0.25)',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <ActivityIndicator color="white" />
    </View>
  );
}

export function DefaultMessageImage({ message }: TMessyMessageSlotProps) {
  const { theme, openMediaViewer } = useMessy();
  const sources: ImageSourcePropType[] = message.local
    ? [message.local as ImageSourcePropType]
    : ([] as ImageSourcePropType[]).concat(message.image ?? []);
  const open = (index: number) => () =>
    openMediaViewer(
      sources.map((source) => ({ type: 'image', source })),
      index
    );

  if (sources.length === 1) {
    return (
      <Pressable onPress={open(0)} accessibilityRole="imagebutton">
        <MAutoImage source={sources[0]!} />
        <SendingOverlay message={message} />
      </Pressable>
    );
  }

  const gap = theme.spacing.xxs;
  const cell = (theme.mediaMaxWidth - gap) / 2;
  const shown = sources.slice(0, 4);
  const extra = sources.length - shown.length;
  return (
    <View
      style={{
        width: theme.mediaMaxWidth,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap,
      }}
    >
      {shown.map((source, i) => (
        <Pressable
          key={i}
          onPress={open(i)}
          accessibilityRole="imagebutton"
          // 3 images: last one spans the full row
          style={{
            width: shown.length === 3 && i === 2 ? theme.mediaMaxWidth : cell,
            height: cell,
          }}
        >
          <MImage
            source={source}
            resizeMode="cover"
            style={{ width: '100%', height: '100%' }}
          />
          {extra > 0 && i === 3 && (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <MText
                style={{ color: 'white', fontSize: 22, fontWeight: '600' }}
              >
                +{extra}
              </MText>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}

export function DefaultMessageVideo({ message }: TMessyMessageSlotProps) {
  const { theme, openMediaViewer } = useMessy();
  const source = (message.local ?? message.video) as { uri: string };
  const size = theme.avatarSize * 1.6;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Play video"
      onPress={() => openMediaViewer([{ type: 'video', source }])}
    >
      <MVideo source={source} paused resizeMode="cover" />
      <View
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MImage
            source={require('../../utils/images/play.png')}
            style={{
              width: size / 2.4,
              height: size / 2.4,
              tintColor: 'white',
            }}
          />
        </View>
      </View>
      <SendingOverlay message={message} />
    </Pressable>
  );
}

export function DefaultMessageLocation({
  message,
  isOwn,
  layout,
}: TMessyMessageSlotProps) {
  const { theme } = useMessy();
  const loc = message.location!;
  const onPress = () =>
    openUrl(`https://maps.google.com/maps?q=${loc.latitude},${loc.longitude}`);
  const own = isOwn && layout === 'bubble';
  return (
    <Pressable onPress={onPress} accessibilityRole="link">
      <MAutoImage source={loc.image} />
      <View
        style={{
          backgroundColor: own
            ? theme.colors.ownBubble
            : theme.colors.otherBubble,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          maxWidth: theme.mediaMaxWidth,
        }}
      >
        <MText
          numberOfLines={2}
          style={{
            color: own ? theme.colors.ownText : theme.colors.otherText,
            fontSize: theme.font.message - 1,
            fontWeight: '600',
          }}
        >
          📍 {loc.name}
        </MText>
      </View>
    </Pressable>
  );
}

export function DefaultMessageCustom() {
  return null;
}
