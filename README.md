# NFT Gated Website

This project demonstrates how you can restrict content on your website to only those users who own an NFT from your collection.

We use an [Edition Drop](https://portal.thirdweb.com/pre-built-contracts/edition-drop) contract to enable users to claim one of the NFTs, and serve users
the restricted content if they have at least one of the NFTs claimed.

## Tools:

- [React SDK](https://docs.thirdweb.com/react): To access the connected wallet, switch the user's network, and claim an NFT from our Edition Drop collection.
- [Auth](https://portal.thirdweb.com/building-web3-apps/authenticating-users): To ask users to sign a message and verify they own the wallet they claim to be, while on the server-side.

## Using This Template

Create a project using this example:

```bash
npx thirdweb create --nft-gated-website
```

- Create an [Edition Drop](https://thirdweb.com/contracts/new/pre-built/drop/edition-drop) contract using the dashboard.
- Update the information in the [yourDetails.js](./const/yourDetails.js) file to use your contract address and auth domain name.
- Add your wallet's private key as an environment variable in a `.env.local` file called `PRIVATE_KEY`:

```text title=".env.local"
PRIVATE_KEY=your-wallet-private-key
```

## How It Works

Using [Auth](https://portal.thirdweb.com/building-web3-apps/authenticating-users), we can verify a user's identity on the server-side, by asking them to sign a message and verify they own the wallet they claim to be, and validating the signature.

When we verified the user's identity on the server-side, we check their wallet to see if they have an NFT from our collection. We can then serve different content and restrict what pages they can access based on their balance.

## Restricting Access

To begin with, the user will reach the website with no authentication.

When they try to access the restricted page (the `/` route), we use [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) to check two things:

1. If the user is currently authenticated (if they have a **valid** `access_token` cookie).
2. If the user's wallet balance is greater than 0 of the NFTs in our NFT collection.

If either of these checks is `false`, we redirect the user to the `/login` page before they are allowed to access the restricted page.

Let's break that down into steps:

### Checking For Authentication Token

First, we check if this user has already been authenticated.

If this is the first time the user has visited the website, they will not have an `access_token` cookie.

```js
// This gets called on every request
export async function getServerSideProps(context) {
  // Check to see if they have an authentication cookie
  const parsedCookies = cookie?.parse(context?.req?.headers?.cookie || "");
  const authToken = parsedCookies?.["access_token"];

  // if there is no auth token, redirect them to the login page
  if (!authToken) {
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

If there _is_ an authentication token in this user's cookies, we need to **validate** that token is legitimate:

```js
// Instantiate our SDK
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, "mumbai");

// Authenticate token with the SDK
const domain = domainName;
const address = await sdk.auth.authenticate(domain, authToken);
```

Once again, if the token is not valid, then we redirect the user to the `/login` page.

```js
// If the auth token is invalid, redirect them to the login page
if (!address) {
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}
```

### Checking Wallet Balance

Now we're ready to check the user's wallet balance.

To do this, we have created a utility function called [checkBalance](./util/checkBalance.js) that we can use to check the user's balance for a given NFT.

```js
import { contractAddress } from "../const/yourDetails";

export default async function checkBalance(sdk, address) {
  const editionDrop = sdk.getEditionDrop(
    contractAddress // replace this with your contract address
  );

  const balance = await editionDrop.balanceOf(address, 0);

  // gt = greater than
  return balance.gt(0);
}
```

This function returns true or false that we can store in a variable:

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

First, we ask the user to connect their wallet with our `useMetaMask` hook:

```js
const connectWithMetamask = useMetamask();

// ...

<button onClick={() => connectWithMetamask()}>Connect Wallet</button>;
```

Once an `address` is detected from the `useAddress` hook, we show them the `Sign In` button:

```js
{
  address ? (
    <>
      <button onClick={signIn}>Sign In</button>
    </>
  ) : (
    <>
      <button onClick={() => connectWithMetamask()}>Connect Wallet</button>
    </>
  );
}
```

The `Sign In` button calls the `signIn` function, which:

1.  Asks the user to sign a message, and creates a **login payload** with that signature.
2.  Redirects the user to our API route [api/login](./pages/api/login.js), and sends the login payload as a query parameter.

```js
// Function to make a request to our /api/get-restricted-content route to check if we own an NFT.
async function signIn() {
  // Add the domain of the application users will login to, this will be used throughout the login process
  const domain = domainName;
  // Generate a signed login payload for the connected wallet to authenticate with
  const payload = await sdk.auth.login(domain);

  // Make api request to server
  window.location = `/api/login?payload=${JSON.stringify(payload)}`;
}
```

### Generating Auth Tokens

On the [api/login](./pages/api/login.js) route, we:

1. Read in the login payload sent as a query parameter.

```js
// Get signed login payload from the frontend
const payload = JSON.parse(req.query.payload);
```

2. Verify the login payload

```js
// Generate an access token with the SDK using the signed payload
const domain = domainName;
// Verify the token and get the address, so we can check their NFT balance
const address = sdk.auth.verify(domain, payload);
```

3. If the login payload is valid, check the user's wallet balance.

```js
const hasNft = await checkBalance(sdk, address);
```

4. If the user has an NFT, create an authentication token for them.

```js
// At this point, the user has authenticated and owns at least 1 NFT.
// Generate an auth token for them
const token = await sdk.auth.generateAuthToken(domain, payload);
```

5. Set the authentication token as a cookie

```js
// Securely set httpOnly cookie on request to prevent XSS on frontend
// And set path to / to enable access_token usage on all endpoints
res.setHeader(
  "Set-Cookie",
  serialize("access_token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  })
);
```

6. Redirect the user to the homepage

```js
res.redirect("/", 302);
```

If you recall, in the `getServerSideProps` of the home page, we check for this `access_token` cookie. This means if the user refreshes the page while this cookie is still valid, they will be able to view the restricted page _without_ signing in again; assuming they haven't transferred their NFT from this wallet.

### Sign Out

Finally, on the home page, we have a `Sign Out` button for the user, which clears their cookie by sending the user to our [/api/logout](./pages/api/logout.js) route, then sending them back to the login page.

```js
// Set the access token to 'none' and expire in 5 seconds
res.setHeader(
  "Set-Cookie",
  serialize("access_token", "none", {
    path: "/",
    expires: new Date(Date.now() + 5 * 1000),
  })
);

res.redirect("/login", 302);
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
