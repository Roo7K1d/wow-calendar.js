// Dependencies

const moment = require("moment");

// Import the utility functions

let { getEventData } = require("./utils/getEventData.js");
let { scrapeEvents } = require("./utils/scrapeEvents.js");

// Export the functions

module.exports = {
    getActiveEvents,
    getAllEvents,
    getEvent
};

/**
 * A WoW event object.
 * @typedef {Object} Event
 * 
 * @property {String} category The WoWHead category of the event.
 * @property {String} categoryName The name of the WoWHead category of the event.
 * @property {Int8Array} duration0 The minimum duration in hours.
 * @property {Int8Array} duration1 The maximum duration in hours.
 * @property {Date} endDate The end date of the event when it was initially released.
 * @property {Int8Array} id The event ID.
 * @property {String} name The name of the event.
 * @property {Date} startDate The start date of the event when it was initially released.
 * @property {Array<EventOccurence>} occurrences An array of all occurrences of the event.
 * @property {Int8Array} filtertype The WoWHead filter type of the event.
 * @property {Float32Array} rec The WoWHead rec of the event.
 * @property {Int8Array} popularity The WoWHead popularity of the event.
 * @property {String} description The description of the event.
 * @property {String} descriptionLocale The locale of the description of the event.
 * @property {Boolean} descriptionFallback Whether the description of the event is a fallback to "en".
 * @property {String} eventIconURL The URL to the event icon.
 * 
 */

/**
 * A WoW event occurence object.
 * @typedef {Object} EventOccurence
 * 
 * @property {Date} start The start date of the event.
 * @property {Date} end The end date of the event.
 * 
 */

/**
 * Retrieves all events from the events list from WoWHead
 *
 * @param  {String}     [locale="en"]   The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise<Array<Event>>}      Returns an array of all event objects
 * 
 * @author RootK1d
 * @since  2.0.0
 * @type   {Event}
 */

async function getAllEvents(locale) {
    // If no locale is provided, default to "en"
    if (!locale) locale = "en";

    return scrapeEvents(locale);
}



/**
 * Retrieves all events from the events list from WoWHead
 *
 * @param  {String}     [locale="en"]   The desired locale of the results, e.g. "de", "en", "es".
 * 
 * @return {Promise<Array<Event>>}      Returns an array of all event objects (+ event descriptions)
 * 
 * @author RootK1d
 * @since  2.2.0
 * @type   {Event}
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

                        // Get the event data
                        let event = await getEventData(locale, filteredResults[i].id)

                        // Add the event to the activeEvents array
                        filteredResults[i].description = event.description;
                        filteredResults[i].descriptionLocale = event.descriptionLocale;
                        filteredResults[i].descriptionFallback = event.descriptionFallback;
                        filteredResults[i].eventIconURL = event.eventIconURL;
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
 * @return {Promise<Event>}            Returns an event object.
 * 
 * @author RootK1d
 * @since  2.3.0
 * @type   {Event}
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

        // Get the event data
        let event = await getEventData(locale, filteredResults[0].id)

        // Add the event data to the event object
        filteredResults[0].description = event.description;
        filteredResults[0].descriptionLocale = event.descriptionLocale;
        filteredResults[0].descriptionFallback = event.descriptionFallback;
        filteredResults[0].eventIconURL = event.eventIconURL;

        return filteredResults[0];
    });

    return event;

}