import { ethers } from 'ethers';
import { Toast } from 'antd-mobile';
import { getWeb3Modal } from '@/hooks/useWeb3Modal';
import { GlobalContextType } from '@/context/globalContext';

// 切换为所需要的 Mumbai 测试网络
const switchNetWork = async () => {
  if (!window.ethereum) {
    throw new Error(
      '未检测到MetaMask插件，请先安装或者使用WalletConnect方式连接钱包',
    );
  }
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13881',
              chainName: 'Mumbai',
              rpcUrls: [
                'https://matic-mumbai.chainstacklabs.com',
                'https://rpc-mumbai.maticvigil.com',
                'https://matic-testnet-archive-rpc.bwarelabs.com',
              ],
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
                blockExplorerUrls: 'https://mumbai.polygonscan.com',
              },
            },
          ],
        });
      } catch (addError) {
        // handle "add" error
        Toast.show({
          content: '添加网络错误',
          position: 'top',
        });
      }
    }
    // handle other "switch" errors
  }
};

// 连接钱包hook
export const connectWallet = async (
  globalContext: GlobalContextType,
  type = '',
) => {
  const web3Modal = getWeb3Modal();
  try {
    let instance;
    if (type) {
      instance = await web3Modal.connectTo(type);
    } else {
      await switchNetWork();
      instance = await web3Modal.connect();
    }
    const providerc = new ethers.providers.Web3Provider(instance);

    const signerc = providerc.getSigner();
    const addressc = await signerc.getAddress();
    globalContext.setAddress(addressc);
    globalContext.setProvider(providerc);
  } catch (error: any) {
    Toast.show({
      content: `Connect the wallect error${error}`,
      position: 'top',
    });
    console.log('error', error);
  }
};
