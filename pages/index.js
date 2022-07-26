import {
  useAddress,
  useDisconnect,
  useMetamask,
  useSDK,
  useEditionDrop,
  useClaimNFT,
  useNetwork,
  useNetworkMismatch,
  ChainId,
} from "@thirdweb-dev/react";

export default function Home() {
  // Wallet & Network Information
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  const sdk = useSDK();

  // For user to claim an NFT to then view the restricted content
  const editionDropContract = useEditionDrop(
    "0x1fCbA150F05Bbe1C9D21d3ab08E35D682a4c41bF"
  );
  const { mutate: claimNft } = useClaimNFT(editionDropContract);

  async function requestAuthenticatedContent() {
    // Add the domain of the application users will login to, this will be used throughout the login process
    const domain = "thirdweb.com";

    // Generate a signed login payload for the connected wallet to authenticate with
    const loginPayload = await sdk.auth.login(domain);
    console.log(loginPayload);

    // Make api request to server
    const response = await fetch(`/api/get-restricted-content`, {
      method: "POST",
      body: JSON.stringify({
        loginPayload,
      }),
    });

    console.log(response);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      alert(`Here's your content: ${data.message}`);
    } else {
      alert("Unauthorized!");
    }
  }

  return (
    <div>
      {address ? (
        <>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
          <p>Your address: {address}</p>

          <button
            onClick={() => {
              if (networkMismatch) {
                switchNetwork(ChainId.Mumbai);
                return;
              }
              claimNft({
                quantity: 1,
                tokenId: 0,
                to: address,
              });
            }}
          >
            Claim NFT
          </button>

          <button onClick={() => requestAuthenticatedContent()}>
            Request Access
          </button>
        </>
      ) : (
        <button onClick={connectWithMetamask}>Connect with Metamask</button>
      )}
    </div>
  );
}
