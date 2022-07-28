import { serialize } from "cookie";

const logout = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported.",
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

  res.redirect("/login", 302);
};

export default logout;
