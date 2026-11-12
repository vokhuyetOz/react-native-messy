# Customization

Messy has three levels of customization. Use the lightest one that does the job:

1. **[Theme tokens](theming.md)**: colors, radii, spacing, font sizes. No components to write.
2. **Wrap a default slot**: add or change something around the default part and keep the rest.
3. **Replace a slot**: render the part yourself, reading data from props and hooks.

Every visual part of the chat is a **slot**: a component you can pass in `components`. Every default slot is exported as `Default<SlotName>`, so wrapping one is a single import.

## How slots work

```tsx
import { Messy, type TMessyComponents } from '@vokhuyet/react-native-messy';

// 1. define slots OUTSIDE the render function
const components: Partial<TMessyComponents> = {
  Avatar: MyAvatar,
  SendButton: MySendButton,
};

// 2. pass them
<Messy components={components} … />;
```

- **Only the slots you pass change.** The rest keep their defaults.
- **Define slots at module level** (or memoize the object). An inline `components={{ Avatar: (p) => … }}` creates a new component type on every render, which remounts every row and loses image and video state.
- **Slots are used everywhere.** Replacing `Avatar` changes the avatar next to messages, in the seen-by row and in the thread summary. Replacing `Text` or `Image` changes every text or image drawn by the default slots.
- **Slots receive data through props, and everything else through hooks.** `useMessy()` gives you the theme, texts, the `<Messy>` props and actions. See [Hooks](#hooks).

## Anatomy

```
Messy
├── (list, inverted)
│   └── Message ─────────────── one row per message
│       ├── DaySeparator        "Today 11:47", when showDay
│       ├── SystemMessage       instead of everything below, for type: 'system'
│       ├── Avatar
│       ├── SenderName
│       ├── Bubble
│       │   ├── MessageReply    quote of message.replyTo
│       │   ├── MessageImage | MessageVideo | MessageLocation
│       │   └── MessageText
│       ├── MessageCustom       instead of Bubble, when there is no text/image/video/location
│       ├── ThreadSummary       "2 Replies ›"
│       ├── Reactions           chips
│       └── MessageStatus       "Delivered" / seen-by, on your latest message
├── ScrollToBottomButton
├── Composer
│   ├── ReplyPreview            "Replying to Sam", while replying
│   ├── ComposerActions         library + camera buttons
│   ├── (input)
│   ├── SendButton
│   └── (keyboard area)         EmojiPanel or your own panel
├── ReactionPicker              long-press popup
├── MediaViewer                 full-screen images and videos
├── Loading
└── Text, Image, Video          primitives used by all of the above
```

## Slot reference

| Slot | Props | Default export |
|---|---|---|
| `Message` | `TMessyMessageSlotProps` | `DefaultMessage` |
| `Bubble` | `TMessyBubbleProps` = slot props + `children`, `media` | `DefaultBubble` |
| `MessageText` | `TMessyMessageSlotProps` | `DefaultMessageText` |
| `MessageImage` | `TMessyMessageSlotProps` | `DefaultMessageImage` |
| `MessageVideo` | `TMessyMessageSlotProps` | `DefaultMessageVideo` |
| `MessageLocation` | `TMessyMessageSlotProps` | `DefaultMessageLocation` |
| `MessageCustom` | `TMessyMessageSlotProps` | `DefaultMessageCustom` (renders nothing) |
| `MessageReply` | `TMessyMessageSlotProps` | `DefaultMessageReply` |
| `SystemMessage` | `TMessyMessageSlotProps` | `DefaultSystemMessage` |
| `Avatar` | `{ user?: TUser; size: number }` | `DefaultAvatar` |
| `SenderName` | `TMessyMessageSlotProps` | `DefaultSenderName` |
| `DaySeparator` | `{ date }` | `DefaultDaySeparator` |
| `MessageStatus` | `TMessyMessageSlotProps` | `DefaultMessageStatus` |
| `ThreadSummary` | `TMessyMessageSlotProps` | `DefaultThreadSummary` |
| `Reactions` | `TMessyMessageSlotProps` | `DefaultReactions` |
| `ReactionPicker` | `TMessyReactionPickerProps` | `DefaultReactionPicker` |
| `MediaViewer` | `TMessyMediaViewerProps` | `DefaultMediaViewer` |
| `Composer` | none | `DefaultComposer` |
| `ComposerActions` | none | `DefaultComposerActions` |
| `SendButton` | `{ disabled: boolean; onPress: () => void }` | `DefaultSendButton` |
| `ReplyPreview` | `{ message: TMessyMessage; onClose: () => void }` | `DefaultReplyPreview` |
| `EmojiPanel` | none | `DefaultEmojiPanel` |
| `ScrollToBottomButton` | `{ onPress: () => void }` | `DefaultScrollToBottomButton` |
| `Loading` | none | `DefaultLoading` |
| `Text` | RN `TextProps` | RN `Text` |
| `Image` | RN `ImageProps` | RN `Image` |
| `Video` | `ReactVideoProps` | react-native-video |

Message-level slots all receive `TMessyMessageSlotProps`:

```ts
{
  message: TMessyMessage;
  index: number;          // index in `messages` (0 = newest)
  isOwn: boolean;         // message.user.id === user.id
  position: 'single' | 'first' | 'middle' | 'last';
  showDay: boolean;       // first message of its day
  isLatestOwn: boolean;   // your newest message
  layout: 'bubble' | 'list';
}
```

## Recipes

### Wrap instead of rewrite

Most changes are "the default, plus something". Import the default and render it:

```tsx
import { DefaultBubble, type TMessyBubbleProps } from '@vokhuyet/react-native-messy';

function Bubble(props: TMessyBubbleProps) {
  if (props.message.category === 'announcement') {
    return (
      <View style={{ borderWidth: 1, borderColor: '#F5A623', borderRadius: 16, padding: 2 }}>
        <DefaultBubble {...props} />
      </View>
    );
  }
  return <DefaultBubble {...props} />;
}

const components = { Bubble };
```

`message.category` is a free-form string. Use it to tag messages that need special rendering.

### A fully custom bubble

`children` is the content (quote, media, text). `media` is `true` when the bubble holds only an image, video or location, which usually shouldn't get a background.

```tsx
function Bubble({ isOwn, media, position, layout, children }: TMessyBubbleProps) {
  const theme = useMessyTheme();
  if (layout === 'list' || media) {
    return <View style={{ borderRadius: theme.radius.media, overflow: 'hidden' }}>{children}</View>;
  }
  return (
    <LinearGradient
      colors={isOwn ? ['#7C3AED', '#DB2777'] : ['#F3F4F6', '#F3F4F6']}
      style={{
        borderRadius: 18,
        borderBottomRightRadius: isOwn && position !== 'last' && position !== 'single' ? 4 : 18,
      }}
    >
      {children}
    </LinearGradient>
  );
}
```

If you change the text color, replace `MessageText` too (or set `colors.ownText`).

### Faster images with a different image library

Replace the `Image` primitive once and every avatar, photo and grid tile uses it:

```tsx
import FastImage from '@d11/react-native-fast-image';

const components = { Image: FastImage as any };
```

Auto-sized images read their size from the image's `onLoad` event: `nativeEvent.source.{width,height}` (RN `Image`) or `nativeEvent.{width,height}` (FastImage-like). Your `Image` must forward `onLoad` and `onError`, or photos stay at their 4:3 placeholder size.

To change just the text font everywhere:

```tsx
function Text(props: TextProps) {
  return <RNText {...props} style={[{ fontFamily: 'Inter' }, props.style]} />;
}
const components = { Text };
```

### Avatars with initials, online dots, or a tap handler

```tsx
import { DefaultAvatar, type TMessyAvatarProps } from '@vokhuyet/react-native-messy';

function Avatar(props: TMessyAvatarProps) {
  const online = useOnline(props.user?.id);
  return (
    <Pressable onPress={() => openProfile(props.user)}>
      <DefaultAvatar {...props} />
      {online && (
        <View style={{ position: 'absolute', right: 0, bottom: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#30D158' }} />
      )}
    </Pressable>
  );
}
```

`DefaultAvatar` shows `user.avatar`, or the first letter of `userName` on a color derived from `user.id` when there is no image.

### Custom message types (audio, files, cards, polls)

A message that has no `text`, `image`, `video` or `location` is rendered by `MessageCustom`, **without a bubble**, so you control the whole look. Put whatever you need on the message (`audio`, `category`, or your own fields) and switch on it:

```tsx
type TFileMessage = TMessyMessage & { file?: { name: string; size: number; url: string } };

function MessageCustom({ message, isOwn }: TMessyMessageSlotProps) {
  const theme = useMessyTheme();
  const m = message as TFileMessage;
  if (m.audio) {
    return <VoiceNote uri={m.audio.uri} own={isOwn} />;
  }
  if (m.file) {
    return (
      <Pressable
        onPress={() => Linking.openURL(m.file!.url)}
        style={{
          flexDirection: 'row',
          padding: theme.spacing.md,
          borderRadius: theme.radius.bubble,
          backgroundColor: isOwn ? theme.colors.ownBubble : theme.colors.otherBubble,
        }}
      >
        <Text style={{ color: isOwn ? theme.colors.ownText : theme.colors.otherText }}>📄 {m.file.name}</Text>
      </Pressable>
    );
  }
  return null;
}

const components = { MessageCustom };
```

Send one from your own button with `send` (see [Composer](composer.md)):

```tsx
const { send } = useMessyComposerActions();
send({ file: { name: 'report.pdf', size: 120_000, url } } as TMessyMessage);
```

Long-press, reactions, swipe to reply, status and threads keep working for custom messages, because they are handled by the row around the slot.

### Several kinds of system message

`type: 'system'` messages are rendered by `SystemMessage` alone (no avatar, no bubble). Tag them with `category`:

```tsx
function SystemMessage(props: TMessyMessageSlotProps) {
  const { message } = props;
  if (message.category === 'call') {
    return <CallSummary duration={message.text} />;
  }
  if (message.category === 'encryption') {
    return <Text style={{ textAlign: 'center', color: '#8A8D93' }}>🔒 {message.text}</Text>;
  }
  return <DefaultSystemMessage {...props} />;
}
```

### Text: mentions, hashtags, custom links

`MessageText` uses [react-native-parsed-text](https://github.com/taskrabbit/react-native-parsed-text). URLs, phone numbers and emails are tappable by default. Add patterns with `parsedShape` instead of replacing the slot:

```tsx
<Messy
  parsedShape={[
    { pattern: /@\w+/, style: { fontWeight: '600' }, onPress: (name) => openProfile(name.slice(1)) },
    { pattern: /#\w+/, style: { color: '#7C3AED' }, onPress: openTag },
  ]}
/>
```

For markdown or rich text, replace `MessageText`. Keep the bubble padding (`theme.spacing.md` horizontal, `theme.spacing.sm` vertical in the bubble layout) so it lines up with the other parts.

### Status: read receipts, timestamps

`MessageStatus` is rendered only under your latest message (`isLatestOwn`). To show a time under every message instead, render it in a wrapped `Bubble` or `Message`. To change only what the status says:

```tsx
function MessageStatus(props: TMessyMessageSlotProps) {
  const { status, createdTime } = props.message;
  if (status === 'failed') {
    return <Pressable onPress={() => retry(props.message)}><Text style={{ color: 'red' }}>Not sent. Tap to retry</Text></Pressable>;
  }
  return <DefaultMessageStatus {...props} />;
}
```

### Replacing a whole row

`Message` is the whole row: day separator, avatar, name, bubble, thread summary, reactions and status. Replace it for a completely different layout, and reuse the other slots inside it so users of your component can still swap parts:

```tsx
function Message(props: TMessyMessageSlotProps) {
  const { components: C } = useMessy();
  const { message, isOwn, showDay } = props;
  if (message.type === 'system') {
    return <C.SystemMessage {...props} />;
  }
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
      {showDay && <C.DaySeparator date={message.createdTime!} />}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <C.Avatar user={message.user} size={32} />
        <View style={{ flex: 1 }}>
          <C.SenderName {...props} />
          {message.text ? <C.MessageText {...props} /> : <C.MessageCustom {...props} />}
          <C.Reactions {...props} />
        </View>
      </View>
    </View>
  );
}
```

When you replace `Message`, you take over the gestures as well. Long-press reactions and swipe to reply live in `DefaultMessage`. If you still want them, wrap `DefaultMessage` instead of replacing it, or call `openReactionPicker(item, anchor)` from `useMessy()` and `setReplyTo(message)` from `useMessyComposerActions()` yourself.

### Reaction picker

The picker gets the reactions to show (`data`), the long-pressed message and its on-screen rectangle (`anchor`), and two callbacks:

```tsx
function ReactionPicker({ message, data, anchor, isOwn, onSelect, onClose }: TMessyReactionPickerProps) {
  return (
    <Modal transparent visible onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={{ position: 'absolute', top: Math.max(anchor.y - 56, 60), [isOwn ? 'right' : 'left']: 16, flexDirection: 'row' }}>
        {data.map((r) => (
          <Pressable key={r.key} onPress={() => onSelect(r)}><Text style={{ fontSize: 30 }}>{r.value}</Text></Pressable>
        ))}
        <Pressable onPress={() => { onClose(); copy(message.text); }}><Text>Copy</Text></Pressable>
      </View>
    </Modal>
  );
}
```

The picker is a good place for a context menu (copy, reply, delete). Add the actions next to the emojis, and call `setReplyTo(message)` from `useMessyComposerActions()` for "Reply".

### Media viewer

`MediaViewer` gets `items` (`{ type: 'image' | 'video', source }[]`), `initialIndex` and `onClose`. Replace it to use your own gallery, or to add share and save buttons:

```tsx
function MediaViewer({ items, initialIndex, onClose }: TMessyMediaViewerProps) {
  return <MyGallery images={items.map((i) => i.source)} index={initialIndex} onDismiss={onClose} />;
}
```

Open it from your own slot with `openMediaViewer(items, index)` from `useMessy()`.

### Composer pieces

The composer has its own page: [Composer](composer.md). It covers the send button, attachment buttons, your own panels (stickers, GIFs), the reply bar, and replacing the whole composer.

## Hooks

Use these inside any slot, or inside anything rendered by a slot (for example a panel).

| Hook | Returns | Re-renders |
|---|---|---|
| `useMessy()` | `{ props, theme, components, texts, layout, openMediaViewer, openReactionPicker, scrollToEnd }` | when `<Messy>` props change |
| `useMessyTheme()` | the merged theme | same |
| `useMessyComponents()` | the merged slots, to render other slots (`<C.Avatar … />`) | same |
| `useMessyComposerActions()` | `send`, `setText`, `insertText`, `focus`, `dismiss`, `openPanel`, `closePanel`, `togglePanel`, `setReplyTo`, `setSelection`, `inputRef` | never (stable) |
| `useMessyComposer()` | composer state `text`, `panel`, `replyTo` + all actions | on every keystroke |

Prefer `useMessyComposerActions()` in message slots. `useMessyComposer()` re-renders on every keystroke, which is fine in the composer but wasteful in every row.

`useMessy().props` is the exact props object passed to `<Messy>`. It is how a slot reads `user`, callbacks like `onPressMessage`, or extra props of your own:

```tsx
<Messy {...({ onOpenProfile } as any)} />

// in a slot
const { onOpenProfile } = useMessy().props as any;
```

A typed alternative is a React context of your own around `<Messy>`.

## Helpers

| Export | |
|---|---|
| `MText`, `MImage` | `Text` / `Image` that go through the `Text` / `Image` slots. Use them in your slots so a user's primitive replacement still applies |
| `MAutoImage`, `MVideo` | image and video sized to fit `mediaMaxWidth` × `mediaMaxHeight`, using `cache` |
| `ComposerIconButton` | the round icon button used in the composer (`source`, `onPress`, `tintColor`, `disabled`, `accessibilityLabel`) |
| `previewText(message, texts)` | one-line summary: text, or "Photo" / "Video" / location name |
| `displayName(user, me, texts)` | "You" or `user.userName` |
| `groupReactions(reactions)` | `[{ reaction, users }]`, grouped by reaction key |
| `buildItems(messages, userId, groupInterval?)` | the grouping used by the list |
| `DEFAULT_TEXTS`, `DEFAULT_REACTIONS` | the defaults |
