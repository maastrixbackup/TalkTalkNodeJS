const { getJwtToken } = require("../utils/networkRequests.js");

var token = null; // Initialize token as null
var expiry = 0; // Initialize expiry to 0 (past timestamp)

const base64Decode = (encodedStr) => {
  // Decode Base64 string to UTF-8
  return Buffer.from(encodedStr, "base64").toString("utf-8");
};

const getToken = async (req, res, next) => {
  try {
    const currentTs = Math.floor(Date.now() / 1000);

    if (!token || currentTs >= expiry) {
      const response = await getJwtToken();

      const decodedPayload = JSON.parse(
        base64Decode(response.partnerJWT.split(".")[1])
      );
      expiry = decodedPayload.exp;
      token = response.partnerJWT;
    }

    req.accessToken = `Bearer ${token}`;
    next();
  } catch (error) {
    console.error("Error fetching token:", error.message);
    res.status(401).send({
      message: "Invalid credentials",
    });
  }
};

module.exports = getToken;
