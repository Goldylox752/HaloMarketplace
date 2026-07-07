// ========================================
// Halo Marketplace
// Supabase Authentication Middleware
// middleware/authMiddleware.js
// ========================================

const supabase = require("../config/supabase");


// ========================================
// Verify Supabase User
// ========================================

module.exports = async (req, res, next) => {

    try {


        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                success:false,

                message:"Authentication required."

            });

        }



        const token =
            authHeader.replace(
                "Bearer ",
                ""
            );



        if (!token) {

            return res.status(401).json({

                success:false,

                message:"Invalid authentication token."

            });

        }



        const {
            data,
            error

        } = await supabase.auth.getUser(token);



        if (error || !data.user) {

            return res.status(401).json({

                success:false,

                message:"Invalid or expired token."

            });

        }



        // Attach user to request

        req.user = data.user;


        next();



    } catch(err) {


        console.error(
            "Auth Middleware Error:",
            err
        );


        return res.status(500).json({

            success:false,

            message:"Authentication failed."

        });


    }

};