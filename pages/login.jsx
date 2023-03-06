import { ConnectWallet, useAddress, Web3Button } from "@thirdweb-dev/react";
import { isFeatureEnabled } from "@thirdweb-dev/sdk";
import Link from "next/link";
import { contractAddress } from "../const/yourDetails";
import styles from "../styles/Home.module.css";

export default function Login() {
  const address = useAddress(); // Get the user's address

  const claimToken = async (contract) => {
    try {
      if (isFeatureEnabled(contract.abi, "ERC1155")) {
        await contract.erc1155.claim(0, 1);
      } else if (isFeatureEnabled(contract.abi, "ERC721")) {
        await contract.erc721.claim(1);
      } else if (isFeatureEnabled(contract.abi, "ERC20")) {
        await contract.erc20.claim(1);
      }
    } catch (error) {
      console.error("Error claiming token", error);
      alert("There was an error claiming the token. Please try again.");
    }
  };

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
        You cannot access the{" "}
        <Link className={styles.purple} href="/">
          main page
        </Link>{" "}
        unless you own an NFT from our collection!
      </p>

      <hr className={styles.divider} />

      <>
        {address ? (
          <p>
            Welcome, {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        ) : (
          <p>Please connect your wallet to continue.</p>
        )}

        <ConnectWallet accentColor="#F213A4" />

        <p>
          For demo purposes, you can claim an NFT from our collection below:
        </p>

        <Web3Button
          contractAddress={contractAddress}
          action={(contract) => claimToken(contract)}
          accentColor="#F213A4"
        >
          Claim token
        </Web3Button>
      </>
    </div>
  );
}
