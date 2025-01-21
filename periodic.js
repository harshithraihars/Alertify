// const nodemailer = require("nodemailer");
// const puppeteer = require("puppeteer-core");
// const chromium=require("@sparticuz/chromium-min")
// const productModel = require("./Schema/productSchema");
// const checkPriceDrop = (product) => {

//   (async () => {
//     const islocal=process.env.CHROME_EXECUTABLE_PATH
//     // connecting to the browser
//     const browser = await puppeteer.launch({
//       args: islocal?puppeteer.defaultArgs():[...chromium.args,'--hide-scrollbars','--incognito','--no-sandbox'],
//       defaultViewport: chromium.defaultViewport,
//       executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath('https://my-media-assets.s3.amazonaws.com/chromium-v126.0.0-pack.tar'),
//       headless: chromium.headless,
//     });

//     const page = await browser.newPage();
//     const url = product.product_url;

//     await page.goto(url);
//     const priceSelector = ".CxhGGd";
//     const price = await page.$eval(priceSelector, (el) => el.innerText);
//     const actual_price = parseFloat(price.replace(/[₹,]/g, ""));
//     //   const imageSelector = '.jLEJ7H';
//     //   await page.waitForSelector(imageSelector);

//     // Get the 'src' attribute of the image
//     //   const imageSrc = await page.$eval(imageSelector, img => img.src);
//     console.log(
//       `The price of the product is ${actual_price}, limit price is ${product.price_limit}`
//     );
//     if (actual_price <= product.price_limit) {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL,
//           pass: process.env.PASSWORD,
//         },
//       });

//       const mailOptions = {
//         from: process.env.EMAIL,
//         to: "sigmaharshrai@gmail.com", // You can customize this to the user’s email
//         subject: `Price Alert: ${product.product_name}`,
//         text: `Hello,

//             The price of "${product.product_name}" has reached your desired limit!

//             Current Price: ₹${actual_price}
//             Price Limit: ₹${product.price_limit}

//             Thank you for using our Price Tracker service.

//             Best regards,
//             The Price Tracker Team`,
//       };

//       try {
//         const info = await transporter.sendMail(mailOptions);
//       } catch (error) {
//         console.log("Error sending email:", error.message);
//       }
//     }

//     //   console.log(imageSrc)
//     await browser.close();
//   })();
// };
// const periodicCheck = async () => {
//   const products = await productModel.find();
//   products.map((product) => {
//     checkPriceDrop(product);
//   });
// };
// module.exports = { periodicCheck };

const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const puppeteercore = require("puppeteer-core");
const chromium=require("@sparticuz/chromium-min")
const productModel = require("./Schema/productSchema");
const checkPriceDrop = async (product) => {
  try {
    console.log("Launching Puppeteer...");

    let browser = null;

  if (process.env.NODE_ENV === 'development') {
    Logger.log('Development browser: ');
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }
  if (process.env.NODE_ENV === 'production') {
    Logger.log('Development production: ');
    browser = await puppeteercore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
    const page = await browser.newPage();

    const url = product.product_url;

    // Navigate to the product page
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    try {
      const priceSelector = ".CxhGGd"; // Update the selector for your target site
      await page.waitForSelector(priceSelector, { timeout: 20000 });

      const price = await page.$eval(priceSelector, (el) => el.innerText);
      const actual_price = parseFloat(price.replace(/[₹,]/g, ""));
      console.log(
        `The price of the product is ₹${actual_price}, limit price is ₹${product.price_limit}`
      );

      if (actual_price <= product.price_limit) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL,
          to: "sigmaharshrai@gmail.com",
          subject: `Price Alert: ${product.product_name}`,
          text: `Hello,

The price of "${product.product_name}" has reached your desired limit!

Current Price: ₹${actual_price}
Price Limit: ₹${product.price_limit}

Thank you for using our Price Tracker service.

Best regards,
The Price Tracker Team`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully.");
        } catch (emailError) {
          console.error("Error sending email:", emailError.message);
        }
      }
    } catch (scrapingError) {
      console.error("Error scraping price:", scrapingError.message);
    }

    await browser.close();
  } catch (error) {
    console.error("Error in checkPriceDrop:", error.message);
  }
};

const periodicCheck = async () => {
  try {
    console.log("Fetching products from the database...");
    const products = await productModel.find();
    for (const product of products) {
      await checkPriceDrop(product);
    }
  } catch (error) {
    console.error("Error fetching products:", error.message);
  }
};

module.exports = { periodicCheck };

