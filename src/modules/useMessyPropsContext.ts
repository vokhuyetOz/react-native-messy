import { useContext, createContext } from 'react';
import type { IMessyProps } from '../Messy';

export const MessyPropsContext = createContext<IMessyProps>({});

export const useMessyPropsContext = () => {
  const value = useContext(MessyPropsContext);
  return value;
};
