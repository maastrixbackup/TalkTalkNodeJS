const { getData, postData } = require("../utils/networkRequests");
const pingServer = async (req, res, next) => {
  const token = req.accessToken;
  try {
    const url = "product-order/v2/api/ping";
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
const createOrder = async (req, res, next) => {
  debugger;
  const token = req.accessToken;
  try {
    const {
      appointmentId,
      requestedCompletionDate,
      uprn,
      locality,
      districtCode,
      postCode,
      streetName,
      streetNr,
      buildingName,
      subUnitNumber,
      action,
      galk,
      productSpeed,
      accessLineId,
      customerPrimaryName,
      customerEmail,
      customerPrimaryNumber,
      customerSecondaryName,
      customerSecondaryNumber,
      ipBlockSize,
      author1,
      author2,
      author3,
      customerAKJ,
      ontReferenceNo,
      ontPortNo,
      service_id,
      cpwn_ref,
    } = req.body;

    let body = {};
    const billingAccountId = process.env.accountID;
    let currentDate = new Date();
    let requestedDate =
      req.body.requestedCompletionDate ||
      currentDate.toISOString().split("T")[0] + "T00:00:00Z";

    if (action == "CFH-FTTP-NEWLINE")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
              description: "",
            },
            product: {
              name: "C-CFH-FTTP",
              place: [
                {
                  role: "consumer",
                  uprn: uprn || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "ProvideNew",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                },
              ],
            },
            quantity: 1,
          },
        ],
        relatedParty: [
          {
            "@referredType": "Individual",
            id: "2171",
            name: "PlatformX",
            role: "RequestingAgent",
          },
        ],
      };
    else if (action == "OR-FTTP-NEWLINE") {
      body = {
        requestedCompletionDate: req.body.requestedCompletionDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
            },
            product: {
              name: "C-OR-FTTP",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "ProvideNew",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  // value: productSpeed,
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    } else if (action == "OR-SOGEA-NEWLINE")
      body = {
        // requestedCompletionDate: req.body.requestedCompletionDate,
        billingAccount: {
          id: billingAccountId,
          // "@referredType": "BillingAccount",
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
              description: "",
            },
            id: "OR SoGEA - New Line - Test Order",
            product: {
              name: "C-OR-SOGEA",
              place: [
                {
                  role: "consumer",
                  // uprn: uprn || "",
                  galk: galk || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  buildingName: buildingName || "",
                  districtCode: districtCode || "",
                  streetName: streetName || "",
                  ...(streetNr ? { streetNr } : {}),
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "provisioningCommand",
                  value: "ProvideNew",
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
              ],
            },
            quantity: 1,
          },
        ],
        relatedParty: [
          {
            "@referredType": "Individual",
            id: "2171",
            name: "PlatformX",
            role: "RequestingAgent",
          },
        ],
        requestedCompletionDate: requestedDate,
      };
    else if (action == "OR-FTTP-Switch")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            // appointment: {
            //   id: appointmentId || "",
            // },
            product: {
              name: "C-OR-FTTP",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: "LV",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "requestedONTReference",
                  value: ontReferenceNo,
                  valueType: "string",
                },
                {
                  name: "requestedONTPortNumber",
                  value: ontPortNo,
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "OR-FTTP-SwitchToStop")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            // appointment: {
            //   id: appointmentId || "",
            // },
            product: {
              name: "C-OR-FTTP",
              place: [
                {
                  role: "consumer",
                  // uprn: uprn || "",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "SwitchToStop",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  // value: "ALCLF9F567A3",
                  value: accessLineId,
                  // ZZX2220360N2

                  valueType: "string",
                },
                {
                  name: "requestedONTReference",
                  value: ontReferenceNo,
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "OR-FTTP-SwitchToNew")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
            },
            product: {
              name: "C-OR-FTTP",
              place: [
                {
                  role: "consumer",
                  // uprn: uprn || "",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "SwitchToNew",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  // value: "NNX2226563N2",
                  value: accessLineId,
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-CFH-Switch")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            // appointment: {
            //   id: appointmentId || "",
            // },
            product: {
              name: "C-CFH-FTTP",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "numberPortabilityRequired",
                  value: "No",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "changeOfRetailer",
                  value: "Yes",
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-CFH-Takeover")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            // appointment: {
            //   id: appointmentId || "",
            // },
            product: {
              name: "C-CFH-FTTP",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Takeover",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "numberPortabilityRequired",
                  value: "No",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "changeOfRetailer",
                  value: "Yes",
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-SOGEA-Switch-DynamicIP")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            // appointment: {
            //   id: appointmentId || "",
            // },
            product: {
              name: "C-OR-SOGEA",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "numberPortabilityRequired",
                  value: "No",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "changeOfRetailer",
                  value: "Yes",
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-SOGEA-Switch-StaticIP")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            // appointment: {
            //   id: appointmentId || "",
            // },
            product: {
              name: "C-OR-SOGEA",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "numberPortabilityRequired",
                  value: "No",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "changeOfRetailer",
                  value: "Yes",
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-SOGEA-Switch-INP")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            // appointment: {
            //   id: appointmentId || "",
            // },
            product: {
              name: "C-OR-SOGEA",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "numberPortabilityRequired",
                  value: "No",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "changeOfRetailer",
                  value: "Yes",
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-SOGEA-Replace")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
            },
            product: {
              name: "C-OR-SOGEA",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Replace",
                  valueType: "string",
                },
                {
                  name: "cpwnReference",
                  value: cpwn_ref,
                  valueType: "string",
                },
                {
                  name: "existingSupplierServiceId",
                  value: service_id,
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  // value: "ZZX2220360N2",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: "Static IP - 4",
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-SOGEA-Restart")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
            },
            product: {
              name: "C-OR-SOGEA",
              place: [
                {
                  role: "consumer",
                  // uprn: uprn || "",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Restart",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  // value: "ZZX2220360N2",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-SOGEA-Takeover")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
            },
            product: {
              name: "C-OR-SOGEA",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: "LV",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Takeover",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Enhanced",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "existingSupplierServiceId",
                  value: service_id,
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "suspend-full-L2")
      body = {
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
              id: "13238",
              status: "suspended",
              productCharacteristic: [
                {
                  name: "suspensionLevel",
                  value: "full",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                },
              ],
            },
          },
        ],
      };
    else if (action == "suspendProduct-partial")
      body = {
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
              id: "13238",
              status: "suspended",
              productCharacteristic: [
                {
                  name: "suspensionLevel",
                  value: "partial",
                },
                {
                  name: "dataDivertProfileId",
                  value: "1234567890",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                },
              ],
            },
          },
        ],
      };
    else if (action == "unsuspendProduct")
      body = {
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
              id: "13238",
              status: "active",
            },
          },
        ],
      };
    else if (action == "ceaseProduct")
      body = {
        requestedCompletionDate: requestedDate,
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
              id: "13238",
              productCharacteristic: [
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                },
                {
                  name: "reasonForCease",
                  value: "Customer Vacating Premises",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-Openreach-Restart")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
            },
            product: {
              name: "C-OR-FTTP",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Restart",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "requestedONTReference",
                  value: ontReferenceNo,
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-Openreach-TakeOver")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            // appointment: {
            //   id: appointmentId || "",
            // },
            product: {
              name: "C-OR-FTTP",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Takeover",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "existingSupplierServiceId",
                  value: service_id,
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "requestedONTReference",
                  value: ontReferenceNo,
                  valueType: "string",
                },
                {
                  name: "requestedONTPortNumber",
                  value: ontPortNo,
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-Openreach-ReplaceToStop")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
            },
            product: {
              name: "C-OR-FTTP",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "ReplaceToStop",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "requestedONTReference",
                  value: ontReferenceNo,
                  valueType: "string",
                },
                {
                  name: "cpwnReference",
                  value: cpwn_ref,
                  valueType: "string",
                },
                {
                  name: "existingSupplierServiceId",
                  value: service_id,
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    else if (action == "createProductOrder-Openreach-ReplaceToNew") {
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        // note: [
        //   {
        //     author: "HazardNotes",
        //     text: author1,
        //   },
        //   {
        //     author: "HazardNotes",
        //     text: author2,
        //   },
        //   {
        //     author: "EngineerVisitNotes",
        //     text: author3,
        //   },
        // ],
        productOrderItem: [
          {
            action: "add",
            appointment: {
              id: appointmentId || "",
            },
            product: {
              name: "C-OR-FTTP",
              place: [
                {
                  role: "consumer",
                  galk: galk || "",
                  districtCode: districtCode || "",
                  locality: locality || "",
                  postcode: postCode || "",
                  streetName: streetName || "",
                  streetNr: streetNr || "",
                  buildingName: buildingName || "",
                  subUnitNumber: subUnitNumber || "",
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "ReplaceToNew",
                  valueType: "string",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                },
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
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),

                // Conditionally include secondary number
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                },
                {
                  name: "cpwnReference",
                  value: cpwn_ref,
                  valueType: "string",
                },
                {
                  name: "existingSupplierServiceId",
                  // value: "LLEA1381677",
                  value: service_id,
                  valueType: "string",
                },
              ],
            },
          },
        ],
      };
    }
    console.log("Request Payload:", JSON.stringify(body.productOrderItem));

    if (!body.productOrderItem) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid action type" });
    }

    const url = "product-order/v2/api/productOrder";
    const response = await postData(url, JSON.stringify(body), null, token);

    res.json({
      status: true,
      data: response,
      payload: body,
      url,
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    next(error);
  }
};

const suspendFull = async (req, res, next) => {
  const token = req.accessToken;
  try {
    const { productId, customerAKJ } = req.body;

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
            status: "suspended",
            productCharacteristic: [
              {
                name: "suspensionLevel",
                value: "full",
              },
              {
                name: "partnerOrderReference",
                value: customerAKJ,
              },
            ],
          },
        },
      ],
    };

    const url = "product-order/v2/api/productOrder";

    const response = await postData(url, JSON.stringify(body), null, token);

    return res.json({
      status: true,
      message: "Suspended successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error in suspend:", error);
    next(error);
  }
};

const unsuspendProduct = async (req, res, next) => {
  const token = req.accessToken;
  try {
    const { productId } = req.body;

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
            status: "active",
          },
        },
      ],
    };

    const url = "product-order/v2/api/productOrder";

    const response = await postData(url, JSON.stringify(body), null, token);

    return res.json({
      status: true,
      message: "Unsuspended successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error in unsuspend product:", error);
    next(error);
  }
};

module.exports = { createOrder, pingServer, suspendFull, unsuspendProduct };
