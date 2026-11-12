import dayjs from 'dayjs';

import type { TMessyItem, TMessyMessage, TUser } from '../types';

const DEFAULT_GROUP_INTERVAL = 5 * 60 * 1000;

/** `older` and `newer` are adjacent in time; can they share one bubble group? */
function isGrouped(
  older: TMessyMessage,
  newer: TMessyMessage,
  interval: number
) {
  if (older.type === 'system' || newer.type === 'system') {
    return false;
  }
  if (older.user?.id !== newer.user?.id) {
    return false;
  }
  if (!newer.createdTime) {
    return true;
  }
  if (!older.createdTime) {
    // newer starts a day section, see showDay
    return false;
  }
  const a = dayjs(older.createdTime);
  const b = dayjs(newer.createdTime);
  return a.isSame(b, 'day') && Math.abs(b.diff(a)) <= interval;
}

/**
 * Annotates messages (newest first, as rendered by the inverted list) with
 * grouping info. Computed once per `messages` change so FlashList re-renders
 * neighbours whose position changed.
 */
export function buildItems(
  messages: TMessyMessage[],
  userId: TUser['id'],
  groupInterval = DEFAULT_GROUP_INTERVAL
): TMessyItem[] {
  let latestOwnFound = false;
  return messages.map((message, index) => {
    const older = messages[index + 1];
    const newer = messages[index - 1];
    const isOwn = userId != null && message.user?.id === userId;
    const showDay =
      !!message.createdTime &&
      (!older?.createdTime ||
        !dayjs(older.createdTime).isSame(message.createdTime, 'day'));
    const startsGroup = !older || !isGrouped(older, message, groupInterval);
    const endsGroup = !newer || !isGrouped(message, newer, groupInterval);
    const isLatestOwn = isOwn && !latestOwnFound && message.type !== 'system';
    if (isLatestOwn) {
      latestOwnFound = true;
    }
    return {
      message,
      index,
      isOwn,
      showDay,
      isLatestOwn,
      position: startsGroup
        ? endsGroup
          ? 'single'
          : 'first'
        : endsGroup
        ? 'last'
        : 'middle',
    };
  });
}
