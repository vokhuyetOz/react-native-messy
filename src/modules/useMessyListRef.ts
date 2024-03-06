import React from 'react';
import type { FlatList } from 'react-native';

const listRef = React.createRef<FlatList>();

export const useMessyListRef = () => {
  return listRef;
};
let timeout: NodeJS.Timeout;
export const useMessyListAction = () => {
  const scrollToLast = () => {
    timeout = setTimeout(() => {
      listRef.current?.scrollToIndex({ animated: true, index: 0 });
      clearTimeout(timeout);
    }, 300);
  };
  return {
    scrollToLast,
  };
};
