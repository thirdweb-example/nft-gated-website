import { serialize } from "cookie";

const logout = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({
      error: "Invalid method. Only POST supported.",
    });
  }

  // Set the access token to 'none' and expire in 5 seconds
  res.setHeader(
    "Set-Cookie",
    serialize("access_token", "none", {
      path: "/",
      expires: new Date(Date.now() + 5 * 1000),
    })
  );

  res.status(200).json("Successfully logged out.");
};

export default logout;
