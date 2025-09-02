const mysql = require("mysql2/promise");

const promisePool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function logOrderAction({ productId, action, requestedBy, requestPayload, responsePayload, status, errorMessage }) {
  try {
    await promisePool.execute(
      `INSERT INTO logs
       (product_id, action, requested_by, request_payload, response_payload, status, error_message, created_at)
       VALUES (?,?,?,?,?,?,?, NOW())`,
      [
        productId,
        action,
        requestedBy,
        requestPayload ? JSON.stringify(requestPayload) : null,
        responsePayload ? JSON.stringify(responsePayload) : null,
        status,
        errorMessage || null
      ]
    );
  } catch (err) {
    console.error("DB logging failed:", err.message);
  }
}

module.exports = { logOrderAction };
