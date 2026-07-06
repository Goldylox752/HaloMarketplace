// ========================================
// Halo Marketplace
// utils/cache.js
// Redis Cache Utility
// ========================================

const { createClient } = require("redis");

// ========================================
// Redis Client
// ========================================

let client = null;
let connected = false;

const initializeCache = async () => {
    try {

        client = createClient({
            url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
        });

        client.on("connect", () => {
            console.log("🟢 Redis Connected");
        });

        client.on("error", (err) => {
            connected = false;
            console.error("🔴 Redis Error:", err.message);
        });

        client.on("ready", () => {
            connected = true;
        });

        await client.connect();

    } catch (err) {
        connected = false;
        console.error("Redis unavailable.");
    }
};

// ========================================
// Get
// ========================================

const get = async (key) => {

    if (!connected) return null;

    try {
        const value = await client.get(key);

        if (!value) return null;

        return JSON.parse(value);

    } catch (err) {
        return null;
    }

};

// ========================================
// Set
// ========================================

const set = async (
    key,
    value,
    ttl = 300
) => {

    if (!connected) return false;

    try {

        await client.set(
            key,
            JSON.stringify(value),
            {
                EX: ttl
            }
        );

        return true;

    } catch (err) {
        return false;
    }

};

// ========================================
// Delete
// ========================================

const del = async (key) => {

    if (!connected) return;

    try {
        await client.del(key);
    } catch (err) {}
};

// ========================================
// Exists
// ========================================

const exists = async (key) => {

    if (!connected) return false;

    try {
        return (await client.exists(key)) === 1;
    } catch (err) {
        return false;
    }

};

// ========================================
// Increment
// ========================================

const increment = async (key) => {

    if (!connected) return null;

    try {
        return await client.incr(key);
    } catch (err) {
        return null;
    }

};

// ========================================
// Expire
// ========================================

const expire = async (
    key,
    ttl
) => {

    if (!connected) return;

    try {
        await client.expire(key, ttl);
    } catch (err) {}

};

// ========================================
// Flush All
// ========================================

const flush = async () => {

    if (!connected) return;

    try {
        await client.flushAll();
    } catch (err) {}

};

// ========================================
// Disconnect
// ========================================

const disconnect = async () => {

    if (!client) return;

    try {
        await client.quit();
    } catch (err) {}

};

// ========================================
// Cache Wrapper
// ========================================

const remember = async (
    key,
    ttl,
    callback
) => {

    const cached = await get(key);

    if (cached !== null) {
        return cached;
    }

    const data = await callback();

    await set(key, data, ttl);

    return data;

};

// ========================================
// Status
// ========================================

const isConnected = () => connected;

// ========================================
// Export
// ========================================

module.exports = {

    initializeCache,

    get,
    set,
    del,
    exists,

    increment,
    expire,
    flush,

    remember,

    disconnect,

    isConnected

};
