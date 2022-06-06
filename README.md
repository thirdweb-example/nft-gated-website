# NFT Gated Website

This project demonstrates how you can restrict content on your website to only those users who own an NFT from your collection.

We use an [Edition Drop](https://portal.thirdweb.com/pre-built-contracts/edition-drop) contract to enable users to claim one of the NFTs, and show users the restricted content once we detect they have at least one of the NFTs claimed.

## Tools:

- [thirdweb React SDK](https://docs.thirdweb.com/react): To access hooks such as [useAddress](https://portal.thirdweb.com/react/react.useaddress) to view the connected wallet address, [useMetamask](https://portal.thirdweb.com/react/react.usemetamask) to connect user's wallets, and [useEdition](https://portal.thirdweb.com/react/react.useeditiondrop) to interact with the Edition Drop we deployed via the [dashboard](https://thirdweb.com/dashboard).
- [thirdweb TypeScript SDK](https://docs.thirdweb.com/typescript): We're using the [ThirdwebProvider](https://docs.thirdweb.com/react) to configure the Network we want our user's to be on, and to check the NFTs that the user owns from our collection using the [getOwned](https://portal.thirdweb.com/pre-built-contracts/edition-drop#nfts-owned-by-a-specific-wallet) function.

## Using This Repo

- Create an Edition Drop contract via the thirdweb dashboard on the Polygon Mumbai (MATIC) test network.

- Clone this repository by running:

```bash
npx create-tw-app --example nft-gated-website
```

- Replace the address in `useEditionDrop` with your Edition Drop contract address from the dashboard.

# Guide

## Setting Up the ThirdwebProvider

Inside [index.js](./src/index.js), we are wrapping our application with the [ThirdwebProvider](https://docs.thirdweb.com/react) component, which allows us to configure the **Network** we want our user's to be on, which we have set to `ChainId.Mumbai` in this demo.

```tsx
<ThirdwebProvider desiredChainId={activeChainId} walletConnectors={connectors}>
  <Component {...pageProps} />
</ThirdwebProvider>
```

This allows us to access all of the React SDK's hooks throughout our application.

## Connecting User's Wallets

We're using the [useMetamask](https://portal.thirdweb.com/react/react.usemetamask) hook to connect user's MetaMask wallets.

```tsx
const connectWithMetamask = useMetamask();
```

We can detect when a user's wallet is connected to the site using the [useAddress](https://portal.thirdweb.com/react/react.useaddress) hook.

```tsx
const address = useAddress();
```

If the `address` is undefined, we show the user a welcome page, and ask them to connect with their MetaMask wallet.

## Checking User's NFTs

We use the Typescript SDK to check the user's NFTs using the [getOwned](https://portal.thirdweb.com/pre-built-contracts/nft-drop#nfts-owned-by-a-specific-wallet) function.

```tsx
const nfts = await editionDrop.getOwned(address);
```

If the user has at least one NFT, we show the user the restricted content!

## Minting a new NFT

When the user doesn't have an NFT from our collection in their connected wallet, we show them a page that allows them to mint a new NFT.

We use the [claim](https://portal.thirdweb.com/pre-built-contracts/nft-drop#minting--claiming-nfts) function to mint a new NFT for the user.

```tsx
await editionDrop.claim(0, 1); // 0 is the tokenId, 1 is the quantity of NFTs to mint
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
