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
