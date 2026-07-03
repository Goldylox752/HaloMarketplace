// ==========================================
// Sanitizer
// ==========================================

const xss = require("xss");

exports.clean = value => {

    if (typeof value !== "string") {

        return value;

    }

    return xss(value.trim());

};

exports.cleanObject = object => {

    const cleaned = {};

    Object.keys(object).forEach(key => {

        cleaned[key] = exports.clean(

            object[key]

        );

    });

    return cleaned;

};
