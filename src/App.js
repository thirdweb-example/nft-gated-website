import { useAddress, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import "./styles.css";

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const nftDrop = useNFTDrop("0x022c29E13D181548BB3d1cE387D00e53a476A391");
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
      <button className="connect-metamask btn" onClick={connectWithMetamask}>
        Connect with Metamask
      </button>
    );
  }

  if (hasClaimedNFT) {
    return <div>🎉 You have a membership NFT!</div>;
  }

  return (
    <div>
      <p>Your address: {address}</p>
      <button disabled={isClaiming} onClick={mintNft}>
        Mint NFT
      </button>
    </div>
  );
};

export default App;
