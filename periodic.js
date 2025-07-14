const nodemailer = require("nodemailer");
const productModel = require("./Schema/productSchema");
const getBrowser = require("./puppeterSingleton");

const checkPriceDrop = async (product) => {
  try {
    console.log("Launching Puppeteer...");

    const browser = await getBrowser();

    const page = await browser.newPage();

    const url = product.product_url;

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    try {
      const priceSelector = ".CxhGGd";
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
          to: product.userEmail,
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
          await productModel.findOneAndDelete({
            product_name: product.product_name,
          });
          console.log("product deleted succesfully");
        } catch (emailError) {
          console.error("Error sending email:", emailError.message);
        }
      }
    } catch (scrapingError) {
      console.error("Error scraping price:", scrapingError.message);
    } finally {
      await page.close();
      console.log("page got closed");
    }
  } catch (error) {
    console.error("Error in checkPriceDrop:", error.message);
  }
};


const periodicCheck=async()=>{
  const products = await productModel.find();
    for (let product of products) {
      await checkPriceDrop(product)
    }
}
module.exports={periodicCheck}