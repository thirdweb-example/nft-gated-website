## Getting Started

First, intall the required dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/index.js`. The page auto-updates as you edit the file.

On `src/index.js`, you'll find our `ThirdwebProvider` wrapping your app, this is necessary for our hooks to work.

on `src/App.js`, you'll find the `useMetamask` hook that we use to connect the user's wallet to MetaMask, `useDisconnect` that we use to disconnect it, and `useAddress` to check the user's wallet address once connected. 

## Learn More

To learn more about thirdweb, React and CRA, take a look at the following resources:

- [thirdweb React Documentation](https://docs.thirdweb.com/react) - learn about our React SDK.
- [thirdweb TypeScript Documentation](https://docs.thirdweb.com/react) - learn about our JavaScript/TypeScript SDK.
- [thirdweb Portal](https://docs.thirdweb.com/react) - check our guides and development resources.
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started) - learn about CRA features.
- [React documentation](https://reactjs.org/) - learn React.

You can check out [the thirdweb GitHub organization](https://github.com/thirdweb-dev) - your feedback and contributions are welcome!

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).