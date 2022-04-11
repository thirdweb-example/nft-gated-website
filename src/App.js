import { useAddress, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  // allow user to connect to app with metamask, and obtain address
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  //
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

  //if there isn't a wallet connected, display our connect MetaMask button
  if (!address) {
    return (
      <>
        <h1>Welcome to the Cookie Club</h1>
        <button className="btn" onClick={connectWithMetamask}>
          Connect MetaMask
        </button>
      </>
    );
  }

  // if the user is connected and has an NFT from the drop, display text
  if (hasClaimedNFT) {
    return <h2>Congratulations! You have a Cookie NFT! 🍪</h2>;
  }

  // truncates the address so it displays in a nice format
  function truncateAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // if there are no NFTs from collection in wallet, display button to mint
  return (
    <>
      <p className="address">
        There are no Cookie NFTs held by:{" "}
        <span className="value">{truncateAddress(address)}</span>
      </p>
      <button className="btn" disabled={isClaiming} onClick={mintNft}>
        Mint NFT
      </button>
    </>
  );
}

// export default App;
