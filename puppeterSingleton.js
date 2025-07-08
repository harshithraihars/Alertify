const puppeteer = require("puppeteer");
let browser = null;
const getBrowser = async () => {
  if (!browser) {
    const launchOptions =
      process.env.NODE_ENV === "production"
        ? {
            executablePath: "/usr/bin/chromium",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: true,
          }
        : {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          };

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  return browser;
};

module.exports=getBrowser
