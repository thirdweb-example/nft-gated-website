# Token Gated Website

This project demonstrates how you can restrict content on your website to only those users who own a token of your choice (any ERC-20, ERC-721 or ERC-1155).

You can use any token you like regardless if it's deployed using thirdweb or not. However, if the contract wasn't deployed on thirdweb initially, make sure you import the contract on the thirdweb dashboard.

## Tools:

- [React SDK](https://portal.thirdweb.com/react): To access the connected wallet, switch the user's network, and claim an NFT from our Edition Drop collection.
- [Auth](https://portal.thirdweb.com/auth): To ask users to sign a message and verify they own the wallet they claim to be, while on the server-side.

## Using This Template

Create a project using this example:

```bash
npx thirdweb create --template nft-gated-website
```

- Deploy or import an already deployed token contract on thirdweb dashboard.
- Update the information in the [yourDetails.js](./const/yourDetails.js) file to use your contract address and auth domain name.
- Add your wallet's private key as an environment variable in a `.env.local` file called `THIRDWEB_AUTH_PRIVATE_KEY`:

```text title=".env.local"
THIRDWEB_AUTH_PRIVATE_KEY=your-wallet-private-key
```

## How It Works

Using [Auth](https://portal.thirdweb.com/auth), we can verify a user's identity on the server-side, by asking them to sign a message and verify they own the wallet they claim to be, and validating the signature.

When we verified the user's identity on the server-side, we check their wallet to see if they have an NFT from our collection. We can then serve different content and restrict what pages they can access based on their NFT balance.

```jsx
// This is the chain your dApp will work on.
const activeChain = "mumbai";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      authConfig={{
        domain: domainName,
        authUrl: "/api/auth",
      }}
    >
      <Head>
        <title>NFT Gated Website</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Learn how to use the thirdweb Auth SDK to create an NFT Gated Website"
        />
      </Head>
      <Component {...pageProps} />
      <ThirdwebGuideFooter />
    </ThirdwebProvider>
  );
}

export default MyApp;
```

Next, we need to create a configuration file that contains our wallet's private key (used to generate messages for users to sign) and our site's domain name:

This file is called `auth.config.js` and is at the root of the project.

```jsx
import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { domainName } from "./const/yourDetails";

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: domainName,
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
});
```

Finally, we have a [catch-all API route](https://nextjs.org/docs/api-routes/dynamic-api-routes#catch-all-api-routes) called `pages/api/auth/[...thirdweb].js`, which exports the `ThirdwebAuthHandler` to manage all of the required auth endpoints like `login` and `logout`.

```jsx
import { ThirdwebAuthHandler } from "../../../auth.config";

export default ThirdwebAuthHandler();
```

## Restricting Access

To begin with, the user will reach the website with no authentication.

When they try to access the restricted page (the `/` route), we use [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) to check two things:

1. If the user is currently authenticated (using `getUser`).
2. If the user's wallet balance is greater than `minTokensRequired` provided in `yourDetails.js` of the NFTs in our NFT collection.

If either of these checks is `false`, we redirect the user to the `/login` page before they are allowed to access the restricted page.

Let's break that down into steps:

### Setting Up the Auth SDK

Inside the [\_app.jsx](./pages/_app.jsx) file, we configure the Auth SDK in the `ThirdwebProvider` component that wraps our application, allowing us to use the hooks of the SDK throughout our application:

### Checking For Authentication Token

First, we check if this user has already been authenticated.

If this is the first time the user has visited the website, they will not have an `access_token` cookie.

```js
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

  // ...
}
```

If the user is not authenticated, then we don't check the user's wallet balance; we just immediately redirect them to the `/login` page.

If there _is_ a detected user from `getUser`, we can then check their balance.

### Checking Wallet Balance

Now we're ready to check the user's wallet balance.

To do this, we have created a utility function called [checkBalance](./util/checkBalance.js) that we can use to check the user's balance for a given NFT.

```js
import { isFeatureEnabled } from "@thirdweb-dev/sdk";
import {
  contractAddress,
  erc1155TokenId,
  minimumBalance,
} from "../const/yourDetails";

export default async function checkBalance(sdk, address) {
  const contract = await sdk.getContract(
    contractAddress // replace this with your contract address
  );

  let balance;

  if (isFeatureEnabled(contract.abi, "ERC1155")) {
    balance = await contract.erc1155.balanceOf(address, erc1155TokenId);
  } else if (isFeatureEnabled(contract.abi, "ERC721")) {
    balance = await contract.erc721.balanceOf(address);
  } else if (isFeatureEnabled(contract.abi, "ERC20")) {
    balance = (await contract.erc20.balanceOf(address)).value;
    return balance.gte((minimumBalance * 1e18).toString());
  }

  // gte = greater than or equal to
  return balance.gte(minimumBalance);
}
```

This function will check the type of contract being used, check the balance accordingly and returns true or false that we can store in a variable:

```js
const hasNft = await checkBalance(sdk, address);
```

Here's our final check, if the user has a `balance` of `0`, then we redirect them to the `/login` page.

```js
// If they don't have an NFT, redirect them to the login page
if (!hasNft) {
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}
```

If the user gets past these checks, then we allow them to view the restricted page.

```js
// Finally, return the props
return {
  props: {},
};
```

## Signing In

We've now successfully restricted access to our home page, now let's explore the `/login` page.

We use the `ConnectWallet` component to handle the connection to the user's wallet, signing in, and signing out.

```js
<ConnectWallet />
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
