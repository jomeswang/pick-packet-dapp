import { createContext } from 'react';

export const globalInitValue = {
  difficulty: 2,
  time: 60,
  record: 0,
  setDifficulty: null as any,
  setTime: null as any,
  setRecord: null as any,
};

export const GlobalContext = createContext(globalInitValue);
