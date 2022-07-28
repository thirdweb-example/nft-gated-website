import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { serialize } from "cookie";
import { domainName } from "../../const/yourDetails";
import checkBalance from "../../util/checkBalance";

const login = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported.",
    });
  }

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    console.error("Missing PRIVATE_KEY environment variable");
    return res.status(500).json({
      error: "Admin private key not set",
    });
  }

  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "mumbai");

  // Get signed login payload from the frontend
  const payload = JSON.parse(req.query.payload);

  if (!payload) {
    return res.status(400).json({
      error: "Must provide a login payload to generate a token",
    });
  }

  // Generate an access token with the SDK using the signed payload
  const domain = domainName;

  // Verify the token and get the address, so we can check their NFT balance
  const address = sdk.auth.verify(domain, payload);

  if (!address) {
    return res.status(400).json({
      error: "Invalid login payload",
    });
  }

  const hasNft = await checkBalance(sdk, address);

  if (!hasNft) {
    res.status(401).json({
      error: "You don't own an NFT and cannot access this page.",
    });
  }

  // At this point, the user has authenticated and owns at least 1 NFT.
  // Generate an auth token for them
  const token = await sdk.auth.generateAuthToken(domain, payload);

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

  res.redirect("/", 302);
};

export default login;
