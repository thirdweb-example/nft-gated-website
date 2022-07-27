import { useAddress, useMetamask, useSDK } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  const [loadingAuthStatus, setLoadingAuthStatus] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Wallet & Network Information
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  // Get an instance of our SDK to access sdk.auth
  const sdk = useSDK();

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

    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      const data = await response.json();
      console.log(data);
      alert(data.error);
    }
  }

  async function signOut() {
    await fetch("/api/logout", {
      method: "POST",
    });

    setIsAuthenticated(false);
  }

  // When the page loads, check if the user is already authenticated via the cookie using the /authenticate route.
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/authenticate", {
        method: "POST",
      });

      if (res.ok) {
        setIsAuthenticated(true);
      }
      setLoadingAuthStatus(false);
    })();
  }, []);

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

      {loadingAuthStatus ? (
        <p>Checking authentication status...</p>
      ) : isAuthenticated && address ? (
        <>
          <b>You are connected and authenticated!</b>

          <button
            className={styles.secondaryButton}
            style={{ width: 256, margin: 24 }}
            onClick={signOut}
          >
            Logout
          </button>

          <p>Welcome, {address.slice(0, 6)}...</p>

          <button
            className={styles.mainButton}
            style={{ width: 256 }}
            onClick={() => router.push(`/restricted-page`)}
          >
            View Restricted Page
          </button>
        </>
      ) : (
        <>
          <button
            className={styles.mainButton}
            style={{ width: "fit-content", paddingRight: 16, paddingLeft: 16 }}
            onClick={() => (address ? signIn() : connectWithMetamask())}
          >
            {address ? "Sign In With Ethereum" : "Connect Wallet"}
          </button>
        </>
      )}
    </div>
  );
}
