import { createContext } from 'react';

export const globalInitValue = {
  difficulty: 2,
  time: 60,
  record: 0,
};

export const GlobalContext = createContext(globalInitValue);
