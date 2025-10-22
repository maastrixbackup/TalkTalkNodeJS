const { getData, postData } = require("../utils/networkRequests");
const { logOrderAction } = require("../services/logOrderAction");

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
    //Error : requestedCompletionDate can not be past date
    if (action == "CFH-FTTP-NEWLINE")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            "@type": "productOrderItem",
            id: "1",
            action: "add",
            appointment: {
              id: appointmentId || "",
              "@type": "appointment",
            },
            product: {
              "@type": "product",
              name: "C-CFH-FTTP",
              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    uprn: uprn || "",
                    postcode: postCode || "",
                  },
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "ProvideNew",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "CCF",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],
        "@type": "ProductOrder",
      };
    else if (action == "OR-FTTP-NEWLINE") {
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            action: "add",
            "@type": "productOrderItem",
            id: "1",
            // appointment: {
            //   id: appointmentId || "",
            //   "@type": "appointment",
            // },
            product: {
              name: "C-OR-FTTP",
              "@type": "product",
              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode || "",
                    externalId: [
                      {
                        "@type": "ExternalIdentifier",
                        externalIdentifierType: "galk",
                        id: galk || "",
                      },
                      {
                        "@type": "ExternalIdentifier",
                        externalIdentifierType: "districtCode",
                        id: districtCode || "",
                      },
                    ],
                  },
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "ProvideNew",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "requestedONTType",
                  value: "Restrict swap",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "abclub.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "CCF",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],
        "@type": "ProductOrder",
      };
    } else if (action == "OR-SOGEA-NEWLINE")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            action: "add",
            id: "1",
            "@type": "ProductOrderItem",
            // appointment: {
            //   id: appointmentId || "",
            //   "@type": "appointment",
            // },
            product: {
              name: "C-OR-SOGEA",
              "@type": "Product",
              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode || "",
                    externalId: [
                      {
                        "@type": "ExternalIdentifier",
                        externalIdentifierType: "galk",
                        id: galk || "",
                      },
                      {
                        "@type": "ExternalIdentifier",
                        externalIdentifierType: "districtCode",
                        id: districtCode || "",
                      },
                    ],
                  },
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "ProvideNew",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Self Installed",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "CCF",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],
        "@type": "ProductOrder",
      };
    else if (action == "OR-FTTP-Switch")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            action: "add",
            "@type": "productOrderItem",
            id: "1",
            product: {
              name: "C-OR-FTTP",
              "@type": "product",
              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode || "",
                    externalId: [
                      {
                        "@type": "ExternalIdentifier",
                        externalIdentifierType: "galk",
                        id: galk || "",
                      },
                      {
                        "@type": "ExternalIdentifier",
                        externalIdentifierType: "districtCode",
                        id: "LV",
                      },
                    ],
                  },
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "CCF",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "requestedONTReference",
                  value: ontReferenceNo,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "requestedONTPortNumber",
                  value: ontPortNo,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],
        "@type": "ProductOrder",
      };
    else if (action == "OR-FTTP-SwitchToStop")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            action: "add",
            "@type": "productOrderItem",
            id: "1", // static as per spec

            product: {
              name: "C-OR-FTTP",
              "@type": "product",

              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode || "",
                    externalId: [
                      ...(galk
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "galk",
                              id: galk,
                            },
                          ]
                        : []),
                      ...(districtCode
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "districtCode",
                              id: districtCode,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],

              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "SwitchToStop",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },

                // ✅ Include secondary contact details conditionally
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),

                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "CCF",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "requestedONTReference",
                  value: ontReferenceNo,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],

        "@type": "ProductOrder",
      };
    else if (action == "OR-FTTP-SwitchToNew")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            "@type": "productOrderItem",
            id: "1",
            action: "add",

            appointment: {
              id: appointmentId || "",
              "@type": "appointment",
            },

            product: {
              name: "C-OR-FTTP",
              "@type": "product",

              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode || "",
                    externalId: [
                      ...(galk
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "galk",
                              id: galk,
                            },
                          ]
                        : []),
                      ...(districtCode
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "districtCode",
                              id: districtCode,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],

              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "SwitchToNew",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "requestedONTType",
                  value: "Restrict swap", // optional field present in v3 spec
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },

                // Conditional secondary contact details
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),

                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),

                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "CCF",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],

        "@type": "ProductOrder",
      };
    else if (action == "createProductOrder-CFH-Switch")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            action: "add",
            "@type": "productOrderItem",
            id: "1",

            product: {
              name: "C-CFH-FTTP",
              "@type": "product",

              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode || "",

                    // ✅ External identifiers (dynamic)
                    externalId: [
                      ...(uprn
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "uprn",
                              id: uprn,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],

              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                // {
                //   name: "accessLineId",
                //   value: accessLineId,
                //   valueType: "string",
                //   "@type": "StringCharacteristic",
                // },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },

                // ✅ Optional secondary contacts
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),

                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                // {
                //   name: "ipBlockSize",
                //   value: ipBlockSize,
                //   valueType: "string",
                //   "@type": "StringCharacteristic",
                // },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                // {
                //   name: "numberPortabilityRequired",
                //   value: "No",
                //   valueType: "string",
                //   "@type": "StringCharacteristic",
                // },
                {
                  name: "retailerId",
                  value: "CDF",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                // {
                //   name: "changeOfRetailer",
                //   value: "Yes",
                //   valueType: "string",
                //   "@type": "StringCharacteristic",
                // },
              ],
            },
          },
        ],

        "@type": "ProductOrder",
      };
    else if (action == "createProductOrder-CFH-Takeover")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            action: "add",
            id: "1",
            "@type": "ProductOrderItem",

            product: {
              name: "C-CFH-FTTP",
              "@type": "Product",

              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode || "",
                    externalId: [
                      ...(uprn
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "uprn",
                              id: uprn,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],

              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Takeover",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                // {
                //   name: "accessLineId",
                //   value: accessLineId,
                //   valueType: "string",
                //   "@type": "StringCharacteristic",
                // },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },

                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),

                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                // {
                //   name: "ipBlockSize",
                //   value: ipBlockSize,
                //   valueType: "string",
                //   "@type": "StringCharacteristic",
                // },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                // {
                //   name: "numberPortabilityRequired",
                //   value: "No",
                //   valueType: "string",
                //   "@type": "StringCharacteristic",
                // },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                // {
                //   name: "changeOfRetailer",
                //   value: "Yes",
                //   valueType: "string",
                //   "@type": "StringCharacteristic",
                // },
              ],
            },
          },
        ],

        "@type": "ProductOrder",
      };
    else if (action == "createProductOrder-SOGEA-Switch-DynamicIP")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            action: "add",
            id: "1",
            "@type": "ProductOrderItem",
            product: {
              name: "C-OR-SOGEA",
              "@type": "Product",
              place: [
                {
                  "@type": "place",
                  role: "installationAddress",
                  place: {
                    postcode: postCode,
                    "@type": "PXCGeographicSubAddressUnit",
                    externalId: [
                      ...(galk
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "galk",
                              id: galk,
                            },
                          ]
                        : []),
                      ...(districtCode
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "districtCode",
                              id: districtCode,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "numberPortabilityRequired",
                  value: "No",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "changeOfRetailer",
                  value: "Yes",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],
        "@type": "ProductOrder",
      };
    else if (action == "createProductOrder-SOGEA-Switch-StaticIP")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            id: "1",
            action: "add",
            "@type": "ProductOrderItem",
            product: {
              name: "C-OR-SOGEA",
              "@type": "product",
              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    postcode: postCode,
                    "@type": "PXCGeographicSubAddressUnit",
                    externalId: [
                      ...(galk
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "galk",
                              id: galk,
                            },
                          ]
                        : []),
                      ...(districtCode
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "districtCode",
                              id: districtCode,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "CCF",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "numberPortabilityRequired",
                  value: "No",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "changeOfRetailer",
                  value: "Yes",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],
        "@type": "ProductOrder",
      };
    else if (action == "createProductOrder-SOGEA-Switch-INP")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],

        productOrderItem: [
          {
            id: "1",
            "@type": "ProductOrderItem",
            action: "add",
            product: {
              "@type": "product",
              name: "C-OR-SOGEA",
              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode,
                    externalId: [
                      ...(galk
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "galk",
                              id: galk,
                            },
                          ]
                        : []),
                      ...(districtCode
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "districtCode",
                              id: districtCode,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Switch",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "numberPortabilityRequired",
                  value: "Yes",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "changeOfRetailer",
                  value: "Yes",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "portingProcess",
                  value: "Fixed",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },

                {
                  name: "exchangePrefix",
                  value: "541044",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },

                {
                  name: "installationDN",
                  value: "07999999999",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },

                {
                  name: "networkOperatorId",
                  value: "001",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],
        "@type": "ProductOrder",
      };
    else if (action == "createProductOrder-SOGEA-Replace")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],

        productOrderItem: [
          {
            id: "1",
            "@type": "productOrderItem",
            action: "add",
            appointment: {
              id: appointmentId,
              "@type": "Appointment",
            },
            product: {
              name: "C-OR-SOGEA",
              "@type": "product",
              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode,
                    externalId: [
                      ...(galk
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "galk",
                              id: galk,
                            },
                          ]
                        : []),
                      ...(districtCode
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "districtCode",
                              id: districtCode,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],

              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Replace",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "cpwnReference",
                  value: cpwn_ref,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "existingSupplierServiceId",
                  value: service_id,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Managed Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },

                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),

                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),

                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],

        "@type": "ProductOrder",
      };
    else if (action == "createProductOrder-SOGEA-Restart")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            id: "1",
            "@type": "productOrderItem",
            action: "add",
            // appointment: {
            //   id: appointmentId,
            //   "@type": "appointment",
            // },
            product: {
              "@type": "product",
              name: "C-OR-SOGEA",
              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode,
                    externalId: [
                      ...(galk
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "galk",
                              id: galk,
                            },
                          ]
                        : []),
                      ...(districtCode
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "districtCode",
                              id: districtCode,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Restart",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Standard",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],
        "@type": "ProductOrder",
      };
    else if (action == "createProductOrder-SOGEA-Takeover")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
        note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
        productOrderItem: [
          {
            id: "1",
            action: "add",
            "@type": "productOrderItem",
            appointment: {
              id: appointmentId || "",
              "@type": "appointment",
            },
            product: {
              name: "C-OR-SOGEA",
              "@type": "product",
              place: [
                {
                  role: "installationAddress",
                  "@type": "place",
                  place: {
                    "@type": "PXCGeographicSubAddressUnit",
                    postcode: postCode || "",
                    externalId: [
                      ...(galk
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "galk",
                              id: galk,
                            },
                          ]
                        : []),
                      ...(districtCode
                        ? [
                            {
                              "@type": "ExternalIdentifier",
                              externalIdentifierType: "districtCode",
                              id: districtCode,
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
              productCharacteristic: [
                {
                  name: "provisioningCommand",
                  value: "Takeover",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "productSpeed",
                  value: productSpeed,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "careLevel",
                  value: "Enhanced",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationType",
                  value: "Self Install",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNamePrimary",
                  value: customerPrimaryName,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "installationContactNumberPrimary",
                  value: customerPrimaryNumber,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                ...(customerSecondaryName?.trim()
                  ? [
                      {
                        name: "installationContactNameSecondary",
                        value: customerSecondaryName.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                ...(customerSecondaryNumber?.trim()
                  ? [
                      {
                        name: "installationContactNumberSecondary",
                        value: customerSecondaryNumber.trim(),
                        valueType: "string",
                        "@type": "StringCharacteristic",
                      },
                    ]
                  : []),
                {
                  name: "installationContactEmail",
                  value: customerEmail,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "partnerOrderReference",
                  value: customerAKJ,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "ipBlockSize",
                  value: ipBlockSize,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "domainName",
                  value: "poptelecom.net",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "accessLineId",
                  value: accessLineId,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "retailerId",
                  value: "FFA",
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
                {
                  name: "existingSupplierServiceId",
                  value: service_id,
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ],
            },
          },
        ],
        "@type": "ProductOrder",
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
         note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
         productOrderItem: [
    {
      id: "1",
      "@type": "ProductOrderItem",
      action: "add",
      appointment: {
        id: appointmentId || "",
        "@type": "appointment",
      },
      product: {
        name: "C-OR-FTTP",
        "@type": "Product",
        place: [
          {
            role: "installationAddress",
            "@type": "place",
            place: {
              "@type": "PXCGeographicSubAddressUnit",
              postcode: postCode || "",
              externalId: [
                {
                  "@type": "ExternalIdentifier",
                  externalIdentifierType: "galk",
                  id: galk || "",
                },
                {
                  "@type": "ExternalIdentifier",
                  externalIdentifierType: "districtCode",
                  id: districtCode || "",
                },
              ],
            },
          },
        ],
        productCharacteristic: [
          {
            name: "provisioningCommand",
            value: "Restart",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "productSpeed",
            value: productSpeed,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "careLevel",
            value: "Standard",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "installationType",
            value: "Self Install",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "installationContactNamePrimary",
            value: customerPrimaryName,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "installationContactNumberPrimary",
            value: customerPrimaryNumber,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          ...(customerSecondaryName?.trim()
            ? [
                {
                  name: "installationContactNameSecondary",
                  value: customerSecondaryName.trim(),
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ]
            : []),
          ...(customerSecondaryNumber?.trim()
            ? [
                {
                  name: "installationContactNumberSecondary",
                  value: customerSecondaryNumber.trim(),
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ]
            : []),
          {
            name: "installationContactEmail",
            value: customerEmail,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "partnerOrderReference",
            value: customerAKJ,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "ipBlockSize",
            value: ipBlockSize,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "domainName",
            value: "poptelecom.net",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "retailerId",
            value: "FFA",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "requestedONTReference",
            value: ontReferenceNo,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
        ],
      },
    },
  ],
  "@type": "ProductOrder",
      };
    else if (action == "createProductOrder-Openreach-TakeOver")
      body = {
        requestedCompletionDate: requestedDate,
        billingAccount: {
          id: billingAccountId,
          "@type": "BillingAccount",
        },
          note: [
          {
            author: "HazardNotes",
            text: "This is a TMF product order illustration",
            "@type": "Note",
          },
          {
            author: "HazardNotes",
            text: "dangerous dog onsite",
            "@type": "Note",
          },
          {
            author: "EngineerVisitNotes",
            text: "No plug on the 3rd floor",
            "@type": "Note",
          },
        ],
      productOrderItem: [
    {
      id: "1",
      "@type": "ProductOrderItem",
      action: "add",
      product: {
        name: "C-OR-FTTP",
        "@type": "Product",
        place: [
          {
            role: "installationAddress",
            "@type": "place",
            place: {
              "@type": "PXCGeographicSubAddressUnit",
              postcode: postCode || "",
              externalId: [
                {
                  "@type": "ExternalIdentifier",
                  externalIdentifierType: "galk",
                  id: galk || "",
                },
                {
                  "@type": "ExternalIdentifier",
                  externalIdentifierType: "districtCode",
                  id: districtCode || "",
                },
              ],
              ...(locality && { locality }),
              ...(streetName && { streetName }),
              ...(streetNr && { streetNr }),
              ...(buildingName && { buildingName }),
              ...(subUnitNumber && { subUnitNumber }),
            },
          },
        ],
        productCharacteristic: [
          {
            name: "provisioningCommand",
            value: "Takeover",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "productSpeed",
            value: productSpeed,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "careLevel",
            value: "Standard",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "installationType",
            value: "Self Install",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "installationContactNamePrimary",
            value: customerPrimaryName,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "installationContactNumberPrimary",
            value: customerPrimaryNumber,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          ...(customerSecondaryName?.trim()
            ? [
                {
                  name: "installationContactNameSecondary",
                  value: customerSecondaryName.trim(),
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ]
            : []),
          ...(customerSecondaryNumber?.trim()
            ? [
                {
                  name: "installationContactNumberSecondary",
                  value: customerSecondaryNumber.trim(),
                  valueType: "string",
                  "@type": "StringCharacteristic",
                },
              ]
            : []),
          {
            name: "installationContactEmail",
            value: customerEmail,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "partnerOrderReference",
            value: customerAKJ,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "ipBlockSize",
            value: ipBlockSize,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "domainName",
            value: "poptelecom.net",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "existingSupplierServiceId",
            value: service_id,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "retailerId",
            value: "FFA",
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "requestedONTReference",
            value: ontReferenceNo,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
          {
            name: "requestedONTPortNumber",
            value: ontPortNo,
            valueType: "string",
            "@type": "StringCharacteristic",
          },
        ],
      },
    },
  ],
  "@type": "ProductOrder",
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

    const url = "product-order/v3/api/productOrder";
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
  const { productId, customerAKJ, requestedBy = null } = req.body;
  try {
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
                value: "partial",
              },
              {
                name: "partnerOrderReference",
                value: customerAKJ,
              },
              {
                name: "dataDivertProfileId",
                value: "2254",
              },
            ],
          },
        },
      ],
    };

    const url = "product-order/v2/api/productOrder";

    const response = await postData(url, JSON.stringify(body), null, token);

    //Log successful action
    await logOrderAction({
      productId: productId,
      action: "Suspend",
      requestedBy,
      requestPayload: body,
      responsePayload: response,
      status: "success",
    });

    return res.json({
      status: true,
      message: "Suspended successfully",
      data: response,
    });
  } catch (error) {
    //Log error case
    await logOrderAction({
      productId: productId,
      action: "Suspend",
      requestedBy,
      requestPayload: req.body,
      status: "error",
      errorMessage: error.message,
    });

    console.error("Error in suspend:", error);
    next(error);
  }
};

const unsuspendProduct = async (req, res, next) => {
  const token = req.accessToken;
  const { productId, requestedBy = null } = req.body;
  try {
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
            productCharacteristic: [
              {
                name: "dataDivertProfileId",
                value: "2254",
              },
            ],
          },
        },
      ],
    };

    const url = "product-order/v2/api/productOrder";

    const response = await postData(url, JSON.stringify(body), null, token);
    // Log successful action
    await logOrderAction({
      productId: productId,
      action: "Unsuspend",
      requestedBy,
      requestPayload: body,
      responsePayload: response,
      status: "success",
    });

    return res.json({
      status: true,
      message: "Unsuspended successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error in unsuspend product:", error);
    //Log error case
    await logOrderAction({
      productId: productId,
      action: "Unsuspend",
      requestedBy,
      requestPayload: req.body,
      status: "error",
      errorMessage: error.message,
    });

    next(error);
  }
};

module.exports = { createOrder, pingServer, suspendFull, unsuspendProduct };
