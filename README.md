# NFT Gated Website

This project demonstrates how you can restrict content on your website to only those users who own a token of your choice (any ERC-20, ERC-721 or ERC-1155).

You can use any token you like regardless if it's deployed using thirdweb or not. However, if the contract wasn't deployed on thirdweb initially, make sure you import the contract on the thirdweb dashboard.

## Installation

Install via [thirdweb create](https://portal.thirdweb.com/cli/create)

```bash
  npx thirdweb create --template marketplace-v3
```

Edit smart contract details in `const/yourDetails.js`

## Run Locally

Install dependencies

```bash
  # npm
  npm install

  # yarn
  yarn install
```

Start the server

```bash
  # npm
  npm run start

  # yarn
  yarn start
```

## Environment Variables

To run this project, you will need to add environment variables. Check the `.env.example` file for all the environment variables required and add it to `.env.local` file or set them up on your hosting provider.

## Deployment

Deploy a copy of your application to IPFS using the following command:

```bash
  yarn deploy
```

## Additional Resources

- [Documentation](https://portal.thirdweb.com)
- [Templates](https://thirdweb.com/templates)
- [Video Tutorials](https://youtube.com/thirdweb_)
- [Blog](https://blog.thirdweb.com)

## Contributing

Contributions and [feedback](https://feedback.thirdweb.com) are always welcome! Please check our [open source page](https://thirdweb.com/open-source) for more information.

## Need help?

For help, join the [discord](https://discord.gg/thirdweb) or visit our [support page](https://support.thirdweb.com).
