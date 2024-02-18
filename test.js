const calendar = require("./index.js")

calendar.getActiveEvents().then((result) => {
    console.log(result);
});