import React from "react";
import * as cookie from "cookie";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import styles from "../styles/Home.module.css";

// Here, canSeeContent will be true or false. It will be true if:
// - the user has authenticated with their wallet (signed the login message)
// - the user owns an NFT from our collection.
// Content will be undefined unless the "canSeeContent" is true.
export default function RestrictedPage({ canSeeContent, content }) {
  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>Restricted Content Page!</h1>

      {canSeeContent ? (
        <>
          <p className={styles.explain}>
            Thanks for being a member of our community! Here is your content:
          </p>
          <p>{content}</p>
        </>
      ) : (
        <p>
          You cannot view this content because you do not own an NFT from our
          collection.
        </p>
      )}
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const parsedCookies = cookie?.parse(context?.req?.headers?.cookie || "");

  const authToken = parsedCookies?.["access_token"];

  if (!authToken) {
    return {
      props: {
        canSeeContent: false,
      },
    };
  }

  console.log(authToken);

  const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error(
      "You need to add an ADMIN_PRIVATE_KEY environment variable."
    );
  }

  // Validate the authentication token
  const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, "mumbai");

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

  let content;
  if (canSeeContent) {
    // Here is where you would make a request to load some content, such as from a database.
    content = "Here is some restricted content since you own an NFT!";
  }

  return {
    props: {
      canSeeContent,
      content,
    },
  };
}
