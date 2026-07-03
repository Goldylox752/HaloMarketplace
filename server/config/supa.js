// ==========================================
// HALO MARKETPLACE
// Supabase Configuration
// config/supa.js
// ==========================================

require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

// ==========================================
// ENVIRONMENT VARIABLES
// ==========================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is missing.");
}

if (!supabaseAnonKey) {
    throw new Error("SUPABASE_ANON_KEY is missing.");
}

if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");
}

// ==========================================
// PUBLIC CLIENT
// ==========================================

const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// ==========================================
// ADMIN CLIENT
// ==========================================

const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// ==========================================
// HEALTH CHECK
// ==========================================

async function checkSupabaseConnection() {

    try {

        const { error } = await supabase
            .from("_health")
            .select("*")
            .limit(1);

        if (error && error.code !== "PGRST205") {
            throw error;
        }

        console.log("✅ Supabase Connected");

        return true;

    } catch (err) {

        console.error("❌ Supabase Connection Failed");
        console.error(err.message);

        return false;

    }

}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    supabase,
    supabaseAdmin,
    checkSupabaseConnection
};
