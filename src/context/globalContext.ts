import { providers } from 'ethers';
import { createContext } from 'react';

type ProviderType = providers.Web3Provider;

export const globalInitValue = {
  difficulty: 2,
  time: 60,
  record: 0,
  address: '',
  provider: null as unknown as ProviderType,
  setDifficulty: null as any,
  setTime: null as any,
  setRecord: null as any,
  setAddress: null as any,
  setProvider: null as any,
};

export type GlobalContextType = typeof globalInitValue;

export const GlobalContext = createContext(globalInitValue);
