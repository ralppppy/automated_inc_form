const puppeteer = require("puppeteer");
const path = require("path");

// Creates a pdf document from htmlContent and saves it to outputPath
async function createPdf(
  htmlContent,
  options = { path: `${__dirname}/PDFfile/Output.pdf`, format: "A4" }
) {
  // launchs a puppeteer browser instance and opens a new page
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--start-maximized",
      "--force-device-scale-factor=0.5",
    ],
    defaultViewport: null,

    headless: true,
  });
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.setViewport({ width: 3840 - 840, height: 2400 - 840 });
  // wait until everything is loaded before rendering the PDF
  //await page.goto(`data: text/html, ${htmlContent}`, { waitUntil: 'networkidle0' });

  // sets the html of the page to htmlContent argument
  await page.setContent(htmlContent);
  // await page.addStyleTag({ path: path.join('app', 'pdf', 'assets', 'css', 'fullcalendar-scheduler.css') });
  // await page.addStyleTag({ path: path.join('app', 'pdf', 'assets', 'css', 'custom.css') });

  // Prints the html page to pdf document and saves it to given outputPath
  await page.emulateMediaType("print");
  await page.waitForTimeout(3000);

  const file = await page.pdf({ ...options, printBackground: true });
  // Closing the puppeteer browser instance
  // await browser.close();

  return file; //sdf file;
}

module.exports = createPdf;
