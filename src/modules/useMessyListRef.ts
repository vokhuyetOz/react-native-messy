import React from 'react';
import { FlatList } from 'react-native';

const listRef = React.createRef<FlatList>();

export const useMessyListRef = () => {
  return listRef;
};
let timeout: NodeJS.Timeout;
export const useMessyListAction = () => {
  const scrollToLast = () => {
    timeout = setTimeout(() => {
      try {
        listRef.current?.scrollToIndex({ animated: true, index: 0 });
        clearTimeout(timeout);
      } catch {}
    }, 300);
  };
  return {
    scrollToLast,
  };
};
