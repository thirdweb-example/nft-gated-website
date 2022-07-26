import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export default async function handler(req, res) {
  // Get the login payload out of the request
  const { loginPayload } = JSON.parse(req.body);

  console.log(loginPayload);

  // SDK instantiation (read-only)
  const sdk = new ThirdwebSDK("mumbai");

  // Verify the login request
  const domain = "thirdweb.com";
  const verified = sdk.auth.verify(domain, loginPayload);

  if (!verified) {
    res.status(401).json({ error: "Unauthorized" });
  }

  // Now check if the user meets the criteria to see this content
  // (e.g. they own an NFT from the collection)
  const editionDrop = sdk.getEditionDrop(
    "0x1fCbA150F05Bbe1C9D21d3ab08E35D682a4c41bF"
  );

  // Get addresses' balance of token ID 0
  const balance = await editionDrop.balanceOf(loginPayload.payload.address, 0);

  if (balance > 0) {
    // If the user is verified and has an NFT, return the content
    res.status(200).json({
      message: "This is the restricted content",
    });
  } else {
    // If the user is verified but doesn't have an NFT, return a message
    res.status(200).json({
      message: "You don't have an NFT",
    });
  }
}
