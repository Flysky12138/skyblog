import puppeteer from 'puppeteer-core'

void (async () => {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.TOKEN_BROWSERLESS}`,
      defaultViewport: { height: 900, width: 1600 },
      slowMo: 100
    })
    // const browser = await puppeteer.launch({
    //   channel: 'chrome',
    //   defaultViewport: { height: 900, width: 1600 },
    //   headless: true,
    //   slowMo: 100
    // })
    const page = await browser.newPage()
    await page.goto('https://blog.flysky.xyz')
    await page.screenshot({
      path: 'screenshot.png'
    })

    await browser.close()
  } catch (error) {
    console.log(error)
  }
})()
