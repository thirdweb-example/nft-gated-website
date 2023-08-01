import { ConnectWallet } from "@thirdweb-dev/react";
import Image from "next/image";
import styles from "../styles/Header.module.css";

export const Header = () => {
  return (
    <nav className={styles.header}>
      <Image
        src="/thirdweb.svg"
        alt="thirdweb"
        width={52}
        height={32}
        className={styles.logo}
      />
      <ConnectWallet theme="dark" />
    </nav>
  );
};
