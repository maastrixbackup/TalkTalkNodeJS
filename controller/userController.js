var db = require("../utils/dbconnection.js");
const { getJwtToken, postData } = require("../utils/networkRequests.js");
const { apiUrl } = require("../utils/networkRequests.js");
const axios = require("axios");

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Test database connection
console.log("Testing database connection...");
db.query("SELECT 1 + 1 AS solution", (err, results) => {
  if (err) {
    console.error("Cannot connect to database:", err);
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);

    // Try to log connection details (if available)
    try {
      console.error("Connection config:", {
        host: db.config.connectionConfig.host,
        user: db.config.connectionConfig.user,
        database: db.config.connectionConfig.database,
      });
    } catch (e) {
      console.error("Could not access connection config details:", e.message);
    }
  } else {
    console.log("Database connection successful:", results);
  }
});

const userLogin = async (req, res, next) => {
  console.log("Login attempt for email:", req.body.email);
  console.log("Request body:", JSON.stringify(req.body));

  try {
    // Get the JWT token
    const _token = await getJwtToken();
    console.log("JWT token obtained:", _token ? "Success" : "Failed");

    const sql = `SELECT * FROM tbl_users WHERE user_email = ? AND user_password = ?`;
    console.log("Executing SQL query:", sql);

    // Execute the query with enhanced error handling
    db.query(sql, [req.body.email, req.body.password], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);

        // Try to log connection details (if available)
        try {
          console.error("Connection config:", {
            host: db.config.connectionConfig.host,
            user: db.config.connectionConfig.user,
            database: db.config.connectionConfig.database,
          });
        } catch (e) {
          console.error(
            "Could not access connection config details:",
            e.message
          );
        }

        res.status(500).json({
          error: "Database query error",
          message: err.message,
          code: err.code,
        });
      } else {
        console.log(`Query results: Found ${results.length} users`);

        if (results.length > 0) {
          // Avoid logging sensitive user data
          console.log("User found, sending success response with token");
          res.json({
            success: true,
            user: results[0],
            token: _token.partnerJWT,
          });
        } else {
          console.log("No matching user found for the provided credentials");
          res.json({
            success: false,
            message: "Invalid credentials",
          });
        }
      }
    });
  } catch (error) {
    console.error("Error in userLogin function:", error);
    console.error("Error stack:", error.stack);
    next(error);
  }
};

const userRegister = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }
  try {
    const checkSql = `select * from tbl_users where user_email = ?`;
    db.query(checkSql, [email], (err, results) => {
      if (err) {
        console.log("Database error during user check: ", err);
        return res.status(500).json({
          success: false,
          message: "Database error during user check",
          error: err.message,
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already registered.",
        });
      }

      const dateOfRegistration = new Date();

      const insertUser = `insert into tbl_users (user_email,user_password, date_of_registration) VALUES (?,?,?)`;

      db.query(
        insertUser,
        [email, password, dateOfRegistration],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.log("Database error during user insert: ", insertErr);
            return res.status(500).json({
              success: false,
              message: "Database error during user insert",
              error: insertErr.message,
            });
          }
          console.log("New user registered with ID:", insertResult.insertId);
          return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            userId: insertResult.insertId,
          });
        }
      );
    });
  } catch (error) {
    console.error("Error in User registration :", error);
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  const { id, currentPassword, newPassword } = req.body;
  if (!id || !currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Invalid parameter.",
    });
  }

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      success: false,
      message: "Id must be a number.",
    });
  }

  try {
    const checkSql = `SELECT * FROM tbl_users WHERE id = ? AND user_password = ?`;
    db.query(checkSql, [id, currentPassword], (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({
          success: false,
          message: "Database error while verifying current password",
          error: err.message,
        });
      }
      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect or user not found.",
        });
      }
      const updateSql = `UPDATE tbl_users SET user_password = ?,updated_date = NOW() WHERE id = ?`;
      db.query(updateSql, [newPassword, id], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating password:", updateErr);
          return res.status(500).json({
            success: false,
            message: "Database error while updating password",
            error: updateErr.message,
          });
        }

        res.status(200).json({
          success: true,
          message: "Password updated successfully.",
        });
      });
    });
  } catch (error) {
    console.error("Error in change password :", error);
    next(error);
  }
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  const checkSql = `SELECT * FROM tbl_users WHERE user_email = ?`;
  db.query(checkSql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No user found with this email." });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // false for TLS (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
                <p>Hello,</p>
                <p>You requested a password reset. Click the link below:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link will expire in 1 hour.</p>
            `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully.",
      });
    } catch (mailErr) {
      res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: mailErr.message,
      });
    }
  });
};

const resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Token and new password are required.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const sql = `UPDATE tbl_users SET user_password = ?,updated_date = NOW() WHERE user_email = ?`;
    db.query(sql, [newPassword, email], (err, result) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to update password",
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Password has been successfully reset.",
      });
    });
  } catch (err) {
    console.error("Invalid or expired token:", err);
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

const userUpdate = (req, res) => {
  const { id, name, cli, akj } = req.body;
  if (!id || typeof id !== "number") {
    return res.status(400).json({
      success: false,
      message: "Valid user id is required.",
    });
  }
  if (cli !== undefined && !/^\d+$/.test(cli)) {
    return res.status(400).json({
      success: false,
      message: "CLI must contain only numbers.",
    });
  }
  const fieldsToUpdate = {};
  if (name !== undefined) fieldsToUpdate.user_name = name;
  if (cli !== undefined) fieldsToUpdate.cli = cli;
  if (akj !== undefined) fieldsToUpdate.akj = akj;
  fieldsToUpdate.updated_date = new Date();
  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields provided for update.",
    });
  }
  const setClause = Object.keys(fieldsToUpdate)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = [...Object.values(fieldsToUpdate), id];
  const updateSql = `UPDATE tbl_users SET ${setClause} WHERE id = ?`;
  db.query(updateSql, values, (err, result) => {
    if (err) {
      console.error("Database error during update:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to update user details",
        error: err.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.json({
      success: true,
      message: "User details updated successfully.",
    });
  });
};

const saveOrder = async (req, res) => {
  const {
    order_id,
    customer_name,
    product_type,
    provider,
    provisioning_command,
    status,
    expected_completion_date,
    supplier_service_id,
    productr,
    partner_order_reference,
    broadband_username,
  } = req.body;

  const access_casr = "";
  if (!order_id || !status) {
    return res.status(400).json({
      success: false,
      message: "Order id and status are required",
    });
  }
  const order_date = new Date();
  const updatedAt = new Date();

  const checkOrder = `SELECT * FROM tbl_orders where order_id = ?`;
  db.query(checkOrder, [order_id], (checkErr, results) => {
    if (checkErr) {
      console.error("Error checking order:", checkErr);
      return res.status(500).json({
        success: false,
        message: "Database error while checking order",
        error: checkErr.message,
      });
    }
    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Order with this ID already exists",
      });
    }

    const saveOrderSql = `INSERT INTO tbl_orders (order_id,access_casr,customer_name,product_type,provider,provisioning_command,status,order_date,expected_completion_date,updated_at,supplier_service_id, productr, partner_order_reference, broadband_username) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.query(
      saveOrderSql,
      [
        order_id,
        access_casr,
        customer_name,
        product_type,
        provider,
        provisioning_command,
        status,
        order_date,
        expected_completion_date,
        updatedAt,
        supplier_service_id,
        productr,
        partner_order_reference,
        broadband_username,
      ],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Error inserting order :", insertErr);
          return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: insertErr.message,
          });
        }
        return res.status(201).json({
          success: true,
          message: "Order saved successfully",
          data: {
            id: result.insertId,
            order_id,
            access_casr,
            customer_name,
            product_type,
            provider,
            provisioning_command,
            status,
            order_date,
            expected_completion_date,
            supplier_service_id,
            productr,
            partner_order_reference,
            broadband_username,
          },
        });
      }
    );
  });
};

const orderDashboard = async (req, res) => {
  const { provider, status } = req.body;

  const fetchOrderSql = `SELECT * FROM tbl_orders ORDER BY id DESC`;
  db.query(fetchOrderSql, [provider, status], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: err,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: results,
    });
  });
};

const deleteOrder = (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res
      .status(400)
      .json({ success: false, message: "Order ID is required" });
  }

  const deleteSql = `DELETE FROM tbl_orders WHERE order_id = ?`;
  db.query(deleteSql, [order_id], (err, result) => {
    if (err) {
      console.error("Error deleting order:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to delete order",
        error: err,
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Ordered deleted successfully" });
  });
};

const updateOrderStatus = async (req, res) => {
  try {
    const _token = await getJwtToken();
    const headers = {
      Authorization: `Bearer ${_token.partnerJWT}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const fetchAllOrdersSql = `SELECT id, access_casr, order_id, status FROM tbl_orders where status != "cancelled" and status != "rejected" and status != "failed" and status !="completed"`;
    db.query(fetchAllOrdersSql, async (err, orders) => {
      if (err) {
        console.error("Error fetching local orders:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch local orders",
          error: err.message,
        });
      }

      let updatedOrders = [];

      for (const order of orders) {
        const liveUrl = `${apiUrl}product-order/v2/api/productOrder/${order.order_id}`;
        try {
          const liveRes = await axios.get(liveUrl, { headers });
          const liveStatus = liveRes?.data?.state;

          const characteristics =
            liveRes?.data?.productOrderItem?.[0]?.product
              ?.productCharacteristic;
          const access_casr = characteristics?.find(
            (c) => c.name === "accessCASR"
          )?.value;

          const partner_order_reference = characteristics?.find(
            (c) => c.name === "partnerOrderReference"
          )?.value;

          const broadband_username = characteristics?.find(
            (c) => c.name === "broadbandUsername"
          )?.value;

          const supplier_service_id = characteristics?.find(
            (c) => c.name === "supplierServiceId"
          )?.value;

          if (liveStatus && liveStatus !== order.status) {
            const updateSql = `UPDATE tbl_orders SET 
            access_casr =?,
            status = ?,
            updated_at = NOW(),
            partner_order_reference = ?,
            broadband_username = ?,
            supplier_service_id = ?
            WHERE order_id = ?`;
            db.query(
              updateSql,
              [
                access_casr,
                liveStatus,
                partner_order_reference,
                broadband_username,
                supplier_service_id,
                order.order_id,
              ],
              (updateErr) => {
                if (updateErr) {
                  console.error(
                    `Failed to update order ${order.order_id}:`,
                    updateErr.message
                  );
                }
              }
            );

            updatedOrders.push({
              order_id: order.order_id,
              old_status: order.status,
              new_status: liveStatus,
            });
          }
        } catch (apiErr) {
          console.error(
            `Live API error for order ${order.order_id}:`,
            apiErr.message
          );
        }
      }

      return res.status(200).json({
        success: true,
        message: "Order status sync completed",
        updated_count: updatedOrders.length,
        updated_orders: updatedOrders,
      });
    });
  } catch (err) {
    console.error("Error in updateOrderStatus:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update order statuses",
      error: err.message,
    });
  }
};

// Simple test function to verify controller is working
const testConnection = async (req, res) => {
  try {
    res.json({
      message: "User controller is working correctly",
      dbConnectionAvailable: !!db,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in test function:", error);
    res
      .status(500)
      .json({ error: "Test function failed", message: error.message });
  }
};

module.exports = {
  userLogin,
  userRegister,
  changePassword,
  forgotPassword,
  resetPassword,
  userUpdate,
  saveOrder,
  deleteOrder,
  orderDashboard,
  updateOrderStatus,
  testConnection,
};
