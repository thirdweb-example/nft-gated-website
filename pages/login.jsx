import { useAddress, useMetamask, useSDK } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Login() {
  const router = useRouter();

  // Wallet & Network Information
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  // Get an instance of our SDK to access sdk.auth
  const sdk = useSDK();

  // Function to make a request to our /api/get-restricted-content route to check if we own an NFT.
  async function signIn() {
    // Add the domain of the application users will login to, this will be used throughout the login process
    const domain = "example.org";
    // Generate a signed login payload for the connected wallet to authenticate with
    const payload = await sdk.auth.login(domain);

    // Make api request to server
    window.location = `/api/login?payload=${JSON.stringify(payload)}`;
  }

  return (
    <div className={styles.container}>
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

      <p className={styles.explain}>
        You cannot access the main page unless you own an NFT from our
        collection!
      </p>

      <hr className={styles.divider} />

      {address ? (
        <>
          <p>Welcome, {address.slice(0, 6)}...</p>

          <button
            className={styles.mainButton}
            style={{ width: 256 }}
            onClick={signIn}
          >
            Sign In
          </button>
        </>
      ) : (
        <>
          <button
            className={styles.mainButton}
            style={{ width: "fit-content", paddingRight: 16, paddingLeft: 16 }}
            onClick={() => connectWithMetamask()}
          >
            Connect Wallet
          </button>
        </>
      )}
    </div>
  );
}
