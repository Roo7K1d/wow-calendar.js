const puppeteer = require("puppeteer")


module.exports = {
    getActiveEvents,
    getAllEvents
}

/**
 * Retrieves all active events from the events list from WoWHead
 *
 * @param  {String}     [locale]    The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise}                Returns an array of active event objects
 * 
 * @author RootK1d
 * @since  1.2.0
 * @type   {Function}
 */

function getActiveEvents(locale) {
    return scrapeEventsFromWowhead('table > tbody > tr.checked', locale);
}



/**
 * Retrieves all events from the events list from WoWHead
 *
 * @param  {String}     [locale]    The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise}                Returns an array of all event objects
 * 
 * @author RootK1d
 * @since  1.2.0
 * @type   {Function}
 */

function getAllEvents(locale) {
    return scrapeEventsFromWowhead('table > tbody > tr', locale);
}



async function scrapeEventsFromWowhead(selector, locale) {

    if (!locale) locale = "en";

    let browser;
    try {
        browser = await puppeteer.launch({
            //headless: false    <-- For Testing Purposes
        });
        const page = await browser.newPage();

        await page.goto(`https://www.wowhead.com/${locale}/events`)

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
        if (browser)
            await browser.close();
    }
}