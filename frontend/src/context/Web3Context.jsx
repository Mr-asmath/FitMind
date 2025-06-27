import { createContext, useContext, useEffect, useState } from 'react';
import { checkMetaMask, getCurrentAccount } from '../utils/web3';


// Create context
const Web3Context = createContext();

// Provider component
export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check connection on mount
  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const currentAccount = await getCurrentAccount();
          if (currentAccount) {
            setAccount(currentAccount);
          }
          
          // Get chain ID
          const id = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // Cleanup function
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Event handlers
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // MetaMask is locked or user disconnected all accounts
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (newChainId) => {
    setChainId(newChainId);
    window.location.reload(); // Recommended by MetaMask docs
  };

  // Set up event listeners
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
  }, []);

  // Connect to MetaMask
  const connect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const account = await checkMetaMask();
      setAccount(account);
      
      // Get chain ID after connection
      const id = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if connected to the correct network
  const isCorrectNetwork = (desiredChainId = '0x1') => {
    return chainId === desiredChainId;
  };

  // Switch network
  const switchNetwork = async (chainId = '0x1') => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (err) {
      // This error code indicates the chain hasn't been added to MetaMask
      if (err.code === 4902) {
        setError(`Network with chainId ${chainId} not found in MetaMask`);
      } else {
        setError(err.message);
      }
    }
  };

  // Context value
  const value = {
    account,
    chainId,
    isLoading,
    error,
    connect,
    isCorrectNetwork,
    switchNetwork,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook for consuming context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};