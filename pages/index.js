import {
  useAddress,
  useMetamask,
  useSDK,
  useEditionDrop,
  useClaimNFT,
  useNetwork,
  useNetworkMismatch,
  ChainId,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

export default function Home() {
  // Wallet & Network Information
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  // Hooks to ensure user is on the right network
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  // Get an instance of our SDK to access sdk.auth
  const sdk = useSDK();

  // For user to claim an NFT to then view the restricted content
  const editionDropContract = useEditionDrop(
    "0x1fCbA150F05Bbe1C9D21d3ab08E35D682a4c41bF" // replace this with your contract address
  );

  // Hook to claim NFTs from the NFT drop (to allow users to claim and *then* view the restricted content)
  const { mutate: claimNft, isLoading: isClaiming } =
    useClaimNFT(editionDropContract);

  // Load NFTs owned by the connected wallet
  const { data: ownedNfts, isLoading: loadingOwned } = useOwnedNFTs(
    editionDropContract,
    address
  );

  // Function to make a request to our /api/get-restricted-content route to check if we own an NFT.
  async function requestAuthenticatedContent() {
    // Add the domain of the application users will login to, this will be used throughout the login process
    const domain = "thirdweb.com";

    // Generate a signed login payload for the connected wallet to authenticate with
    const loginPayload = await sdk.auth.login(domain);

    // Make api request to server
    const response = await fetch(`/api/get-restricted-content`, {
      method: "POST",
      body: JSON.stringify({
        loginPayload,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      alert(`Here's your content: ${data.message}`);
    } else {
      alert(
        "Unauthorized! You don't own an NFT, so you can't view the content, sorry!"
      );
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>Auth - NFT Gated Content</h1>
      <p className={styles.explain}>
        Serve exclusive content to users who own an NFT from your collection,
        using{" "}
        <b>
          <a
            href="https://portal.thirdweb.com/building-web3-apps/authenticating-users"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.purple}
          >
            Auth
          </a>
        </b>
        !
      </p>

      <hr className={styles.divider} />

      <div className={styles.contractBoxGrid}></div>

      {address ? (
        <>
          <p>To access the restricted content, you must own an NFT!</p>

          <p>
            This wallet owns <b>{ownedNfts?.length || "Loading..."}</b> NFTs in
            the collection.
          </p>

          <button
            className={styles.secondaryButton}
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
            {!isClaiming ? " Claim An NFT" : "Claiming..."}
          </button>

          <hr className={styles.smallDivider} />

          <p style={{ marginTop: 32 }}>
            Because you{" "}
            {loadingOwned ? "Loading..." : ownedNfts?.length > 0 ? "" : "don't"}{" "}
            own one, the API request for restricted access to the content should{" "}
            <b>
              {loadingOwned
                ? "Loading..."
                : ownedNfts?.length > 0
                ? "Succeed"
                : "Fail"}
            </b>
            !
          </p>

          <button
            className={styles.mainButton}
            onClick={() => requestAuthenticatedContent()}
          >
            Request Content
          </button>
        </>
      ) : (
        <button onClick={connectWithMetamask} className={styles.mainButton}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
