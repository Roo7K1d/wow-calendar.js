const axios = require('axios');
const cheerio = require("cheerio");
const moment = require("moment");

let events = [];

module.exports = {
    getActiveEvents,
    getAllEvents
};

function getStringBetween(rawString, startingString, endingString) {
    return rawString.substring(
        rawString.indexOf(startingString) + 1,
        rawString.lastIndexOf(endingString)
    );
}


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

/**
 * Retrieves all events from the events list from WoWHead
 *
 * @param  {String}     [locale]    The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise}                Returns an array of all event objects (+ event descriptions)
 * 
 * @author RootK1d
 * @since  2.0.0
 * @type   {Function}
 */

function getAllEvents(locale) {
    // If no locale is provided, default to "en"
    if (!locale) locale = "en";

    return scrapeEvents(locale);
}



/**
 * Retrieves all events from the events list from WoWHead
 *
 * @param  {String}     [locale]    The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise}                Returns an array of all event objects
 * 
 * @author RootK1d
 * @since  2.2.0
 * @type   {Function}
 */

function getActiveEvents(locale) {

    // If no locale is provided, default to "en"
    if (!locale) locale = "en";

    let activeEvents = [];

    let result = scrapeEvents(locale).then(async (result) => {
        // Filter out all events that are not active according to the occurrence array

        let filteredResults = result.filter((event) => {
            return event.occurrences.length > 0;
        });

        for (let i = 0; i < filteredResults.length; i++) {

            //Remove all events that have [] or # in their name

            if (!filteredResults[i].name.includes("[]") && !filteredResults[i].name.includes("#")) {

                for (let j = 0; j < filteredResults[i].occurrences.length; j++) {

                    // Convert the start and end dates to ISO strings
                    let start = new Date(filteredResults[i].occurrences[j].start).toISOString();
                    let end = new Date(filteredResults[i].occurrences[j].end).toISOString();

                    // Add active events to the activeEvents array
                    if (moment().isBetween(start, end)) {

                        // Get the event descriptions
                        try {
                            let description = axios.get(`https://www.wowhead.com/${locale}/event=${JSON.parse(filteredResults[i].id)}`).then(({ data }) => {
                                let metaTag = data.match('<meta name="description" content="(?:.*)">', 'gi');
                                return metaTag[0].replace('<meta name="description" content="', '').replace('">', '');
                            });

                            // Add the description to the event object and push it to the activeEvents array
                            filteredResults[i].description = await description;
                            filteredResults[i].descriptionLocale = locale;
                            // Set a flag to indicate that the description request was successful and no fallback was used
                            filteredResults[i].descriptionFallback = false;
                            activeEvents.push(filteredResults[i]);


                        } catch {

                            //Fallback to "en" if the chosen description locale request results in too many redirects
                            let description = axios.get(`https://www.wowhead.com/en/event=${JSON.parse(filteredResults[i].id)}`).then(({ data }) => {
                                let metaTag = data.match('<meta name="description" content="(?:.*)">', 'gi');
                                return metaTag[0].replace('<meta name="description" content="', '').replace('">', '');
                            });

                            // Add the description to the event object and push it to the activeEvents array
                            filteredResults[i].description = await description;
                            filteredResults[i].descriptionLocale = "en";
                            // Set a flag to indicate that the description has been replaced with a fallback
                            filteredResults[i].descriptionFallback = true;
                            activeEvents.push(filteredResults[i]);
                        }
                    }
                }
            }

        }

        return activeEvents;

    });

    return result;

}