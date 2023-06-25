const puppeteer = require("puppeteer")


module.exports = {
    getActiveEvents,
    getAllEvents
}

async function getActiveEvents() {
    return await scrapeEventsFromWowhead('table > tbody > tr.checked');
}


async function getAllEvents() {
    return await scrapeEventsFromWowhead('table > tbody > tr');
}

async function scrapeEventsFromWowhead(selector) {
    let browser;
    try {
        browser = await puppeteer.launch({
            //headless: false    <-- For Testing Purposes
        });
        const page = await browser.newPage();

        await page.goto(`https://www.wowhead.com/events`)

        const result = await page.$$eval(selector, rows => {
            return rows.map(row => {
            const columns = row.querySelectorAll("td");
            return {
                name: columns[1].innerText,
                duration: columns[2].innerText,
                category: columns[3].innerText
            };
            });
        });

        return result;
    } catch (error) {
        console.error("Error occurred during scraping:", error);
    } finally {
        if(browser)
            await browser.close();
    }
}