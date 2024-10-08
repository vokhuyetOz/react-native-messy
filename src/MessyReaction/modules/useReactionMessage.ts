import { SetStateAction, useEffect, useState, Dispatch } from 'react';
import {
  TMessyMessageContentReaction,
  TReactionItem,
  TUser,
  TUseReaction,
} from '../../types';

const listeners = new Set<Dispatch<SetStateAction<TUseReaction | undefined>>>();

export const REACTION_DATA: TReactionItem[] = [
  {
    key: '1',
    value: '😀',
  },
  {
    key: '2',
    value: '🥰',
  },
  {
    key: '3',
    value: '🤩',
  },
  {
    key: '4',
    value: '😔',
  },
  {
    key: '5',
    value: '😱',
  },
  {
    key: '6',
    value: '🤡',
  },
];

let defaultData: TUseReaction | undefined;
export const setReactionMessage = (e?: TUseReaction) => {
  defaultData = e;
  listeners.forEach((listener) => listener(e));
};

export const useReactionMessage = () => {
  const [data, setData] = useState<TUseReaction | undefined>(defaultData);

  useEffect(() => {
    listeners.add(setData);

    return () => {
      listeners.delete(setData);
    };
  }, []);

  return data;
};
/**
 * convert [{id:'', user:{}, react:{}}] to [{users:[], react:{}}, {users:[], react:{}}]
 * @param reactions
 * @returns
 */
export const useReactionConverter = (
  reactions: Array<TMessyMessageContentReaction> = []
) => {
  const objectByKey: {
    [key: string]: { users: Array<TUser>; react: TReactionItem };
  } = {};
  for (const element of reactions) {
    if (!objectByKey[element.reaction.key]) {
      objectByKey[element.reaction.key] = {
        users: [],
        react: element.reaction,
      };
    }
    objectByKey[element.reaction.key].users.push(element.user);
  }
  return { objectByKey, list: Object.values(objectByKey) };
};
