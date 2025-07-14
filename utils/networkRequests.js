const axios = require("axios");
const apiUrl = "https://api.wholesale.talktalk.co.uk/partners/";
const apiUrl2 =
  "https://api.wholesale.talktalk.co.uk/accessServiceIdentifiers/v1/";
// let authToken = "";
const postData = async (url, data, payload, authToken = "") => {
  try {
    let formdata;
    if (payload) {
      formdata = payload;
    } else if (data) {
      formdata = data;
    }
    const result = await axios({
      method: "post",
      url: apiUrl + url,
      data: formdata,
      headers: {
        Authorization: authToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      validateStatus: function (status) {
        return status >= 200 && status < 300;
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};

const patchData = async (url, payload, authToken = "") => {
  try {
    // Removed the reference to undefined 'data' variable
    const formdata = payload || {};

    const result = await axios({
      method: "patch",
      url: apiUrl + url,
      data: formdata,
      headers: {
        Authorization: authToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      validateStatus: function (status) {
        return status >= 200 && status < 300;
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error in patchData:", error.response?.data || error.message);
    throw error;
  }
};

const getData = async (url, params = {}, authenticationToken = authToken) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const fullUrl = queryParams
      ? `${apiUrl}${url}?${queryParams}`
      : `${apiUrl}${url}`;
    const config = {
      method: "get",
      url: fullUrl,
      headers: {
        Authorization: authenticationToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const result = await axios(config);
    return result.data;
  } catch (error) {
    // console.error("Error in getData:", error.response.data);
    throw error;
  }
};
const getData2 = async (url, params = {}, authenticationToken = authToken) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const fullUrl = queryParams
      ? `${apiUrl2}${url}?${queryParams}`
      : `${apiUrl2}${url}`;
    const config = {
      method: "get",
      url: fullUrl,
      headers: {
        Authorization: authenticationToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const result = await axios(config);
    return result.data;
  } catch (error) {
    // console.error("Error in getData:", error.response.data);
    throw error;
  }
};
const getJwtToken = async () => {
  const clientID = process.env.clientID;
  const clientSecret = process.env.clientSecret;
  if (!clientID || !clientSecret) {
    throw new Error(
      "Client ID or Client Secret is missing in the environment variables."
    );
  }
  try {
    const response = await axios({
      method: "GET",
      url: "https://api.wholesale.talktalk.co.uk/partners/security/v1/api/token",
      headers: {
        client_id: clientID,
        client_secret: clientSecret,
      },
    });
    if (response.headers["content-type"].includes("json")) {
      return response.data;
    } else {
      return response.text;
    }
  } catch (error) {
    console.error("Error fetching JWT token:", error.message);
    throw error;
  }
};
module.exports = {
  apiUrl,
  postData,
  getData,
  getData2,
  getJwtToken,
  patchData,
};
