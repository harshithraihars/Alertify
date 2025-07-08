// const express = require("express");
// const dotenv=require("dotenv")
// const cron=require("node-cron")
// const cors = require("cors");
// dotenv.config({})
// const router = require("./route/productRoute");
// const connectDb = require("./db/connectdb");
// const { periodicCheck } = require("./periodic");

// const app = express();

// // Use CORS and JSON parsing middleware before defining routes
// app.use(cors()); // Enable cross-origin requests
// app.use(express.json()); // Parse JSON bodies for incoming requests

// // Define routes
// app.use("/", router);

// const PORT = 3000;

// // Connect to the database
// connectDb()
//   .then(() => {
//     // Start the server only after successful DB connection
//     app.listen(PORT, () => {
//       console.log(`Listening on port ${PORT}...`);
//       console.log("checking");
//       periodicCheck()

//       // cron.schedule('* * * * *', () => {
//       //   console.log("Running periodic check...");
//       //   periodicCheck();  // Run the function every minute
//       // });
//     });
//   })
//   .catch((err) => {
//     console.error("Database connection failed:", err);
//     process.exit(1); // Exit the app if the DB connection fails
//   });

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const router = require("./route/productRoute");
const connectDb = require("./db/connectdb");

const agenda = require("./Agenda/agenda"); // Agenda instance
require("./Agenda/agendaJobSetup"); // Job definition
const { enqueAllProducts } = require("./enqueueProducts");
const getBrowser = require("./puppeterSingleTon");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", router);

// Connect to DB and start everything
connectDb()
  .then(async () => {
    console.log("Connected to MongoDB");

    // Start Agenda
    agenda.on("ready", async () => {
      console.log("agenda started");
      
      await agenda.start();
      console.log("Agenda started");

      // Enqueue all products once
      await enqueAllProducts();
    });

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" DB connection failed:", err);
    process.exit(1);
  });

const shutdown = async () => {
  console.log("\nShutting down...");

  const browser = await getBrowser();
  await browser.close();
  console.log("Browser closed");

  await agenda.stop();
  console.log("Agenda stopped");

  process.exit(0);
};

// for ctrl c and render stops
process.on("SIGINT", shutdown); // Local Ctrl + C
process.on("SIGTERM", shutdown);
