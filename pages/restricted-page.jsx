import React from "react";
import * as cookie from "cookie";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import styles from "../styles/Home.module.css";

export default function RestrictedPage({ canSeeContent }) {
  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>Restricted Content Page!</h1>
      <p className={styles.explain}>{canSeeContent.toString()}</p>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const parsedCookies = cookie.parse(context.req.headers.cookie);

  const authToken = parsedCookies["access_token"];
  console.log(authToken);

  // Validate the authentication token
  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.ADMIN_PRIVATE_KEY,
    "mumbai"
  );

  // Authenticate token with the SDK
  const domain = "thirdweb.com";
  const address = await sdk.auth.authenticate(domain, authToken);

  // Now view the balance of the authenticated user in this NFT Collection

  // Now check if the user meets the criteria to see this content
  // (e.g. they own an NFT from the collection)
  const editionDrop = sdk.getEditionDrop(
    "0x1fCbA150F05Bbe1C9D21d3ab08E35D682a4c41bF" // replace this with your contract address
  );

  // Get addresses' balance of token ID 0
  const balance = await editionDrop.balanceOf(address, 0);

  // If the balance is greater than 0, then the user can see the content
  const canSeeContent = balance > 0;

  return {
    props: {
      canSeeContent,
    },
  };
}
