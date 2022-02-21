/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-ethers');

module.exports = {
  defaultNetwork: 'matic',
  networks: {
    hardhat: {},
    matic: {
      url: 'https://rpc-mumbai.maticvigil.com',
    },
  },
  paths: {
    sources: './src',
  },
  solidity: {
    version: '0.8.3',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
