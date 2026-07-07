 // ========================================
// Halo Marketplace
// Supabase Configuration
// config/supabase.js
// ========================================

require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");


// ========================================
// Validate Environment Variables
// ========================================

if (!process.env.SUPABASE_URL) {

    console.warn(
        "⚠️ SUPABASE_URL is missing"
    );

}


if (!process.env.SUPABASE_SERVICE_KEY) {

    console.warn(
        "⚠️ SUPABASE_SERVICE_KEY is missing"
    );

}


// ========================================
// Supabase Client
// ========================================

const supabase = createClient(

    process.env.SUPABASE_URL,

    process.env.SUPABASE_SERVICE_KEY,

    {

        auth: {

            autoRefreshToken:false,

            persistSession:false

        }

    }

);


// ========================================
// Export
// ========================================

module.exports = supabase;