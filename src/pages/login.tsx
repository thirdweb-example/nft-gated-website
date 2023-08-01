import {
  ConnectWallet,
  MediaRenderer,
  useContract,
  useContractMetadata,
} from "@thirdweb-dev/react";
import Link from "next/link";
import { contractAddress } from "../../const/yourDetails";
import { Header } from "../components/Header";
import styles from "../styles/Home.module.css";

export default function Login() {
  const { contract } = useContract(contractAddress);
  const { data: contractMetadata } = useContractMetadata(contract);

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
        <h3>Holder exclusive</h3>
        <p>To unlock this product, you need:</p>

        {contractMetadata && (
          <div className={styles.nft}>
            <MediaRenderer
              src={contractMetadata.image}
              alt={contractMetadata.name}
              width="50px"
              height="50px"
            />
            <div className={styles.nftDetails}>
              <h4>{contractMetadata.name}</h4>
            </div>
          </div>
        )}
        <ConnectWallet theme="dark" className={styles.connect} />
      </div>
    </div>
  );
}
