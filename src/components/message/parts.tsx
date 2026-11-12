import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import dayjs from 'dayjs';

import { useMessy } from '../../context';
import {
  displayName,
  groupReactions,
  isImageMessage,
  isVideoMessage,
  previewText,
} from '../../core/helpers';
import type {
  TMessyAvatarProps,
  TMessyBubbleProps,
  TMessyDaySeparatorProps,
  TMessyMessageSlotProps,
} from '../../types';
import { MImage, MText } from '../primitives';

const AVATAR_PALETTE = ['#FF9F0A', '#30D158', '#64D2FF', '#BF5AF2', '#FF375F'];

export function DefaultBubble({
  message,
  isOwn,
  position,
  layout,
  media,
  children,
}: TMessyBubbleProps) {
  const { theme } = useMessy();
  if (layout === 'list') {
    return (
      <View
        style={
          media
            ? { borderRadius: theme.radius.media, overflow: 'hidden' }
            : undefined
        }
      >
        {children}
      </View>
    );
  }
  const { bubble, bubbleGrouped } = theme.radius;
  const hasMedia =
    isImageMessage(message) || isVideoMessage(message) || !!message.location;
  // corners facing the neighbour in the same group are tightened
  const top =
    position === 'middle' || position === 'last' ? bubbleGrouped : bubble;
  const bottom =
    position === 'first' || position === 'middle' ? bubbleGrouped : bubble;
  const corners: ViewStyle = isOwn
    ? { borderTopRightRadius: top, borderBottomRightRadius: bottom }
    : { borderTopLeftRadius: top, borderBottomLeftRadius: bottom };
  return (
    <View
      style={[
        {
          borderRadius: bubble,
          // clip only media: iOS draws a dark hairline when clipping per-corner radii
          overflow: hasMedia ? 'hidden' : 'visible',
          backgroundColor: media
            ? 'transparent'
            : isOwn
            ? theme.colors.ownBubble
            : theme.colors.otherBubble,
        },
        corners,
      ]}
    >
      {children}
    </View>
  );
}

export function DefaultAvatar({ user, size }: TMessyAvatarProps) {
  const style = { width: size, height: size, borderRadius: size / 2 };
  if (user?.avatar) {
    return <MImage source={user.avatar} style={style} resizeMode="cover" />;
  }
  const name = user?.userName ?? '';
  const color =
    AVATAR_PALETTE[
      [...String(user?.id ?? name)].reduce((s, c) => s + c.charCodeAt(0), 0) %
        AVATAR_PALETTE.length
    ];
  return (
    <View
      style={[
        style,
        {
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <MText
        style={{ color: 'white', fontWeight: '600', fontSize: size * 0.45 }}
      >
        {name.charAt(0).toUpperCase()}
      </MText>
    </View>
  );
}

export function DefaultSenderName({ message, layout }: TMessyMessageSlotProps) {
  const { theme } = useMessy();
  if (layout === 'list') {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          marginBottom: theme.spacing.xxs,
        }}
      >
        <MText
          style={{
            color: theme.colors.text,
            fontWeight: '600',
            fontSize: theme.font.message - 1,
          }}
        >
          {message.user?.userName}
        </MText>
        {!!message.createdTime && (
          <MText
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.font.caption,
              marginLeft: theme.spacing.sm,
            }}
          >
            {dayjs(message.createdTime).format('HH:mm')}
          </MText>
        )}
      </View>
    );
  }
  if (!message.user?.userName) {
    return null;
  }
  return (
    <MText
      style={{
        color: theme.colors.textSecondary,
        fontSize: theme.font.name,
        marginBottom: theme.spacing.xs,
        marginLeft: theme.spacing.md,
      }}
    >
      {message.user.userName}
    </MText>
  );
}

export function DefaultDaySeparator({ date }: TMessyDaySeparatorProps) {
  const { theme, texts } = useMessy();
  const d = dayjs(date);
  const now = dayjs();
  let day = d.format(d.isSame(now, 'year') ? 'ddd, D MMM' : 'D MMM YYYY');
  if (d.isSame(now, 'day')) {
    day = texts.today;
  } else if (d.isSame(now.subtract(1, 'day'), 'day')) {
    day = texts.yesterday;
  }
  return (
    <MText
      style={{
        alignSelf: 'center',
        color: theme.colors.textSecondary,
        fontSize: theme.font.caption,
        marginVertical: theme.spacing.md,
      }}
    >
      <MText style={{ fontWeight: '600' }}>{day}</MText> {d.format('HH:mm')}
    </MText>
  );
}

export function DefaultSystemMessage({ message }: TMessyMessageSlotProps) {
  const { theme } = useMessy();
  return (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.chip,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        marginVertical: theme.spacing.sm,
        maxWidth: '80%',
      }}
    >
      <MText
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.font.caption,
          textAlign: 'center',
        }}
      >
        {message.text}
      </MText>
    </View>
  );
}

export function DefaultMessageStatus({ message }: TMessyMessageSlotProps) {
  const { theme, texts, components: C } = useMessy();
  const seenBy = message.seenBy ?? [];
  if (message.status === 'seen' && seenBy.length) {
    const size = 14;
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: theme.spacing.xs,
          paddingRight: size / 3,
        }}
      >
        {seenBy.slice(0, 4).map((u, i) => (
          <View
            key={`${u.id ?? i}`}
            style={{
              marginRight: -size / 3,
              borderRadius: size,
              borderWidth: 1,
              borderColor: theme.colors.background,
            }}
          >
            <C.Avatar user={u} size={size} />
          </View>
        ))}
      </View>
    );
  }
  const label = message.status ? texts[message.status] : undefined;
  if (!label) {
    return null;
  }
  return (
    <MText
      style={{
        marginTop: theme.spacing.xs,
        fontSize: theme.font.caption,
        color:
          message.status === 'failed'
            ? theme.colors.danger
            : theme.colors.textSecondary,
      }}
    >
      {label}
    </MText>
  );
}

export function DefaultReactions({
  message,
  isOwn,
  layout,
}: TMessyMessageSlotProps) {
  const { theme, props } = useMessy();
  const groups = groupReactions(message.reactions);
  if (!groups.length) {
    return null;
  }
  const userId = props.user?.id;
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent:
          isOwn && layout === 'bubble' ? 'flex-end' : 'flex-start',
        marginTop: layout === 'bubble' ? -theme.spacing.xs : theme.spacing.xs,
        paddingHorizontal: layout === 'bubble' ? theme.spacing.sm : 0,
      }}
    >
      {groups.map(({ reaction, users }) => {
        const mine = users.some((u) => u?.id != null && u.id === userId);
        return (
          <Pressable
            key={reaction.key}
            accessibilityRole="button"
            accessibilityLabel={`${reaction.value} ${users.length}`}
            onPress={() => props.reactions?.onPress?.({ message, reaction })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: theme.spacing.sm - 2,
              paddingVertical: theme.spacing.xxs,
              marginRight: theme.spacing.xs,
              marginTop: theme.spacing.xxs,
              borderRadius: theme.radius.chip,
              borderWidth: 1.5,
              borderColor: theme.colors.background,
              backgroundColor: mine
                ? theme.colors.reactionChipActive
                : theme.colors.reactionChip,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 1 },
              elevation: 1,
            }}
          >
            <MText style={{ fontSize: theme.font.caption + 1 }}>
              {reaction.value}
            </MText>
            {users.length > 1 && (
              <MText
                style={{
                  marginLeft: theme.spacing.xxs,
                  fontSize: theme.font.caption,
                  color: theme.colors.text,
                }}
              >
                {users.length}
              </MText>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export function DefaultThreadSummary({ message }: TMessyMessageSlotProps) {
  const { theme, texts, props, components: C } = useMessy();
  const replies = message.replies;
  if (!replies?.count) {
    return null;
  }
  const size = 20;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => props.onPressReplies?.(message)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xs,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      {(replies.users ?? []).slice(0, 3).map((u, i) => (
        <View key={`${u.id ?? i}`} style={{ marginRight: theme.spacing.xs }}>
          <C.Avatar user={u} size={size} />
        </View>
      ))}
      <MText
        style={{
          color: theme.colors.text,
          fontSize: theme.font.name,
          fontWeight: '600',
        }}
      >
        {replies.count} {replies.count === 1 ? texts.reply : texts.replies}
      </MText>
      <MText
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.font.name + 2,
          marginLeft: theme.spacing.xs,
        }}
      >
        ›
      </MText>
    </Pressable>
  );
}

export function DefaultMessageReply({
  message,
  isOwn,
  layout,
}: TMessyMessageSlotProps) {
  const { theme, texts, props } = useMessy();
  const quoted = message.replyTo;
  if (!quoted) {
    return null;
  }
  const bubble = layout === 'bubble';
  const color = !bubble
    ? theme.colors.text
    : isOwn
    ? theme.colors.ownText
    : theme.colors.otherText;
  return (
    <View
      style={{
        flexDirection: 'row',
        margin: bubble ? theme.spacing.xs : 0,
        marginBottom: bubble ? 0 : theme.spacing.xs,
        padding: theme.spacing.sm,
        borderRadius: theme.radius.chip,
        overflow: 'hidden',
      }}
    >
      {/* tint derived from the text color so it works on any bubble color */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: color, opacity: 0.08 },
        ]}
      />
      <View
        style={{
          width: 3,
          borderRadius: 2,
          marginRight: theme.spacing.sm,
          backgroundColor: bubble && isOwn ? color : theme.colors.primary,
        }}
      />
      <View style={{ flexShrink: 1 }}>
        <MText
          numberOfLines={1}
          style={{ color, fontSize: theme.font.name, fontWeight: '600' }}
        >
          {displayName(quoted.user, props.user, texts)}
        </MText>
        <MText
          numberOfLines={1}
          style={{ color, opacity: 0.75, fontSize: theme.font.name }}
        >
          {previewText(quoted, texts)}
        </MText>
      </View>
    </View>
  );
}
