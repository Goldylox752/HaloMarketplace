```javascript
// ========================================
// Halo Marketplace
// server.js
// ========================================

require("dotenv").config();

const http = require("http");
const app = require("./app");

const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {

    try {

        // Connect PostgreSQL / Supabase
        await connectDatabase();

        const server = http.createServer(app);

        server.listen(PORT, () => {

            console.log("");
            console.log("======================================");
            console.log("🚀 Halo Marketplace");
            console.log("======================================");
            console.log(`Environment : ${process.env.NODE_ENV || "development"}`);
            console.log(`Server      : http://localhost:${PORT}`);
            console.log("======================================");
            console.log("");

        });

    }

    catch (err) {

        console.error(err);
        process.exit(1);

    }

}

startServer();
```
