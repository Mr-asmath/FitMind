const MetaMaskError = ({ error }) => {
  if (!error) return null;

  return (
    <div className="metamask-error">
      {error === 'MetaMask not installed' ? (
        <p>
          Please install MetaMask from{' '}
          <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
            metamask.io
          </a>
        </p>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default MetaMaskError; // Default export