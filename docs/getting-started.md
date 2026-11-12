# Getting started

## Install

```sh
yarn add @vokhuyet/react-native-messy
```

Peer dependencies (skip the ones your app already has):

```sh
yarn add @shopify/flash-list react-native-gesture-handler react-native-reanimated \
  react-native-keyboard-controller react-native-image-picker react-native-video dayjs
```

Then follow each library's own native setup: the Reanimated Babel plugin, `pod install`, and camera and photo-library permission strings for react-native-image-picker.

## Wrap the app once

`Messy` needs two providers somewhere above it, usually at the app root:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <Navigation />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
```

## A first chat screen

```tsx
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Messy, type TMessyMessage } from '@vokhuyet/react-native-messy';

const me = { id: 'u1', userName: 'Alex', avatar: { uri: 'https://…/alex.png' } };

export function ChatScreen() {
  const [messages, setMessages] = useState<TMessyMessage[]>([]); // newest first
  const insets = useSafeAreaInsets();

  return (
    <Messy
      messages={messages}
      user={me}
      composerProps={{ bottomInset: insets.bottom }}
      onSend={(message) => setMessages((list) => [message, ...list])}
    />
  );
}
```

Two rules matter most:

- **`messages` is ordered newest first.** The list is inverted, so `messages[0]` sits just above the composer.
- **`user.id` decides which side a message is on.** A message whose `user.id` equals `user.id` is yours and goes on the right in the bubble layout.

## The send lifecycle

When the user taps send, `onSend` gets a message that is already filled in:

```ts
{
  id: '1731400000000',        // temporary, equals clientId
  clientId: '1731400000000',
  type: 'message',
  status: 'sending',          // shows a spinner on media and "Sending…" under the bubble
  createdTime: 1731400000000,
  user: me,
  text: 'Hello',              // or `local` for a picked photo/video
  replyTo: { … },             // only when replying, see features.md
}
```

Add it to your list right away so it appears immediately, send it to your backend, then update it in place:

```tsx
const update = (clientId: string, patch: Partial<TMessyMessage>) =>
  setMessages((list) => list.map((m) => (m.clientId === clientId ? { ...m, ...patch } : m)));

onSend={async (message) => {
  setMessages((list) => [message, ...list]);
  try {
    const saved = await api.send(message);
    // keep clientId: it is the list key, so the row does not remount
    update(message.clientId!, { id: saved.id, status: 'sent' });
  } catch {
    update(message.clientId!, { status: 'failed' });
  }
}}
```

| `status` | Shown under your latest message |
|---|---|
| `sending` | "Sending…" |
| `sent` | "Delivered" |
| `seen` | avatars from `seenBy`, or "Seen" when `seenBy` is empty |
| `failed` | "Not delivered" in the danger color |

### Photos and videos

The library and camera buttons call `onSend` with `local` set to the picked [`Asset`](https://github.com/react-native-image-picker/react-native-image-picker#asset-object). The bubble previews the local file while you upload it. When the upload finishes, swap `local` for the remote source:

```tsx
onSend={async (message) => {
  setMessages((list) => [message, ...list]);
  if (message.local) {
    const url = await upload(message.local);
    const isImage = message.local.type?.startsWith('image');
    update(message.clientId!, {
      local: undefined,
      status: 'sent',
      ...(isImage ? { image: { uri: url } } : { video: { uri: url } }),
    });
  }
}}
```

## Loading older messages

`listProps` goes straight to FlashList. Because the list is inverted, "end reached" means the top of the conversation:

```tsx
<Messy
  messages={messages}
  listProps={{
    onEndReached: loadOlder,           // append older messages to the END of `messages`
    onEndReachedThreshold: 0.3,
    ListFooterComponent: hasMore ? <ActivityIndicator /> : null, // rendered at the top
  }}
/>
```

Use `loading` to show the `Loading` slot in place of the list while you fetch the first page.

## Safe area and keyboard

Let `Messy` reach the bottom edge of the screen and pass the bottom inset as `composerProps.bottomInset`. Messy pads the composer by the inset while the keyboard is closed and follows the keyboard when it is open.

Don't wrap the bottom edge in a `SafeAreaView` or add `paddingBottom` yourself. The keyboard height already includes the inset, so padding it twice leaves a gap above the keyboard.

## Controlling the chat from outside

```tsx
const ref = useRef<TMessyRef>(null);

<Messy ref={ref} … />;

ref.current?.setText('Hi @Sam '); // fills the input and puts the cursor at the end
ref.current?.focus();             // opens the keyboard
ref.current?.scrollToEnd();       // jumps to the newest message
```

Next: [Layouts](layouts.md) · [Theming](theming.md) · [Customization](customization.md)
