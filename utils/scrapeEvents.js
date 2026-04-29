// Dependencies

const axios = require('axios');
const cheerio = require("cheerio");

/**
 * The core scraping function for the events list from WoWHead.
 *
 * @param  {String}     [locale]    The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise}                Returns an array of objects of all events (no descriptions - request flood protection)
 * 
 * @author RootK1d
 * @since  2.5.0
 * @type   {Function}
 */

async function scrapeEvents(locale) {

    // Scrape the events list from WoWHead

    let result = await axios.get(`https://www.wowhead.com/${locale}/events`).then(({ data }) => {

        const $ = cheerio.load(data);

        // Extract the events data from the site using JSON
        let events = $("script[id^='data.page.listPage.listviews']").html();

        return JSON.parse(events)[0].data

    })

    return result;

}

module.exports = {scrapeEvents};