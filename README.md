# react-native-messy

Chat UI for React Native that you can restyle and take apart piece by piece.

- Two layouts: **`bubble`** (yours on the right, theirs on the left) and **`list`** (everything on the left, Slack style)
- Bubbles grouped by sender, with tighter corners between consecutive messages, a day separator, and a delivery/seen status under your latest message
- Text with tappable links, phones and emails; single images and image grids with a "+N" tile; video; location
- Long-press reactions with a picker and reaction chips; "N Replies ›" thread summaries
- Composer with a pill input and a send button that is disabled while the input is empty. The emoji panel opens where the keyboard is, and you can open your own panels in the same place
- Full-screen media viewer: swipe between items, pinch to zoom
- Every visual part is a replaceable **slot**, styles come from **theme** tokens, and a dark theme is included

<p>
  <img src="preview/bubble.jpg" width="180" alt="Two-sided bubble layout">
  <img src="preview/list.jpg" width="180" alt="One-sided list layout">
  <img src="preview/dark.jpg" width="180" alt="Dark theme">
  <img src="preview/emoji.jpg" width="180" alt="Inline emoji panel">
  <img src="preview/reactions.jpg" width="180" alt="Reaction picker">
</p>

Design reference: [Cal AI – Sending a message in a group](https://mobbin.com/flows/aa385ee8-cc31-4230-95fd-82fd8fde4e12) (one-sided layout, in-pill send button, reply threads), plus the two-sided pattern shared by the "Chatting & Sending Messages" flows on Mobbin. The example applies it to both layouts with `theme={{ colors: { primary: '#111111', ownBubble: '#111111', surface: '#FFFFFF' } }}`.

## Installation

```sh
yarn add @vokhuyet/react-native-messy
```

Peer dependencies:

```sh
yarn add @shopify/flash-list react-native-gesture-handler react-native-reanimated \
  react-native-keyboard-controller react-native-image-picker react-native-video dayjs
```

Wrap your app with `GestureHandlerRootView` and `KeyboardProvider`:

```tsx
<GestureHandlerRootView style={{ flex: 1 }}>
  <KeyboardProvider>
    <App />
  </KeyboardProvider>
</GestureHandlerRootView>
```

## Usage

```tsx
import { Messy, type TMessyMessage } from '@vokhuyet/react-native-messy';

const [messages, setMessages] = useState<TMessyMessage[]>([]); // newest first

<Messy
  messages={messages}
  user={{ id: me.id, userName: me.name, avatar: { uri: me.avatar } }}
  onSend={(message) => {
    setMessages((list) => [message, ...list]); // status: 'sending'
    api.send(message); // later, set status to 'sent' or 'seen'
  }}
  reactions={{ onPress: ({ message, reaction }) => toggleReaction(message, reaction) }}
/>;
```

`messages` is ordered **newest first**. `onSend` receives a message with `status: 'sending'`, `clientId`, `createdTime` and `user` already filled in. For media, `local` holds the picked `Asset`.

## Layouts

```tsx
<Messy layout="bubble" />  // default: two-sided bubbles
<Messy layout="list" />    // one-sided: avatar, name and time on the first message of each group
```

| Prop | Default | |
|---|---|---|
| `showAvatar` | `true` | other people's avatars (bubble layout) |
| `showOwnAvatar` | `false` | your own avatar (bubble layout) |
| `showSenderName` | `false` | name above other people's groups (bubble layout, useful for group chats) |
| `groupInterval` | `300000` | max ms between two messages of one sender for them to be grouped |

## Theme

Pass any subset of tokens. They are deep-merged into `defaultTheme`.

```tsx
import { darkTheme } from '@vokhuyet/react-native-messy';

<Messy theme={darkTheme} />
<Messy theme={{ colors: { primary: '#7C3AED', ownBubble: '#7C3AED' }, radius: { bubble: 12 } }} />
```

Tokens: `colors` (`background`, `surface`, `text`, `textSecondary`, `border`, `primary`, `onPrimary`, `ownBubble`, `ownText`, `ownLink`, `otherBubble`, `otherText`, `otherLink`, `danger`, `overlay`, `popup`, `reactionChip`, `reactionChipActive`, `media`), `spacing` (`xxs`, `xs`, `sm`, `md`, `lg`), `radius` (`bubble`, `bubbleGrouped`, `media`, `input`, `chip`), `font` (`message`, `messageLineHeight`, `caption`, `name`, `emoji`), `avatarSize`, `bubbleMaxWidth`, `mediaMaxWidth`, `mediaMaxHeight`, `composerMinHeight`. See [src/theme.ts](src/theme.ts).

Text labels can be translated with `texts`:

```tsx
<Messy texts={{ placeholder: 'Nhắn tin', today: 'Hôm nay', yesterday: 'Hôm qua', sent: 'Đã gửi', seen: 'Đã xem', reply: 'trả lời', replies: 'trả lời' }} />
```

## Replacing parts (slots)

Pass components to `components` to replace any part of the UI. Every default slot is exported, so you can wrap one instead of rewriting it.

```tsx
import { DefaultBubble, type TMessyBubbleProps } from '@vokhuyet/react-native-messy';

function Bubble(props: TMessyBubbleProps) {
  if (props.message.category === 'announcement') {
    return <View style={styles.banner}>{props.children}</View>;
  }
  return <DefaultBubble {...props} />;
}

// define slots outside render: inline components remount on every render
const components = { Bubble, Avatar: MyAvatar, Image: FastImage };

<Messy components={components} />;
```

| Slot | Props | Replaces |
|---|---|---|
| `Message` | `TMessyMessageSlotProps` | a whole row (day separator, avatar, name, bubble, reactions, status) |
| `Bubble` | `+ children, media` | the bubble container |
| `MessageText` / `MessageImage` / `MessageVideo` / `MessageLocation` | `TMessyMessageSlotProps` | content types |
| `MessageCustom` | `TMessyMessageSlotProps` | messages with no text, image, video or location (audio, files, cards) |
| `SystemMessage` | `TMessyMessageSlotProps` | `type: 'system'` messages (switch on `message.category`) |
| `Avatar` | `{ user, size }` | avatars everywhere |
| `SenderName` | `TMessyMessageSlotProps` | name above a group (or the header in list layout) |
| `DaySeparator` | `{ date }` | "Today 11:47" |
| `MessageStatus` | `TMessyMessageSlotProps` | "Delivered" or seen-by avatars under your latest message |
| `ThreadSummary` | `TMessyMessageSlotProps` | "2 Replies ›" row for messages with `replies` |
| `Reactions` | `TMessyMessageSlotProps` | reaction chips under a bubble |
| `ReactionPicker` | `TMessyReactionPickerProps` | the long-press popup |
| `MediaViewer` | `{ items, initialIndex, onClose }` | the full-screen viewer |
| `Composer` | – | the whole input bar |
| `ComposerActions` | – | buttons left of the input (library and camera by default) |
| `SendButton` | `{ disabled, onPress }` | the send button |
| `EmojiPanel` | – | the emoji panel |
| `ScrollToBottomButton` | `{ onPress }` | the "jump to latest" button |
| `Loading` | – | shown while `loading` |
| `Text` / `Image` / `Video` | RN props | primitives used by every default slot |

`TMessyMessageSlotProps` = `{ message, index, isOwn, position: 'single' | 'first' | 'middle' | 'last', showDay, isLatestOwn, layout }`.

### Hooks for custom slots

- `useMessyTheme()`, `useMessyComponents()`, `useMessy()`: the theme, slots, props and actions (`openMediaViewer`, `scrollToEnd`)
- `useMessyComposer()`: `text`, `panel` and the composer actions
- `useMessyComposerActions()`: the actions only (`send`, `setText`, `insertText`, `focus`, `dismiss`, `openPanel`, `closePanel`, `togglePanel`). It does not re-render while the user types

Open your own picker where the keyboard is, the same way the emoji panel opens:

```tsx
function ComposerActions() {
  const { togglePanel } = useMessyComposerActions();
  return (
    <View style={{ flexDirection: 'row' }}>
      <MyButton onPress={() => togglePanel('stickers', <StickerPanel />)} />
      <DefaultComposerActions />
    </View>
  );
}
```

`DefaultLibraryButton` and `DefaultCameraButton` accept `onPress` (replaces the picker), `handlePermission` (return `false` to abort), `source` and `tintColor`.

### Ref

```tsx
const ref = useRef<TMessyRef>(null);
ref.current?.setText('Hi'); // also focus(), scrollToEnd()
<Messy ref={ref} />;
```

## Other props

| Prop | |
|---|---|
| `loading` | shows the `Loading` slot in place of the list |
| `onPressMessage(message)` / `onLongPressMessage(message)` | message taps. A long press also opens the reaction picker when `reactions` is set |
| `onPressReplies(message)` | tap on the "N Replies" row, e.g. to open a thread screen |
| `reactions` | `{ data?: TReactionItem[], onPress?: ({ message, reaction }) => void }` |
| `composerProps` | `{ disabled, hideEmoji, hideActions, inputProps, bottomInset }` |
| `listProps` | passed through to FlashList (`onEndReached` for loading older messages, `ListFooterComponent`, ...) |
| `parsedShape` | extra [react-native-parsed-text](https://github.com/taskrabbit/react-native-parsed-text) patterns |
| `cache` | `{ get, set }` storage for media sizes (for example MMKV `getMap` / `setMap`), so bubbles don't jump when they re-mount |

Safe area: let `Messy` reach the bottom edge of the screen and pass the bottom inset as `composerProps.bottomInset` (for example `useSafeAreaInsets().bottom` from react-native-safe-area-context). Don't wrap the bottom edge in a `SafeAreaView`: the keyboard height already includes the inset, so padding it twice leaves a gap above the keyboard.

## TMessyMessage

```ts
id?: string | number | null;
text?: string;
image?: ImageSourcePropType | ImageSourcePropType[];
video?: { uri: string };
location?: { name; image; latitude; longitude };
audio?: { uri?: string; id?: string };   // render it with the MessageCustom slot
user?: TUser;                             // { id, userName?, avatar? }
type?: 'system' | 'message';
createdTime?: Date | number | string;
status?: 'sending' | 'sent' | 'seen' | 'failed';
seenBy?: TUser[];
local?: Asset;                            // picked file not uploaded yet
clientId?: string;
category?: string;
reactions?: { id?; user: TUser; reaction: { key; value } }[];
replies?: { count: number; users?: TUser[] };  // shows "2 Replies ›"
```

## Migrating from 0.x

1.0 is a breaking release. The scattered `render*` props are replaced by slots, and `@gorhom/bottom-sheet` is no longer used.

| 0.x | 1.0 |
|---|---|
| `useInBottomSheet` | removed. Put `<Messy>` in any container |
| `BottomSheetModalProvider`, `dismissAll()` | not needed. Use `useMessyComposerActions().dismiss()` |
| `theme: TColor` (`message_left`, `message_right`, ...) | `theme` tokens: `colors.otherBubble`, `colors.ownBubble`, ... |
| `BaseModule.Image` / `.Text` / `.Video` | `components.Image` / `.Text` / `.Video` |
| `BaseModule.Cache` | `cache` |
| `renderMessage` | `components.Message` |
| `renderMessageText` / `Image` / `Video` / `Location` | `components.MessageText` / `MessageImage` / `MessageVideo` / `MessageLocation` |
| `renderMessageOther`, `renderMessageAudio` | `components.MessageCustom` |
| `renderMessageSystem` | `components.SystemMessage` |
| `renderAvatar` | `components.Avatar` |
| `renderMessageDateTime`, `showDateTime` | `components.DaySeparator` |
| `renderLoading` | `components.Loading` |
| `messageProps.hidePartnerAvatar` / `hideOwnerAvatar` | `showAvatar={false}` / `showOwnAvatar` |
| `messageProps.onPress` / `onLongPress` | `onPressMessage` / `onLongPressMessage` |
| `messageProps.renderMessyMessageContentReaction` | `components.Reactions` |
| `reaction.renderItems`, `reaction.renderReactionButton` | `components.ReactionPicker`. Reactions open with a long press |
| `reaction` | `reactions` |
| `footerProps.onSend` | `onSend` |
| `footerProps.renderFooter` | `components.Composer` |
| `footerProps.Send` | `components.SendButton` |
| `footerProps.renderFooterAction`, `ExtraActionLeft` | `components.ComposerActions` |
| `footerProps.ExtraLeft` (+ `animatedPosition`) | `togglePanel(key, node)` from `useMessyComposerActions()` |
| `footerProps.hideFooterAction` / `hideEmoji` / `disabled` / `inputProps` | `composerProps.hideActions` / `hideEmoji` / `disabled` / `inputProps` |
| `setMessyFooterInputText(text)` | `ref.current.setText(text)` |
| `MessyFooterActionLibraryDefault` / `CameraDefault` | `DefaultLibraryButton` / `DefaultCameraButton` |
| `listProps.onPress` | removed. Tapping a message or dragging the list closes the keyboard and panels |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
