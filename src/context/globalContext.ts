import { createContext } from 'react';

const globalValue = {
  name: '',
};

export const GlobalContext = createContext(globalValue);
