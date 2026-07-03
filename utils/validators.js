// ==========================================
// Validation Helpers
// ==========================================

exports.isEmail = email => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        .test(email);

};

exports.isPhone = phone => {

    return /^[0-9+\-()\s]{7,20}$/

        .test(phone);

};

exports.isUUID = value => {

    return /^[0-9a-fA-F-]{36}$/

        .test(value);

};
