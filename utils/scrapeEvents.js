// Dependencies

const axios = require('axios');
const cheerio = require("cheerio");

// Import the utility functions

let { getStringBetween } = require("./getStringBetween.js");

/**
 * The core scraping function for the events list from WoWHead.
 *
 * @param  {String}     [locale]    The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise}                Returns an array of objects of all events (no descriptions - request flood protection)
 * 
 * @author RootK1d
 * @since  2.0.0
 * @type   {Function}
 */

function scrapeEvents(locale) {

    // Scrape the events list from WoWHead

    let result = axios.get(`https://www.wowhead.com/${locale}/events`).then(({ data }) => {

        events = [];

        const $ = cheerio.load(data);
        let site = $.html();

        // Extract the events data from the site using regex

        let eventsData = Array.from(("{" + getStringBetween(getStringBetween(site, "var myTabs", "myTabs.flush()"), "{\"", ");\nnew Listview({")).matchAll('{"category":\\d*,"categoryName":"(?:.*?)","duration0":\\d*,"duration1":\\d*,"endDate":(?:"\\d*-\\d*-\\d* \\d*:\\d*:\\d*"|null),"id":\\d*,"name":"(?:.*?)","startDate":(?:"\\d*-\\d*-\\d* \\d*:\\d*:\\d*"|null),"occurrences":(?:\\[(?:{"start":(?:".*?")),"end":(?:".*?")}\\]|\\[\\]),"filtertype":(?:\\W*\\d*),"rec":(?:\\W*\\d*),"popularity":\\d*}', 'gi'))

        eventsData.forEach((event) => {
            events.push(JSON.parse(event[0]));
        });

        return events;

    })

    return result;

}

module.exports = {scrapeEvents};