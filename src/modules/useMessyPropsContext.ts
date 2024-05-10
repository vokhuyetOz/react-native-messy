import { useContext, createContext } from 'react';
import { TMessyProps } from '../types';

export const MessyPropsContext = createContext<TMessyProps>({});

export const useMessyPropsContext = () => {
  const value = useContext(MessyPropsContext);
  return value;
};
