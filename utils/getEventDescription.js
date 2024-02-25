const axios = require('axios');

/**
 * Fetches an event description by its ID from the events list from WoWHead.
 *
 * @param  {String}    locale       The desired locale of the results, e.g. "de", "en", "es".
 * @param  {String}    id           The event ID.
 * 
 * @return {Promise}                Returns an event description object.
 * 
 * @author RootK1d
 * @since  2.2.0
 * @type   {Function}
 */

async function getEventDescription(locale, id) {
    // Get the event descriptions
    try {
        // Get the event descriptions for the chosen locale

        let description = axios.get(`https://www.wowhead.com/${locale}/event=${id}`).then(({ data }) => {
            let metaTag = data.match('<meta name="description" content="(?:.*)">', 'gi');
            return metaTag[0].replace('<meta name="description" content="', '').replace('">', '');
        });

        // Return the description and the locale
        return {
            description: await description,
            descriptionLocale: locale,
            descriptionFallback: false
        };


    } catch {
        //Fallback to "en" if the chosen description locale request results in too many redirects

        let description = axios.get(`https://www.wowhead.com/en/event=${id}`).then(({ data }) => {
            let metaTag = data.match('<meta name="description" content="(?:.*)">', 'gi');
            return metaTag[0].replace('<meta name="description" content="', '').replace('">', '');
        });

        // Return the description and the locale
        return {
            description: await description,
            descriptionLocale: "en",
            descriptionFallback: true
        };
    }
}

module.exports = {getEventDescription};