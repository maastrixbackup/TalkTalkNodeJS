const {
  getData,
  getData2,
  postData,
  patchData,
} = require("../utils/networkRequests");

const statusChecker = async (req, res, next) => {
  const token = req.accessToken;

  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        status: false,
        message: "Order ID is required",
      });
    }

    const url = `product-order/v2/api/productOrder/${orderId}`;
    const response = await getData(url, {}, token);

    res.json({
      status: true,
      data: response,
      url,
    });
  } catch (error) {
    console.error("Error in getOrderStatus:", error);
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  const token = req.accessToken;

  try {
    const { orderId } = req.params;
    const { cancellationReason } = req.body;

    if (!orderId) {
      return res.status(400).json({
        status: false,
        message: "Order ID is required",
      });
    }

    if (!cancellationReason) {
      return res.status(400).json({
        status: false,
        message: "Cancellation reason is required",
      });
    }

    const url = "product-order/v2/api/cancelProductOrder";

    const payload = {
      cancellationReason: cancellationReason,
      productOrderCancel: {
        id: orderId,
      },
      "@type": "CancelProductorder",
    };

    const response = await postData(url, payload, null, token);

    res.json({
      status: true,
      data: response,
      payload,
      url,
    });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    next(error);
  }
};

const ceaseOrder = async (req, res, next) => {
  const token = req.accessToken;
  try {
    const {
      orderId,
      requestedCompletionDate,
      productId,
      partnerOrderReference,
      reasonForCease,
    } = req.body;

    const url = "product-order/v2/api/productOrder";

    const payload = {
      requestedCompletionDate: requestedCompletionDate,
      note: [
        {
          author: "Partner Requested",
          text: "This is a TMF product order illustration",
        },
      ],
      productOrderItem: [
        {
          action: "delete",
          product: {
            id: productId,
            productCharacteristic: [
              {
                name: "partnerOrderReference",
                value: partnerOrderReference,
              },
              {
                name: "reasonForCease",
                value: reasonForCease,
              },
            ],
          },
        },
      ],
    };

    const response = await postData(url, payload, null, token);
    return res.json({
      status: true,
      message: "Cease order submitted successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error in ceaseOrder:", error);
    next(error);
  }
};

const getCpwn = async (req, res, next) => {
  const token = req.accessToken;

  try {
    const { mobile } = req.query;

    if (!mobile) {
      return res.status(400).json({
        status: false,
        message: "Landline Number is required",
      });
    }

    const url = `api/service/${mobile}`;
    const response = await getData2(url, {}, token);

    res.json({
      status: true,
      data: response,
      url,
    });
  } catch (error) {
    console.error("Error in getOrderStatus:", error);
    next(error);
  }
};
const billingAccountId = process.env.billingId;
const getServiceID = async (req, res, next) => {
  const token = req.accessToken;

  try {
    const { cpwnReference } = req.query;

    if (!cpwnReference) {
      return res.status(400).json({
        status: false,
        message: "CPWN is required",
      });
    }

    const url = `product-availability/v2/api/searchByReference?referenceType=cpwnReference&billingAccountId=${billingAccountId}&cpwnReference=${cpwnReference}&endCustomerType=Residential&serviceType=Managed`;
    const response = await getData(url, {}, token);

    res.json({
      status: true,
      data: response,
      url,
    });
  } catch (error) {
    console.error("Error in getOrderStatus:", error);
    next(error);
  }
};

// Fix for the editOrder controller
// const editOrder = async (req, res) => {
//   const token = req.accessToken;
//   const {
//     productId,
//     requestedCompletionDate,
//     customerPrimaryName,
//     customerEmail,
//     customerPrimaryNumber,
//     customerSecondaryNumber,
//     productOrderItem // Add this to receive from frontend if available
//   } = req.body;

//   const order_id = req.params.orderId || req.body.order_id;

//   if (!order_id) {
//     return res.status(400).json({ success: false, message: "Order ID is required" });
//   }

//   const url = `product-order/v2/api/productOrder/${order_id}`;

//   // Add the missing required fields
//   const payload = {
//     id: order_id, // Add the required 'id' field
//     productId,
//     requestedCompletionDate,
//     customerPrimaryName,
//     customerEmail,
//     customerPrimaryNumber,
//     customerSecondaryNumber,
//     productOrderItem: productOrderItem || [] // Add required productOrderItem field
//   };

//   try {
//     const response = await patchData(url, payload, token);
//     res.json({ success: true, data: response });
//   } catch (error) {
//     console.error("Error updating order:", error.response?.data || error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update order",
//       details: error.response?.data || error.message
//     });
//   }
// };

const editOrder = async (req, res) => {
  const token = req.accessToken;
  const order_id = req.params.orderId || req.body.order_id;

  if (!order_id) {
    return res
      .status(400)
      .json({ success: false, message: "Order ID is required" });
  }

  try {
    const {
      productId,
      requestedCompletionDate,
      customerPrimaryName,
      customerEmail,
      customerPrimaryNumber,
      customerSecondaryNumber,
    } = req.body;

    const body = {
      id: order_id,
      requestedCompletionDate: requestedCompletionDate,
      note: [
        {
          author: "AmendDateChangeReason",
          text: "customer changed mind",
        },
      ],
      productOrderItem: [
        {
          action: "modify",
          product: {
            id: productId,
            productCharacteristic: [
              {
                name: "installationContactNamePrimary",
                value: customerPrimaryName,
                valueType: "string",
              },
              {
                name: "installationContactNumberPrimary",
                value: customerPrimaryNumber,
                valueType: "string",
              },
              {
                name: "installationContactEmail",
                value: customerEmail,
                valueType: "string",
              },
              {
                name: "installationContactNumberSecondary",
                value: customerSecondaryNumber,
                valueType: "string",
              },
            ],
          },
        },
      ],
    };

    const url = `product-order/v2/api/productOrder/${order_id}`;
    const response = await patchData(url, JSON.stringify(body), token);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error(
      "Error updating order:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      details: error.response?.data || error.message,
    });
  }
};

const editAppointment = async (req, res) => {
  const token = req.accessToken;
  const order_id = req.params.orderId || req.body.order_id;

  if (!order_id) {
    return res
      .status(400)
      .json({ success: false, message: "Order ID is required" });
  }

  try {
    const {
      productId,
      requestedCompletionDate,
      appointmentId,
      appointmentDate,
      // installationType,
    } = req.body;

    const body = {
      id: order_id,
      requestedCompletionDate: requestedCompletionDate,
      note: [
        {
          author: "AppointmentChangeReason",
          date: appointmentDate,
          text: "Customer changed mind",
        },
      ],
      productOrderItem: [
        {
          product: {
            id: productId,
            productCharacteristic: [
              // {
              //   name: "installationType",
              //   value: installationType,
              //   valueType: "string",
              // },
            ],
          },
          action: "modify",
          appointment: {
            id: appointmentId,
          },
        },
      ],
    };

    const url = `product-order/v2/api/productOrder/${order_id}`;
    const response = await patchData(url, JSON.stringify(body), token);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error(
      "Error updating order:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      details: error.response?.data || error.message,
    });
  }
};

const modifyCareLevel = async (req, res) => {
  try {
    const token = req.accessToken;
    const { productId, newCareLevel } = req.body;

    const body = {
      note: [
        {
          author: "Partner Requested",
          text: "This is a TMF product order illustration",
        },
      ],
      productOrderItem: [
        {
          action: "modify",
          product: {
            id: productId,
            productCharacteristic: [
              {
                name: "careLevel",
                value: newCareLevel,
              },
            ],
          },
        },
      ],
    };

    const url = `product-order/v2/api/productOrder`;
    const response = await postData(url, JSON.stringify(body), null, token);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error(
      "Error modifying care level:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to modify care level",
      details: error.response?.data || error.message,
    });
  }
};

const modifyIP = async (req, res) => {
  const token = req.accessToken;
  try {
    const { productId, newIpBlockSize } = req.body;

    const body = {
      note: [
        {
          author: "Partner Requested",
          text: "This is a TMF product order illustration",
        },
      ],
      productOrderItem: [
        {
          action: "modify",
          product: {
            id: productId,
            productCharacteristic: [
              {
                name: "ipBlockSize",
                value: newIpBlockSize,
              },
            ],
          },
        },
      ],
    };

    const url = `product-order/v2/api/productOrder`;
    const response = await postData(url, JSON.stringify(body), null, token);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error(
      "Error modifying IP block size:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to modify IP block size",
      details: error.response?.data || error.message,
    });
  }
};
module.exports = {
  statusChecker,
  cancelOrder,
  getCpwn,
  getServiceID,
  modifyCareLevel,
  modifyIP,
  editOrder,
  editAppointment,
  ceaseOrder,
};
