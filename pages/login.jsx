import { ConnectWallet, useAddress, Web3Button } from "@thirdweb-dev/react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

// replace this with your contract address
const contractAddress = "0x9c1361fFA29445297711ce5cE5275EFF3D2a79c0";

export default function Login() {
  const address = useAddress(); // Get the user's address

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>
        Exclusive and Early Access to Some Exciting Information
      </h1>

      <p className={styles.explain}>
        brought to you by{" "}
        <b>
          <a
            href="https://www.mantle.xyz/developers"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mantleGreen}
          >
            Team Mantle
          </a>
        </b>
      </p>

      <hr className={styles.divider} />

      <p></p>
      <p></p>

      <h1 className={styles.h2}>Step 1</h1>
      <p>Connect your wallet with Mantle Testnet.</p>
      <>
        {address ? (
          <p>
            Connected to {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        ) : (
          <p></p>
        )}

        <ConnectWallet accentColor="#65b3ae"/>
      </>

      <p></p>
      <p></p>

      <h1 className={styles.h2}>Step 2</h1>
      <p>Please click on the &quot;Claim NFT&quot; that gives you the access.</p>

      <Web3Button
        contractAddress={contractAddress}
        action={(contract) => contract.erc1155.claim(0, 1)}
        accentColor="#65b3ae"
      >
        Claim NFT
      </Web3Button>

      <p></p>
      <p></p>

      <h1 className={styles.h2}>Step 3</h1>
      <p>Once the transaction is confirmed, click on &quot;Are you ready&quot; below.</p>

      <p className={styles.explain}>
        {" "}
        <Link className={styles.mantleGreen} href="/">
          Are You Ready?
        </Link>{" "}
      </p>

      <hr className={styles.divider} />
    </div>
  );
}
