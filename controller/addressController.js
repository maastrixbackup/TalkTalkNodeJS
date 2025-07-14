const { getData, postData } = require("../utils/networkRequests");

const pingServer = async (req, res, next) => {
  const token = req.accessToken;
  try {
    const url = "addresscheck/v1/api/ping";
    const response = await getData(url, {}, token);
    res.json({
      status: true,
      data: response,
    });
  } catch (error) {
    console.error("Error in pingServer:", error);
    next(error);
  }
};
const checkaddress = async (req, res, next) => {
  const token = req.accessToken;
  try {
    const {
      uprn,
      organisationName,
      departmentName,
      subBuildingName,
      buildingName,
      buildingNumber,
      dependentThoroughfareName,
      thoroughfareName,
      doubleDependentLocality,
      dependentLocality,
      postCode,
      postTown,
    } = req.body;

    const body = {
      uprn: uprn || "", // Use value from req.body or default to an empty string
      address: {
        organisationName: organisationName || "",
        subBuilding: subBuildingName || "",
        buildingName: buildingName || "",
        buildingNumber: buildingNumber || "",
        dependantThoroughFare: dependentThoroughfareName || "",
        street: thoroughfareName || "",
        locality: dependentLocality || doubleDependentLocality || "", // Fallback to doubleDependentLocality if dependentLocality is missing
        postCode: postCode || "",
        postTown: postTown || "",
        county: departmentName || "", // Assuming departmentName corresponds to county
      },
    };

    const url = "addresscheck/v1/api/addresses/find-available";
    const response = await postData(url, body, null, token);

    res.json({
      status: true,
      data: response,
      payload: body,url
    });
  } catch (error) {
    console.error("Error in checkaddress:", error);
    next(error);
  }
};
const productAvailablity = async (req, res, next) => {
  const token = req.accessToken;
  // let addressType = "GALK";
  const serviceType = "Managed";
  const endCustomerType = "Residential";
  const billingAccountId = process.env.agentId;
  try {
    const { cssDistrictCode, alk, uprn, addressType } = req.body;
    let body;
    if (addressType == "UPRN")
      body = {
        uprn,
        addressType,
        billingAccountId,
        serviceType,
        endCustomerType,
      };
    else if (addressType == "GALK")
      body = {
        cssDistrictCode,
        galk: alk,
        addressType,
        billingAccountId,
        serviceType,
        endCustomerType,
      };
    else
      body = {
        uprn,
        cssDistrictCode,
        galk: alk,
        addressType,
        billingAccountId,
        serviceType,
        endCustomerType,
      };

    const url = "product-availability/v2/api/searchByAddress";
    const response = await getData(url, body, token);

    res.json({
      status: true,
      data: response,
      payload: body,url

    });
  } catch (error) {
    console.error("Error in productAvailablity:", error);
    next(error);
  }
};

module.exports = { checkaddress, pingServer, productAvailablity };
