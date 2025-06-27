// src/utils/web3.js

export const checkMetaMask = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      throw new Error('User denied account access');
    }
  }
  throw new Error('MetaMask not installed');
};

export const getCurrentAccount = async () => {
  if (!window.ethereum) return null;
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts[0] || null;
};

// Add any additional utility functions as named exports
export const getChainId = async () => {
  if (!window.ethereum) return null;
  return await window.ethereum.request({ method: 'eth_chainId' });
};