import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import React from "react";
import * as cookie from "cookie";
import styles from "../styles/Home.module.css";
import checkBalance from "../util/checkBalance";
import { domainName } from "../const/yourDetails";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Restricted Access Page</h1>
      <p className={styles.explain}>
        Thanks for being a member of our NFT community!
      </p>

      <a className={styles.mainButton} href={`/api/logout`}>
        Logout
      </a>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  // Check to see if they have an authentication cookie
  const parsedCookies = cookie?.parse(context?.req?.headers?.cookie || "");
  const authToken = parsedCookies?.["access_token"];

  // if there is no auth token, redirect them to the login page
  if (!authToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Ensure we are able to generate an auth token using our private key instantiated SDK
  const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error(
      "You need to add an ADMIN_PRIVATE_KEY environment variable."
    );
  }

  // Instantiate our SDK
  const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, "mumbai");

  // Authenticate token with the SDK
  const domain = domainName;
  const address = await sdk.auth.authenticate(domain, authToken);

  // If the auth token is invalid, redirect them to the login page
  if (!address) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const hasNft = await checkBalance(sdk, address);

  // If they don't have an NFT, redirect them to the login page
  if (!hasNft) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Finally, return the props
  return {
    props: {},
  };
}
