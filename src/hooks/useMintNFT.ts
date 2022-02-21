import { ethers } from 'ethers';
import { GlobalContextType } from '@/context/globalContext';
import QNFT from '@/contracts/QNFT.json';
import { CONTRACT_ADDRESS } from '@/utils/const';

// 调用只能合约中的铸币过程进行
export const mintNFT = async (
  tokenURI: string,
  globalContext: GlobalContextType,
) => {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    QNFT.abi,
    globalContext.provider,
  );
  console.log('globalContext', globalContext);
  const qContract = contract.connect(globalContext?.provider?.getSigner());
  const data = await qContract.mintNFT(globalContext.address, tokenURI);
  return data;
};
