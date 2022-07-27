import {
  useAddress,
  useMetamask,
  useSDK,
  useEditionDrop,
  useClaimNFT,
  useNetwork,
  useNetworkMismatch,
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
  async function signIn() {
    // Add the domain of the application users will login to, this will be used throughout the login process
    const domain = "thirdweb.com";

    // Generate a signed login payload for the connected wallet to authenticate with
    const payload = await sdk.auth.login(domain);

    // Make api request to server
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    });

    console.log(response);
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

      {address ? (
        <button
          className={styles.mainButton}
          style={{ width: "fit-content", paddingRight: 16, paddingLeft: 16 }}
          onClick={signIn}
        >
          Sign In With Ethereum
        </button>
      ) : (
        <button onClick={connectWithMetamask} className={styles.mainButton}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
