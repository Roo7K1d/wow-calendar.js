/**
 * Returns a string between two other strings.
 *
 * @param  {String}    rawString            The raw string to search in.
 * @param  {String}    startingString       The starting string.
 * @param  {String}    endingString         The ending string.
 * 
 * @return {String}                         Returns the string between the two other strings.
 * 
 * @author RootK1d
 * @since  2.2.0
 * @type   {Function}
 */

function getStringBetween(rawString, startingString, endingString) {
    return rawString.substring(
        rawString.indexOf(startingString) + 1,
        rawString.lastIndexOf(endingString)
    );
}

module.exports = {getStringBetween};