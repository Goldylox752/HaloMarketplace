// ==========================================
// SKU Generator
// ==========================================

const crypto = require("crypto");

module.exports = function generateSKU(prefix = "HALO") {

    const random = crypto.randomBytes(3)

        .toString("hex")

        .toUpperCase();

    return `${prefix}-${Date.now()}-${random}`;

};
