import type {
  TMessyMessage,
  TMessyMessageReaction,
  TMessyTexts,
  TReactionItem,
  TUser,
} from '../types';

export const DEFAULT_TEXTS: TMessyTexts = {
  placeholder: 'Message',
  today: 'Today',
  yesterday: 'Yesterday',
  sending: 'Sending…',
  sent: 'Delivered',
  seen: 'Seen',
  failed: 'Not delivered',
  reply: 'Reply',
  replies: 'Replies',
  replyingTo: 'Replying to',
  you: 'You',
  photo: 'Photo',
  video: 'Video',
  location: 'Location',
};

export const DEFAULT_REACTIONS: TReactionItem[] = [
  { key: 'love', value: '❤️' },
  { key: 'like', value: '👍' },
  { key: 'haha', value: '😂' },
  { key: 'wow', value: '😮' },
  { key: 'sad', value: '😢' },
  { key: 'angry', value: '😡' },
];

export function insert(str: string, index: number, value: string) {
  return `${str.slice(0, index)}${value}${str.slice(index)}`;
}

const IMAGE_EXT = /\.(gif|jpe?g|tiff?|png|webp|bmp|heic)$/i;

export function isImageMessage(m: TMessyMessage) {
  if (m.image) {
    return true;
  }
  if (!m.local) {
    return false;
  }
  return m.local.type
    ? m.local.type.startsWith('image')
    : IMAGE_EXT.test(m.local.fileName || m.local.uri || '');
}

export function isVideoMessage(m: TMessyMessage) {
  return !!m.video || (!!m.local && !isImageMessage(m));
}

/** [{user, reaction}] -> [{reaction, users}] keeping first-seen order */
export function groupReactions(reactions: TMessyMessageReaction[] = []) {
  const map = new Map<string, { reaction: TReactionItem; users: TUser[] }>();
  for (const r of reactions) {
    const entry = map.get(r.reaction.key) ?? {
      reaction: r.reaction,
      users: [],
    };
    entry.users.push(r.user);
    map.set(r.reaction.key, entry);
  }
  return [...map.values()];
}

/** One-line summary of a message, for reply quotes. */
export function previewText(m: TMessyMessage, texts: TMessyTexts) {
  if (m.text) {
    return m.text;
  }
  if (isImageMessage(m)) {
    return texts.photo;
  }
  if (isVideoMessage(m)) {
    return texts.video;
  }
  return m.location ? m.location.name || texts.location : '';
}

/** "You" for the current user, otherwise the user name. */
export function displayName(
  user: TUser | undefined,
  me: TUser | undefined,
  texts: TMessyTexts
) {
  return user?.id != null && user.id === me?.id
    ? texts.you
    : user?.userName ?? '';
}
