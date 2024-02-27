const axios = require('axios');

/**
 * Fetches additional event data by its ID from the events list from WoWHead.
 *
 * @param  {String}    locale       The desired locale of the results, e.g. "de", "en", "es".
 * @param  {String}    id           The event ID.
 * 
 * @return {Promise}                Returns an event object (+ event description, event icon url).
 * 
 * @author RootK1d
 * @since  2.2.0
 * @type   {Function}
 */

async function getEventData(locale, id) {
    // Get the event data
    try {
        // Get the event descriptions for the chosen locale

        let data = axios.get(`https://www.wowhead.com/${locale}/event=${id}`).then(({ data }) => {
            let descMetaTag = data.match('<meta name="description" content="(?:.*)">', 'gi');
            let description = descMetaTag[0].replace('<meta name="description" content="', '').replace('">', '');

            let iconMetaTag = data.match('https:\/\/wow.zamimg.com\/images\/wow\/icons\/large\/calendar_(?:\\w*).jpg', 'gim');
            let iconURL = iconMetaTag[0];

            // Return the data

            return {
                description: description,
                descriptionLocale: locale,
                descriptionFallback: false,
                eventIconURL: iconURL
            }
        });

        // Return the data
        return await data;


    } catch {

        //Fallback to "en" if the chosen description locale request results in too many redirects

        let data = axios.get(`https://www.wowhead.com/en/event=${id}`).then(({ data }) => {
            let descMetaTag = data.match('<meta name="description" content="(?:.*)">', 'gi');
            let description = descMetaTag[0].replace('<meta name="description" content="', '').replace('">', '');

            let iconMetaTag = data.match('https:\/\/wow.zamimg.com\/images\/wow\/icons\/large\/calendar_(?:\\w*).jpg', 'gim');
            let iconURL = iconMetaTag[0];

            // Return the data
            return {
                description: description,
                descriptionLocale: "en",
                descriptionFallback: true,
                eventIconURL: iconURL
            }
        });

        return await data;
    }
}

module.exports = {getEventData};