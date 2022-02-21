import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import { useEffect, useContext } from 'react';
import { connectWallet } from '@/hooks/useConnectWallet';
import { GlobalContext } from '@/context/globalContext';

const _initWeb3Modal = () => {
  let web3Modal: Web3Modal;
  return () => {
    if (web3Modal) {
      return web3Modal;
    }
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: 'c5ed47c6f6ee496686c8edd9f8226ec6', // required
          rpc: {
            80001: 'https://matic-mumbai.chainstacklabs.com',
          },
          chainId: 80001,
        },
      },
    };
    web3Modal = new Web3Modal({
      providerOptions, // required
      cacheProvider: true,
    });
    return web3Modal;
  };
};

export const getWeb3Modal = _initWeb3Modal();

export const useInitWeb3Modal = () => {
  const globalContext = useContext(GlobalContext);
  useEffect(() => {
    getWeb3Modal();
    if (window.ethereum?.isConnected()) {
      connectWallet(globalContext);
    }
  }, []);
};
