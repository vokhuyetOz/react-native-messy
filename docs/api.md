# API reference

All types are exported from the package root (`import type { TMessyProps } from '@vokhuyet/react-native-messy'`). The source of truth is [src/types.ts](../src/types.ts).

## `<Messy>` props

| Prop | Type | Default | |
|---|---|---|---|
| `messages` | `TMessyMessage[]` | `[]` | **newest first** |
| `user` | `TUser` | | the current user; decides `isOwn` |
| `layout` | `'bubble' \| 'list'` | `'bubble'` | two-sided or one-sided, see [Layouts](layouts.md) |
| `loading` | `boolean` | `false` | shows the `Loading` slot instead of the list |
| `theme` | `TDeepPartial<TMessyTheme>` | | deep-merged into `defaultTheme`, see [Theming](theming.md) |
| `components` | `Partial<TMessyComponents>` | | slots, see [Customization](customization.md) |
| `texts` | `Partial<TMessyTexts>` | | labels, see [Theming → Texts](theming.md#texts) |
| `showAvatar` | `boolean` | `true` | other people's avatars (bubble layout) |
| `showOwnAvatar` | `boolean` | `false` | your avatar (bubble layout) |
| `showSenderName` | `boolean` | `false` | names above other people's groups (bubble layout) |
| `groupInterval` | `number` (ms) | `300000` | max gap for grouping |
| `parsedShape` | `ParseShape[]` | | extra text patterns |
| `onSend` | `(message) => void \| Promise<void>` | | a new message from the composer, attachment buttons or `send()` |
| `onPressMessage` | `(message) => void` | | tap on a message body |
| `onLongPressMessage` | `(message) => void` | | long press on a message body |
| `onPressReplies` | `(message) => void` | | tap on "N Replies ›" |
| `swipeToReply` | `boolean` | `false` | swipe to reply, see [Features](features.md#swipe-to-reply) |
| `reactions` | `TMessyReactionConfig` | | enables reactions, see [Features](features.md#reactions) |
| `composerProps` | `TMessyComposerProps` | | see [Composer](composer.md#options) |
| `listProps` | `TMessyListProps` | | FlashList props, except `data`, `renderItem`, `keyExtractor`, `inverted` |
| `cache` | `TMessyCache` | | media size cache |

```ts
type TMessyReactionConfig = {
  data?: TReactionItem[];
  onPress?: (info: { message: TMessyMessage; reaction: TReactionItem }) => void;
};

type TMessyComposerProps = {
  disabled?: boolean;
  hideEmoji?: boolean;
  hideActions?: boolean;
  inputProps?: TextInputProps;
  bottomInset?: number;
};

type TMessyCache = {
  get: (key: string) => { width: number; height: number } | undefined | null;
  set: (key: string, value: { width: number; height: number }) => unknown;
};
```

`listProps` notes: `keyExtractor` is fixed to `clientId ?? id ?? index`, so keep `clientId` when you replace a sending message with the saved one. Your `onScroll` and `onScrollBeginDrag` are called alongside Messy's own.

## `TMessyMessage`

```ts
type TMessyMessage = {
  id?: string | number | null;
  clientId?: string;                 // set by send(); used as the list key
  type?: 'system' | 'message';
  user?: TUser;
  createdTime?: Date | number | string;
  status?: 'sending' | 'sent' | 'seen' | 'failed';
  seenBy?: TUser[];                  // avatars shown when status is 'seen'

  text?: string;
  image?: ImageSourcePropType | ImageSourcePropType[];
  video?: { uri: string };
  location?: { name: string; image: ImageSourcePropType; latitude: string; longitude: string };
  audio?: { uri?: string; id?: string }; // not rendered by default: use MessageCustom
  local?: Asset;                     // picked file not uploaded yet

  category?: string;                 // free-form tag for your own slots
  reactions?: { id?: string; user: TUser; reaction: TReactionItem }[];
  replies?: { count: number; users?: TUser[] };
  replyTo?: TMessyMessage;
};

type TUser = { id: string | number | null | undefined; userName?: string | null; avatar?: ImageSourcePropType };
type TReactionItem = { key: string; value: string; [key: string]: unknown };
```

Extra fields are fine. They are passed through untouched to your slots.

## Ref (`TMessyRef`)

| Method | |
|---|---|
| `setText(text)` | set the input text, cursor at the end |
| `focus()` | open the keyboard |
| `scrollToEnd(animated = true)` | scroll to the newest message |

## Hooks

| Hook | Returns |
|---|---|
| `useMessy()` | `TMessyContext`: `props`, `theme`, `components`, `texts`, `layout`, `openMediaViewer(items, index?)`, `openReactionPicker(item, anchor)`, `scrollToEnd(animated?)` |
| `useMessyTheme()` | `TMessyTheme` |
| `useMessyComponents()` | `TMessyComponents` |
| `useMessyComposerActions()` | `TMessyComposerActions` (stable) |
| `useMessyComposer()` | `{ text, panel, replyTo } & TMessyComposerActions` |

All hooks throw when used outside `<Messy>`.

## Exports

| Group | Names |
|---|---|
| Component | `Messy` |
| Defaults | `defaultComponents`, `defaultTheme`, `darkTheme`, `DEFAULT_TEXTS`, `DEFAULT_REACTIONS` |
| Message slots | `DefaultMessage`, `DefaultBubble`, `DefaultAvatar`, `DefaultSenderName`, `DefaultDaySeparator`, `DefaultSystemMessage`, `DefaultMessageText`, `DefaultMessageImage`, `DefaultMessageVideo`, `DefaultMessageLocation`, `DefaultMessageCustom`, `DefaultMessageReply`, `DefaultMessageStatus`, `DefaultThreadSummary`, `DefaultReactions` |
| Composer slots | `DefaultComposer`, `DefaultComposerActions`, `DefaultLibraryButton`, `DefaultCameraButton`, `DefaultSendButton`, `DefaultReplyPreview`, `DefaultEmojiPanel`, `ComposerIconButton` |
| Overlays | `DefaultReactionPicker`, `DefaultMediaViewer`, `DefaultScrollToBottomButton`, `DefaultLoading` |
| Primitives | `MText`, `MImage`, `MAutoImage`, `MVideo` |
| Helpers | `mergeTheme`, `buildItems`, `groupReactions`, `previewText`, `displayName` |
| Hooks | `useMessy`, `useMessyTheme`, `useMessyComponents`, `useMessyComposer`, `useMessyComposerActions` |
