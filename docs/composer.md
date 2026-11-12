# Composer

<p>
  <img src="../preview/emoji.jpg" width="220" alt="Inline emoji panel">
</p>

The composer is the bar at the bottom: attachment buttons, the input pill with the emoji button and the send button, and the area under it that follows the keyboard or hosts a panel.

```
┌ ReplyPreview ────────────────────────────────┐   only while replying
│ ComposerActions  ( input…        😊  ➤ )     │   ➤ = SendButton
└ keyboard area: keyboard | EmojiPanel | yours ┘
```

## Options

```tsx
<Messy
  composerProps={{
    bottomInset: insets.bottom, // safe area, see getting-started.md
    disabled: !canWrite,        // read-only chat: input and buttons disabled
    hideEmoji: true,            // no emoji button
    hideActions: true,          // no buttons left of the input
    inputProps: {               // passed to the TextInput
      placeholder: 'Write a reply…',
      maxLength: 2000,
      autoCorrect: false,
      onChangeText: (t) => sendTyping(), // runs alongside Messy's own handler
    },
  }}
/>
```

`inputProps.onChangeText`, `onSelectionChange` and `onFocus` are called in addition to Messy's handlers, never instead of them. `value` and `ref` are controlled by Messy. Use the actions below to change the text.

## Composer actions

`useMessyComposerActions()` works anywhere inside `<Messy>`. It returns stable functions, so calling it does not re-render your component while the user types.

| Action | |
|---|---|
| `send()` | sends the current text (trimmed). Does nothing when it is empty |
| `send(partial)` | sends any message, such as `{ image }`, `{ local }`, `{ audio }` or your own fields. The input text is kept |
| `setText(text)` | replaces the input text |
| `insertText(text)` | inserts at the cursor |
| `focus()` | closes any panel and opens the keyboard |
| `dismiss()` | closes the keyboard and any panel. Returns `true` if something was open |
| `openPanel(key, node)` / `closePanel()` / `togglePanel(key, node)` | show your own content where the keyboard is |
| `setReplyTo(message \| null)` | start or cancel a reply |
| `inputRef` | ref to the `TextInput` |

`send` always fills in `id`, `clientId`, `type: 'message'`, `status: 'sending'`, `createdTime`, `user` and the current `replyTo`, then calls `onSend` and scrolls to the newest message.

`useMessyComposer()` returns the same actions plus the state: `text`, `panel` (`{ key, node }` or `null`) and `replyTo`. Use it only in composer parts, because it re-renders on every keystroke.

## Recipes

### Your own send button

```tsx
import type { TMessySendButtonProps } from '@vokhuyet/react-native-messy';

function SendButton({ disabled, onPress }: TMessySendButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel="Send" style={{ padding: 8, opacity: disabled ? 0.4 : 1 }}>
      <SendIcon width={22} height={22} />
    </Pressable>
  );
}

const components = { SendButton };
```

`disabled` is `true` while the input is empty or the composer is disabled.

**Voice button when empty.** Read the text and switch:

```tsx
function SendButton(props: TMessySendButtonProps) {
  const { text, send } = useMessyComposer();
  if (!text.trim()) {
    return <RecordButton onRecorded={(uri) => send({ audio: { uri } })} />;
  }
  return <DefaultSendButton {...props} />;
}
```

(Render audio messages with the `MessageCustom` slot, see [Customization](customization.md#custom-message-types-audio-files-cards-polls).)

### Attachment buttons

The defaults are `DefaultLibraryButton` and `DefaultCameraButton`. Both send the picked file as `{ local: Asset }`. You can configure them without rewriting them:

| Prop | |
|---|---|
| `handlePermission` | `async () => boolean`, runs first. Return `false` to abort |
| `onPress` | replaces the built-in picker entirely |
| `source` | icon image |
| `tintColor` | icon color |

```tsx
import { DefaultCameraButton, DefaultLibraryButton } from '@vokhuyet/react-native-messy';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const askCamera = async () =>
  (await request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)) === RESULTS.GRANTED;

function ComposerActions() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <DefaultLibraryButton />
      <DefaultCameraButton handlePermission={askCamera} />
    </View>
  );
}

const components = { ComposerActions };
```

**Multiple photos or a different picker.** Use `onPress` and send each file yourself:

```tsx
function LibraryButton() {
  const { send } = useMessyComposerActions();
  return (
    <DefaultLibraryButton
      onPress={async () => {
        const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 });
        res.assets?.forEach((local) => send({ local }));
      }}
    />
  );
}
```

To send several images as one grid message instead, send `{ image: [a, b, c] }` once they are uploaded.

**Your own icon buttons** can use `ComposerIconButton` so they match the defaults in size and color:

```tsx
<ComposerIconButton source={require('./gif.png')} accessibilityLabel="GIF" onPress={openGifs} />
```

### Your own panel (stickers, GIFs, quick replies)

A panel is any React node shown in the keyboard area, at the keyboard's height. Opening one hides the keyboard, and focusing the input closes it. The emoji panel works the same way.

```tsx
function StickerPanel() {
  const { send, closePanel } = useMessyComposerActions();
  return (
    <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16 }}>
      {STICKERS.map((s) => (
        <Pressable key={s.id} onPress={() => { send({ image: { uri: s.url } }); closePanel(); }}>
          <Image source={{ uri: s.url }} style={{ width: 80, height: 80 }} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function ComposerActions() {
  const { togglePanel } = useMessyComposerActions();
  const { panel } = useMessyComposer();
  return (
    <View style={{ flexDirection: 'row' }}>
      <ComposerIconButton
        source={require('./sticker.png')}
        tintColor={panel?.key === 'stickers' ? '#0A84FF' : undefined}
        onPress={() => togglePanel('stickers', <StickerPanel />)}
      />
      <DefaultComposerActions />
    </View>
  );
}
```

`togglePanel` with the key of the panel that is already open closes it and brings the keyboard back, like the emoji button does.

### Emoji panel

Replace `EmojiPanel` to use another emoji picker. Insert with `insertText` so the emoji goes at the cursor:

```tsx
function EmojiPanel() {
  const { insertText } = useMessyComposerActions();
  return <MyEmojiPicker onSelect={(e) => insertText(e.emoji)} />;
}
```

Hide the button with `composerProps.hideEmoji`.

### Reply bar

`ReplyPreview` is shown above the input while a reply is pending. It gets the quoted `message` and `onClose`:

```tsx
function ReplyPreview({ message, onClose }: TMessyReplyPreviewProps) {
  const { texts, props } = useMessy();
  return (
    <View style={{ flexDirection: 'row', padding: 8, backgroundColor: '#F2F3F5' }}>
      <Text style={{ flex: 1 }} numberOfLines={1}>
        ↩ {displayName(message.user, props.user, texts)}: {previewText(message, texts)}
      </Text>
      <Pressable onPress={onClose}><Text>✕</Text></Pressable>
    </View>
  );
}
```

### Replacing the whole composer

Replace `Composer` when the layout itself is different, for example a toolbar above the input. You lose the default keyboard handling, so either keep `DefaultComposer` and wrap it, or rebuild with the hooks:

```tsx
function Composer() {
  return (
    <View>
      <QuickReplies />      {/* chips above the input */}
      <DefaultComposer />
    </View>
  );
}

function QuickReplies() {
  const { send } = useMessyComposerActions();
  return (
    <ScrollView horizontal>
      {['👍 OK', 'On my way', 'Thanks!'].map((t) => (
        <Pressable key={t} onPress={() => send({ text: t })}><Text>{t}</Text></Pressable>
      ))}
    </ScrollView>
  );
}
```

A composer written from scratch must render its own input, call `setText` on change and `send()` on submit, and render `ReplyPreview` when `replyTo` is set. It must also handle the keyboard; `KeyboardStickyView` from react-native-keyboard-controller does this. You can still use `useMessyComposer()` for the state.
