import {
  useAddress,
  useMetamask,
  useNFTDrop,
  useNetworkMismatch,
  ChainId,
  useNetwork,
} from "@thirdweb-dev/react";

import { useState, useEffect } from "react";
import "./styles.css";

// truncates the address so it displays in a nice format
function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function App() {
  // allow user to connect to app with metamask, and obtain address
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const networkMismatched = useNetworkMismatch();
  const [, switchNetwork] = useNetwork(); // Switch network

  // Replace this address with your NFT Drop address!
  const nftDrop = useNFTDrop("0x322067594DBCE69A9a9711BC393440aA5e3Aaca1");
  const [checking, setChecking] = useState(true);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // If they don't have an connected wallet, return
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const nfts = await nftDrop.getOwned(address);
        setHasClaimedNFT(nfts?.length > 0);
        setChecking(false);
        setIsClaiming(false);
      } catch (error) {
        setHasClaimedNFT(false);
        setChecking(false);
        alert(error);
        console.error("Failed to get NFTs", error);
      }
    };
    checkBalance();
  }, [address, connectWithMetamask, networkMismatched, nftDrop, switchNetwork]);

  const mintNft = async () => {
    try {
      // If they don't have an connected wallet, ask them to connect!
      if (!address) {
        connectWithMetamask();
        return;
      }

      // Ensure they're on the right network (mumbai)
      if (networkMismatched) {
        switchNetwork(ChainId.Mumbai);
        return;
      }

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
      <div className="container">
        <h1>Welcome to the Cookie Club</h1>
        <button className="btn" onClick={connectWithMetamask}>
          Connect MetaMask
        </button>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="container">
        <h1>Checking your wallet...</h1>
      </div>
    );
  }

  // if the user is connected and has an NFT from the drop, display text
  if (hasClaimedNFT) {
    return (
      <div>
        <h2>Congratulations! You have a Cookie NFT! 🍪</h2>
      </div>
    );
  }

  // if there are no NFTs from collection in wallet, display button to mint
  return (
    <div className="container">
      <p className="address">
        There are no Cookie NFTs held by:{" "}
        <span className="value">{truncateAddress(address)}</span>
      </p>
      <button className="btn" disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "Claiming..." : "Mint NFT"}
      </button>
    </div>
  );
}
