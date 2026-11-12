import { buildItems } from '../grouping';
import type { TMessyMessage } from '../../types';

const me = { id: 1 };
const other = { id: 2 };
const t = (h: number, m: number, day = 10) => new Date(2026, 10, day, h, m);

// newest first, like the list renders
const messages: TMessyMessage[] = [
  { id: 'f', user: me, text: 'f', createdTime: t(9, 20) },
  { id: 'e', user: me, text: 'e', createdTime: t(9, 3) },
  { id: 'd', user: me, text: 'd', createdTime: t(9, 2) },
  { id: 'c', user: other, text: 'c', createdTime: t(9, 1) },
  { id: 's', type: 'system', text: 'joined', createdTime: t(9, 0) },
  { id: 'b', user: other, text: 'b', createdTime: t(8, 1, 9) },
  { id: 'a', user: other, text: 'a', createdTime: t(8, 0, 9) },
];

describe('buildItems', () => {
  const items = buildItems(messages, me.id);
  const by = (id: string) => items.find((i) => i.message.id === id)!;

  it('groups consecutive messages of one sender within the interval', () => {
    expect(by('a').position).toBe('first');
    expect(by('b').position).toBe('last');
    expect(by('d').position).toBe('first');
    expect(by('e').position).toBe('last');
  });

  it('breaks groups on sender change, system messages and time gaps', () => {
    expect(by('c').position).toBe('single');
    expect(by('s').position).toBe('single');
    expect(by('f').position).toBe('single'); // 17 min after e
  });

  it('marks the first message of each day', () => {
    expect(by('a').showDay).toBe(true);
    expect(by('b').showDay).toBe(false);
    expect(by('s').showDay).toBe(true);
    expect(by('c').showDay).toBe(false);
  });

  it('flags ownership and only the newest own message for status', () => {
    expect(by('f').isOwn).toBe(true);
    expect(by('c').isOwn).toBe(false);
    expect(items.filter((i) => i.isLatestOwn).map((i) => i.message.id)).toEqual(
      ['f']
    );
  });

  it('treats messages without user as not own even with no current user', () => {
    expect(buildItems([{ text: 'x' }], undefined)[0]!.isOwn).toBe(false);
  });
});
