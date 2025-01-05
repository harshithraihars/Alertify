// const puppeteer = require('puppeteer-core');

// (async () => {
//     // connecting to the browser
//   const browser = await puppeteer.launch({
//     executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Correctly escaped path
//   });
//   const url = 'https://www.flipkart.com/vikyuvi-vikfit-gear-pro-1-28hd-display-150-watch-faces-spo2-social-notification-alert-smartwatch/p/itm97530495297f6?pid=SMWH48YS6TDHHQTJ&lid=LSTSMWH48YS6TDHHQTJ44DGLU&marketplace=FLIPKART&store=ajy%2Fbuh&srno=b_1_2&otracker=browse&fm=organic&iid=en_ZGj1RxdIUrgyq8yBG-EIlaqwjPnD0GifethI58TI3bIsxgEcuIZh-3zjxAnUdgA30y9hDYQB_jcV5pGQaIZKHA%3D%3D&ppt=browse&ppn=browse&ssid=5tz9x6vwcw0000001735743013087';
//   const page = await browser.newPage();
// //   goes to the specified url wait untill the browser is loaded
//   await page.goto(url, { waitUntil: 'load', timeout: 0 });

//   const priceSelector = '.CxhGGd';
//   const price = await page.$eval(priceSelector, el => el.innerText);
//   const imageSelector = '.jLEJ7H';
//   await page.waitForSelector(imageSelector);

//   // Get the 'src' attribute of the image
//   const imageSrc = await page.$eval(imageSelector, img => img.src);
//   console.log(`The price of the product is ${price}`);
//   console.log(imageSrc)
//   await browser.close();
// })();

const express = require("express");
const dotenv=require("dotenv")
const cron=require("node-cron")
const cors = require("cors");
dotenv.config({})
const router = require("./route/productRoute");
const connectDb = require("./db/connectdb");
const { periodicCheck } = require("./periodic");

const app = express();

// Use CORS and JSON parsing middleware before defining routes
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON bodies for incoming requests

// Define routes
app.use("/", router);

const PORT = 3000;

// Connect to the database
connectDb()
  .then(() => {
    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
      console.log("checking");
      periodicCheck()
      
      // cron.schedule('* * * * *', () => {
      //   console.log("Running periodic check...");
      //   periodicCheck();  // Run the function every minute
      // });
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the app if the DB connection fails
  });
