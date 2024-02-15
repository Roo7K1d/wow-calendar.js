const calendar = require("./new_index.js")

calendar.getActiveEvents().then((result) => {
    console.log(result);
});