// Dependencies

const moment = require("moment");

// Import the utility functions

let { getEventDescription } = require("./utils/getEventDescription.js");
let { scrapeEvents } = require("./utils/scrapeEvents.js");

// Export the functions

module.exports = {
    getActiveEvents,
    getAllEvents,
    getEvent
};

/**
 * Retrieves all events from the events list from WoWHead
 *
 * @param  {String}     [locale]    The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise}                Returns an array of all event objects
 * 
 * @author RootK1d
 * @since  2.0.0
 * @type   {Function}
 */

async function getAllEvents(locale) {
    // If no locale is provided, default to "en"
    if (!locale) locale = "en";

    return scrapeEvents(locale);
}



/**
 * Retrieves all events from the events list from WoWHead
 *
 * @param  {String}     [locale]    The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise}                Returns an array of all event objects (+ event descriptions)
 * 
 * @author RootK1d
 * @since  2.2.0
 * @type   {Function}
 */

async function getActiveEvents(locale) {

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

                        // Get the event description
                        let event = await getEventDescription(locale, filteredResults[i].id)

                        // Add the event to the activeEvents array
                        filteredResults[i].description = event.description;
                        filteredResults[i].descriptionLocale = event.descriptionLocale;
                        filteredResults[i].descriptionFallback = event.descriptionFallback;
                        activeEvents.push(filteredResults[i]);
                    }
                }
            }

        }

        return activeEvents;

    });

    return result;

}



/**
 * Fetches a single event by its ID from the events list from WoWHead.
 *
 * @param  {Int8Array}     id          The event ID.
 * @param  {String}        [locale]    The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise}                   Returns an event object.
 * 
 * @author RootK1d
 * @since  2.3.0
 * @type   {Function}
 */

async function getEvent(id, locale) {

    //If no id is provided, throw error

    if (!id) console.throw("No Event ID was provided.")

    // If no locale is provided, default to "en"
    if (!locale) locale = "en";

    let event = scrapeEvents(locale).then(async (result) => {

        //Filter out the event by ID

        let filteredResults = result.filter((event) => {
            return event.id === id;
        });

        // Get the event description
        let description = await getEventDescription(locale, filteredResults[0].id)

        // Add the event description to the event object
        filteredResults[0].description = description.description;
        filteredResults[0].descriptionLocale = description.descriptionLocale;
        filteredResults[0].descriptionFallback = description.descriptionFallback;

        return filteredResults[0];
    });

    return event;

}