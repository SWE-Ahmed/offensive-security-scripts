const { chromium, firefox, webkit } = require('playwright');

(async () => {
    const browser = await chromium.launchPersistentContext("context", {
        headless: false,
        recordHar: {path: "./har.har"}
    });  // Or 'firefox' or 'webkit'.

    const page = await browser.newPage({recordHar: {path: "./har.har"}});
    await page.goto('http://127.0.0.1:3000/#/', { waitUntil: "networkidle"});

    // Click on dismiss
    await page.getByText("Dismiss").click();

    await page.waitForTimeout(1000);

    // Log in
    await page.getByLabel('Show/hide account menu').click().then(async () => {

        await page.waitForTimeout(1000);
        await page.getByRole('menuitem', { name: 'Go to login page' }).click();
    })

    await page.waitForTimeout(1000);

    await page.locator("#email").fill("necro_kudo@icloud.com");
    await page.locator("#password").fill("ics344project");

    await page.waitForTimeout(1000);

    await page.locator("#loginButton").click().then(async() => {
        await page.waitForTimeout(1000);
    });

    // Generate Reviews
    await generateReview(page, 1);
    await generateReview(page, 2);
    await generateReview(page, 3);

    await page.waitForTimeout(5000);
    
    await browser.close();
})();

async function generateReview(page, productNumber){
    
    // Click Product & Write Review
    await (await page.locator("mat-card").all()).at(productNumber).click();
    await page.waitForTimeout(1000);
    await page.getByRole("textbox").fill("I like.");
    await page.waitForTimeout(1000);
    
    // Click Submit Review
    await page.locator("#submitButton").click().then(async() => {
        await page.waitForTimeout(1000);
    });

    await page.getByLabel("Close Dialog").click().then(async() => {
        await page.waitForTimeout(1000);
    });

    // Edit Comment
    await (await page.locator("mat-card").all()).at(productNumber).click();
    await page.waitForTimeout(1000);
    await page.getByText("Reviews").click();
    await page.waitForTimeout(1000);
    await page.getByText("I like.").first().click().then(async() => {
        await page.waitForTimeout(1000);
        await page.getByLabel('Text field to edit a product').fill("I like...");
        await page.waitForTimeout(1000);
        await (await page.getByLabel('Send the review').all()).at(1).click();
        await page.waitForTimeout(1000);
    })

    await page.getByLabel("Close Dialog").click().then(async() => {
        await page.waitForTimeout(1000);
    });
}