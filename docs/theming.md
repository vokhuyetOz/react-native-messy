# Theming and texts

Theme tokens are the first thing to reach for. Every default slot reads its colors, sizes and spacing from the theme, so changing a token restyles the whole chat. Replace a [slot](customization.md) only when the change is structural.

## Passing a theme

`theme` accepts any subset of tokens. It is deep-merged into `defaultTheme`, so you only write what changes:

```tsx
<Messy
  theme={{
    colors: { primary: '#7C3AED', ownBubble: '#7C3AED' },
    radius: { bubble: 12, bubbleGrouped: 4 },
  }}
/>
```

Keep the object outside render, or memoize it. A new object on every render re-renders every row.

```tsx
const brandTheme = { colors: { primary: '#7C3AED', ownBubble: '#7C3AED' } };

function Chat() {
  return <Messy theme={brandTheme} … />;
}
```

## Dark mode

`darkTheme` is a partial theme containing only the colors that change. Pick one per color scheme:

```tsx
import { useColorScheme } from 'react-native';
import { darkTheme } from '@vokhuyet/react-native-messy';

const light = { colors: { primary: '#7C3AED', ownBubble: '#7C3AED' } };
const dark = { ...darkTheme, colors: { ...darkTheme.colors, ...light.colors } };

function Chat() {
  const scheme = useColorScheme();
  return <Messy theme={scheme === 'dark' ? dark : light} … />;
}
```

`mergeTheme(partial)` returns a full `TMessyTheme`, which is useful when you need concrete values outside `Messy` (a header styled like the chat, for example).

## Tokens

Defaults are in [src/theme.ts](../src/theme.ts).

### `colors`

| Token | Default | Used for |
|---|---|---|
| `background` | `#FFFFFF` | screen, composer bar, ring around reaction chips and seen avatars |
| `surface` | `#F2F3F5` | input pill, system messages, swipe-to-reply icon, failed-image placeholder |
| `text` | `#0B0B0C` | main text, list layout message text |
| `textSecondary` | `#8A8D93` | placeholder, timestamps, status, sender names, icons |
| `border` | `#E4E6EB` | input border, reply bar border, disabled send button |
| `primary` | `#0A84FF` | send button, active emoji icon, reply bars |
| `onPrimary` | `#FFFFFF` | glyph on the send button |
| `ownBubble` / `ownText` / `ownLink` | `#0A84FF` / `#FFFFFF` / `#FFFFFF` | your bubbles (bubble layout) |
| `otherBubble` / `otherText` / `otherLink` | `#F0F0F2` / `#0B0B0C` / `#0A84FF` | other people's bubbles; `otherLink` is also used for links in the list layout |
| `danger` | `#FF3B30` | "Not delivered" |
| `overlay` | `rgba(0,0,0,0.35)` | backdrop behind the reaction picker |
| `popup` | `#FFFFFF` | reaction picker background |
| `reactionChip` / `reactionChipActive` | `#FFFFFF` / `#E5F1FF` | reaction chips; active = you reacted |
| `media` | `#000000` | background behind videos |

### Sizes

| Token | Default | Used for |
|---|---|---|
| `spacing.xxs` … `spacing.lg` | `2, 4, 8, 12, 16` | all paddings and gaps |
| `radius.bubble` | `20` | bubble corners |
| `radius.bubbleGrouped` | `6` | bubble corners facing a neighbour in the same group |
| `radius.media` | `18` | images and videos in the list layout |
| `radius.input` | `20` | input pill |
| `radius.chip` | `12` | system messages, reaction chips, reply quotes |
| `font.message` / `font.messageLineHeight` | `16` / `21` | message text and input |
| `font.caption` | `12` | status, timestamps, day separator |
| `font.name` | `13` | sender name, thread summary, reply quote |
| `font.emoji` | `28` | emoji panel |
| `avatarSize` | `28` | avatars (× 1.3 in the list layout) |
| `bubbleMaxWidth` | `0.75` | fraction of screen width a bubble may take (bubble layout) |
| `mediaMaxWidth` / `mediaMaxHeight` | `240` / `320` | box that images and videos are fitted into |
| `composerMinHeight` | `40` | input pill height, send and icon button size |

## Using the theme in your own components

Inside `Messy` (any slot, or a panel you open in the composer), read the merged theme with `useMessyTheme()`:

```tsx
import { useMessyTheme } from '@vokhuyet/react-native-messy';

function FileCard({ name }: { name: string }) {
  const theme = useMessyTheme();
  return (
    <View style={{ padding: theme.spacing.md, borderRadius: theme.radius.chip, backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.text, fontSize: theme.font.message }}>{name}</Text>
    </View>
  );
}
```

### Adding your own tokens

The theme is a plain object, so extra keys pass through the merge untouched. Cast when you read them back:

```tsx
const theme = { colors: { primary: '#111' }, brand: { gradient: ['#F00', '#00F'] } };

<Messy theme={theme as any} />;

// in a slot
const { brand } = useMessyTheme() as TMessyTheme & typeof theme;
```

## Texts

Every built-in label can be translated or reworded with `texts`. Pass only what you change:

```tsx
const vi = {
  placeholder: 'Nhắn tin',
  today: 'Hôm nay',
  yesterday: 'Hôm qua',
  sending: 'Đang gửi…',
  sent: 'Đã gửi',
  seen: 'Đã xem',
  failed: 'Gửi thất bại',
  reply: 'trả lời',
  replies: 'trả lời',
  replyingTo: 'Đang trả lời',
  you: 'Bạn',
  photo: 'Ảnh',
  video: 'Video',
  location: 'Vị trí',
};

<Messy texts={vi} />;
```

| Key | Default | Where |
|---|---|---|
| `placeholder` | `Message` | empty input |
| `today` / `yesterday` | `Today` / `Yesterday` | day separator; older days use the date |
| `sending` / `sent` / `seen` / `failed` | `Sending…` / `Delivered` / `Seen` / `Not delivered` | status under your latest message |
| `reply` / `replies` | `Reply` / `Replies` | "1 Reply", "2 Replies" |
| `replyingTo` | `Replying to` | bar above the input while replying |
| `you` | `You` | name in reply quotes when you are the author |
| `photo` / `video` / `location` | `Photo` / `Video` / `Location` | reply quote of a message with no text |

Dates use dayjs. To localize them, load a dayjs locale in your app (`import 'dayjs/locale/vi'; dayjs.locale('vi');`).
