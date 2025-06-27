import { useWeb3 } from '../../context/Web3Context';
import MetaMaskError from './MetaMaskError';
import './ConnectButton.css';

const ConnectButton = () => {
  const { account, isLoading, error, connect } = useWeb3();

  if (isLoading) return <div className="connect-loading">Loading...</div>;

  return (
    <div className="connect-button-container">
      {error && <MetaMaskError error={error} />}
      
      {account ? (
        <div className="connected-account">
          Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
        </div>
      ) : (
        <button 
          onClick={connect}
          className="connect-button"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default ConnectButton; // Make sure this is a default export