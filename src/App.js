import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';

function App() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  return (
    <div>
      {address ? (
        <>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
          <p>Your address: {address}</p>
        </>
      ) : (
        <button onClick={connectWithMetamask}>Connect with Metamask</button>
      )}
    </div>
  );
}

export default App;
