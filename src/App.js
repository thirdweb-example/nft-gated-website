import {
  useAddress,
  useMetamask,
  useNFTDrop,
} from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import Header from "./header";
import "./styles.css";

export default function App() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const nftDrop = useNFTDrop(
    "0x022c29E13D181548BB3d1cE387D00e53a476A391"
  );
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const nfts = await nftDrop.getOwned(address);
        setHasClaimedNFT(nfts?.length > 0);
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get NFTs", error);
      }
    };
    checkBalance();
  }, [address, nftDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await nftDrop.claim(1);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!address) {
    return (
      <button
        className="btn connect-metamask"
        onClick={connectWithMetamask}
      >
        Connect with Metamask
      </button>
    );
  }

  if (hasClaimedNFT) {
    return (
      <>
        <Header />
        <h2>🎉 You have a membership NFT! 🎉</h2>
      </>
    );
  }

  function truncateAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return (
    <>
      <Header />
      <div className="container">
        <p className="address">
          Your address:{" "}
          <span className="value">
            {truncateAddress(address)}
          </span>
        </p>
        <button
          className="btn mint"
          disabled={isClaiming}
          onClick={mintNft}
        >
          Mint NFT
        </button>
      </div>
    </>
  );
}

// export default App;
