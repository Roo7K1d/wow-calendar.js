const calendar = require("./index.js")

calendar.getActiveEvents("de").then((result) => {
    console.log(result);
});