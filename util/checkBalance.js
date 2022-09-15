import { contractAddress } from "../const/yourDetails";

export default async function checkBalance(sdk, address) {
  const editionDrop = await sdk.getEditionDrop(
    contractAddress // replace this with your contract address
  );

  const balance = await editionDrop.balanceOf(address, 0);

  // gt = greater than
  return balance.gt(0);
}
