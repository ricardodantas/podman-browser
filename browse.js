const { chromium } = require('playwright');

(async () => {
    const url = process.env.TARGET_URL;
    const waitMs = parseInt(process.env.WAIT_MS || '2000', 10);
    const outputMode = process.env.OUTPUT_MODE || 'text';
    const selector = process.env.SELECTOR || '';

    if (!url) {
        console.error('Error: TARGET_URL environment variable is required');
        process.exit(1);
    }

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();

        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

        // Wait for selector if specified
        if (selector) {
            try {
                await page.waitForSelector(selector, { timeout: 10000 });
            } catch (e) {
                console.error('Warning: selector not found within timeout');
            }
        }

        // Additional wait for JS to settle
        await page.waitForTimeout(waitMs);

        if (outputMode === 'html') {
            const html = await page.content();
            console.log(html);
        } else {
            // Get text content, excluding script/style
            const text = await page.evaluate(() => {
                // Remove script and style elements
                const scripts = document.querySelectorAll('script, style, noscript');
                scripts.forEach(el => el.remove());
                return document.body.innerText;
            });
            console.log(text);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
