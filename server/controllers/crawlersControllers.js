const puppeteer = require('puppeteer');

/**
 * Chemist Warehouse crawler
 * @param {*} page - Puppeteer Page
 */
const chemistCrawler = async (page) =>
  await page.evaluate(() => {
    // Product name
    const name = document.querySelector('.product-name > h1').innerText.trim();

    // image
    const image = document.querySelector('img.product-thumbnail').src.trim();

    // pricing
    const discounted_price = document
      .querySelector('.product__price')
      .innerText.match(/[0-9]+\.[0-9][0-9]/g)[0];
    let retail_price = document
      .querySelector('.retailPrice')
      .innerText.match(/[0-9]+\.[0-9][0-9]/g)[0];
    if (retail_price === '0.00') {
      retail_price = discounted_price;
    }

    return {
      url: document.URL,
      provider: 'Chemist Warehouse',
      name,
      image,
      discounted_price,
      retail_price
    };
  });

/**
 * Crawler Routing
 * -----
 * Each hostname has specific crawler, this func is to
 *  bind Hostname & Crawler
 * @param {*} page - Puppeteer Page
 * @param {*} hostname - url hostname
 */
const crawlerRouting = async (page, hostname) => {
  switch (hostname) {
    case 'www.chemistwarehouse.com.au':
      return await chemistCrawler(page, hostname);

    default:
      return null;
  }
};

/**
 * Controller that handbble crawling product given specific website
 * @param {*} req - HTTP Request
 * @param {*} res -
 * @param {*} next
 */
exports.productCrawler = async (req, res, next) => {
  const url = new URL(req.query.url);
  const browser = await puppeteer.launch({ headless: true });

  // Open page with specified url
  const page = await browser.newPage();

  // Remove CSS & Image & Font
  await page.setRequestInterception(true);

  page.on('request', (req) => {
    if (
      req.resourceType() === 'stylesheet' ||
      req.resourceType() === 'font' ||
      req.resourceType === 'image'
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(url.href, { waitUntil: 'domcontentloaded' });

  // Evalute and crawl based on the hostname
  const data = await crawlerRouting(page, url.hostname);

  await browser.close();

  res.status(200).json({
    status: 'success',
    data: {
      data
    }
  });
};
