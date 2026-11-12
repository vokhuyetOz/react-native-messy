# Layouts

<p>
  <img src="../preview/bubble.jpg" width="220" alt="Two-sided bubble layout">
  <img src="../preview/list.jpg" width="220" alt="One-sided list layout">
</p>

```tsx
<Messy layout="bubble" /> // default: two-sided
<Messy layout="list" />   // one-sided
```

| | `bubble` (two-sided) | `list` (one-sided) |
|---|---|---|
| Your messages | right, `ownBubble` background | left, no bubble |
| Other people's messages | left, `otherBubble` background | left, no bubble |
| Avatar | next to the **last** message of a group | next to the **first** message of a group, 1.3 × `avatarSize` |
| Name | above a group, only with `showSenderName` | always, with the time, on the first message of a group |
| Best for | 1-to-1 chats, messengers | group chats, community and support threads |

The layout is passed to every message slot as `props.layout`, so your own slots can render differently per layout. You can switch layouts at runtime; nothing is remounted except the rows.

## Grouping

Consecutive messages from the same sender are grouped when they are less than `groupInterval` apart (default 5 minutes) and on the same day. Each message gets a `position`:

| `position` | Meaning | Default bubble corners |
|---|---|---|
| `single` | alone | all round |
| `first` | first of a group | tight corner at the bottom on the sender's side |
| `middle` | inside a group | tight corners top and bottom |
| `last` | last of a group | tight corner at the top |

"Tight" is `theme.radius.bubbleGrouped`, the rest is `theme.radius.bubble`. A day separator is shown above the first message of each calendar day (`showDay`).

Grouping is computed by `buildItems(messages, myUserId, groupInterval)`, which is exported if you need the same result outside `Messy`.

## Layout props

| Prop | Default | |
|---|---|---|
| `layout` | `'bubble'` | `'bubble'` or `'list'` |
| `showAvatar` | `true` | other people's avatars (bubble layout) |
| `showOwnAvatar` | `false` | your own avatar (bubble layout) |
| `showSenderName` | `false` | name above other people's groups (bubble layout). Turn it on for group chats |
| `groupInterval` | `300000` | max ms between two messages of one sender for them to be grouped. System messages always break a group |

## A third layout

If neither fits, keep the data handling and replace the row. The `Message` slot receives everything it needs (`message`, `isOwn`, `position`, `showDay`, `isLatestOwn`, `layout`), and you can still reuse the default parts inside it. See [Customization → Replacing a whole row](customization.md#replacing-a-whole-row).
