const { getData, postData } = require("../utils/networkRequests");


const pingServer = async (req, res, next) => {
  const token = req.accessToken;
  console.log(token);

  try {
    const url = "appointments/v2/api/ping";
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
const getAppointments = async (req, res, next) => {
  const token = req.accessToken;

  const billingAccountId = process.env.accountID;
  try {
    const {
      type,
      provisioningCommand,
      uprn,
      galk,
      districtCode,
      productName,
      productSpeed,
      appointmentDate,
    } = req.body;
    let body;
    if (type == "CF") {
      body = {
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        appointmentType: "Standard",
        productName: productName,
        productSpeed: productSpeed,
        provisioningCommand: provisioningCommand,
        addressType: "UPRN",
        uprn: uprn,
        appointmentFromDate: appointmentDate,
      };
    } else if (type == "SOGEA") {
      body = {
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        appointmentType: "Standard",
        productName: productName,
        productSpeed: productSpeed,
        provisioningCommand: provisioningCommand,
        addressType: "GALK",
        galk: galk,
        appointmentFromDate: appointmentDate,
        districtCode: districtCode,
        siteVisitReason: "Standard",
      };
    } else if (type == "OR") {
      body = {
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        appointmentType: "Standard",
        productName: productName,
        productSpeed: productSpeed,
        provisioningCommand: provisioningCommand,
        addressType: "GALK",
        galk: galk,
        appointmentFromDate: appointmentDate,
        districtCode: districtCode,
        siteVisitReason: "Standard",
      };
    }

    const url = "appointments/v2/api/appointments/get-available";
    const response = await postData(url, body, null, token);

    res.json({
      status: true,
      data: response,
      payload: body,url

    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    next(error);
  }
};
const reserveAppointment = async (req, res, next) => {
  const token = req.accessToken;
  const billingAccountId = process.env.accountID;

  try {
    const {
      type,
      provisioningCommand,
      uprn,
      galk,
      districtCode,
      appointmentTimeSlot,
      appointmentStartTime,
      appointmentEndTime,
      productName,
      productSpeed,
      addressType,
      appointmentDate,
    } = req.body;

    let body;
    if (type == "CF") {
      body = {
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        appointmentType: "Standard",
        productName: productName,
        productSpeed: productSpeed,
        provisioningCommand: provisioningCommand,
        addressType: "UPRN",
        uprn: uprn,
        appointmentDate: appointmentDate,
        appointmentTimeSlot: appointmentTimeSlot,
        appointmentStartTime: appointmentStartTime,
        appointmentEndTime: appointmentEndTime,
      };
    } else if (type == "SOGEA") {
      body = {
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        appointmentType: "Standard",
        productName: productName,
        productSpeed: productSpeed,
        provisioningCommand: provisioningCommand,
        addressType: "GALK",
        galk: galk,
        districtCode: districtCode,
        appointmentDate: appointmentDate,
        appointmentTimeSlot: appointmentTimeSlot,
        appointmentStartTime: appointmentStartTime,
        appointmentEndTime: appointmentEndTime,
        siteVisitReason: "Standard",
      };
    } else if (type == "OR") {
      body = {
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        appointmentType: "Standard",
        productName: productName,
        productSpeed: productSpeed,
        provisioningCommand: provisioningCommand,
        addressType: "GALK",
        galk: galk,
        appointmentDate: appointmentDate,
        appointmentTimeSlot: appointmentTimeSlot,
        appointmentStartTime: appointmentStartTime,
        appointmentEndTime: appointmentEndTime,
        districtCode: districtCode,
        siteVisitReason: "Standard",
      };
    }

    const url = "appointments/v2/api/appointments";
    const response = await postData(url, body, null, token);

    res.json({
      status: true,
      data: response,
      payload: body,
      url
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    next(error);
  }
};

module.exports = { reserveAppointment, pingServer, getAppointments };
