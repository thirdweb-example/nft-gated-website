import {
  ConnectWallet,
  MediaRenderer,
  useContract,
  useContractMetadata,
  useUser,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getUser } from "../../auth.config";
import { contractAddress } from "../../const/yourDetails";
import { Header } from "../components/Header";
import styles from "../styles/Home.module.css";
import checkBalance from "../util/checkBalance";

const secretKey = process.env.TW_SECRET_KEY;

if (!secretKey) {
  console.log("Missing env var: TW_SECRET_KEY");
  throw new Error("Missing env var: TW_SECRET_KEY");
}

export default function Home() {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();
  const { contract } = useContract(contractAddress);
  const { data: contractMetadata, isLoading: contractLoading } =
    useContractMetadata(contract);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.heading}>NFT Gated Content </h2>
      <h1 className={styles.h1}>Auth</h1>

      <p className={styles.explain}>
        Serve exclusive content to users who own an NFT from <br />
        your collection, using{" "}
        <Link className={styles.link} href="/">
          Auth
        </Link>
        .{" "}
      </p>

      <div className={styles.card}>
        <h3>Exclusive unlocked</h3>
        <p>Your NFT unlocked access to this product.</p>

        {contractMetadata && (
          <div className={styles.nft}>
            <MediaRenderer
              src={contractMetadata.image}
              alt={contractMetadata.name}
              width="70px"
              height="70px"
            />
            <div className={styles.nftDetails}>
              <h4>{contractMetadata.name}</h4>
              <p>{contractMetadata.description}</p>
            </div>
          </div>
        )}
        {contractLoading && <p>Loading...</p>}

        <ConnectWallet theme="dark" className={styles.connect} />
      </div>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const user = await getUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Ensure we are able to generate an auth token using our private key instantiated SDK
  const PRIVATE_KEY = process.env.THIRDWEB_AUTH_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error("You need to add an PRIVATE_KEY environment variable.");
  }

  // Instantiate our SDK
  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.THIRDWEB_AUTH_PRIVATE_KEY,
    "mumbai",
    { secretKey }
  );

  // Check to see if the user has an NFT
  const hasNft = await checkBalance(sdk, user.address);

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
