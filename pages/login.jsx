
import {
  ConnectWallet,
  useAddress,
  Web3Button,
  useContract,
  useNFT,
  ThirdwebNftMedia,
  useUser,
} from "@thirdweb-dev/react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useRef } from "react";
import { useRouter } from "next/router";

// replace this with your contract address
const contractAddress = "0x77fd5D3EF77b9cB63546e88450bCED44550e580a";

export default function Login() {
  const address = useAddress(); // Get the user's address
  const { contract } = useContract(contractAddress);
  const { data: nft, isLoading } = useNFT(contract, 1);
  const { isLoggedIn } = useUser();
  const router = useRouter();
  const prevIsLoggedInRef = useRef(isLoggedIn);

  if (prevIsLoggedInRef.current === false && isLoggedIn === true) {
    router.push("/");
  }
  prevIsLoggedInRef.current = isLoggedIn;

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Auth - NFT Gated Content</h1>
      <p className={styles.explain}>
        Serve exclusive content to users who own an NFT from your collection,
        using{" "}
        <b>
          <a
              href='https://portal.thirdweb.com/building-web3-apps/authenticating-users'
              target='_blank'
              rel='noopener noreferrer'
            className={styles.purple}
          >
            Auth
          </a>
        </b>
        !
      </p>

      <p className={styles.explain}>
        You cannot access the{" "}
        <Link className={styles.purple} href='/'>
                    main page
        </Link>{" "}
        unless you own an NFT from our collection!
      </p>

      <hr className={styles.divider} />

      <>
        {address ? (
          <p>
            Welcome, {address?.slice(1, 6)}...{address?.slice(-4)}
          </p>
        ) : (
          <p>Please connect your wallet to continue.</p>
        )}

<ConnectWallet accentColor='#F213A4' />

        <p>
          For demo purposes, you can claim an NFT from our collection below:
        </p>

        <div>
          {!isLoading && nft ? (
            <ThirdwebNftMedia metadata={nft.metadata} />
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <Web3Button
          contractAddress={contractAddress}
          action={(contract) => contract.erc1155.claim(1, 1)}
           accentColor='#F213A4'
        >
          Claim NFT
        </Web3Button>
      </>
    </div>
  );
}
