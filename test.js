const calendar = require("./index.js")

calendar.getActiveEvents().then(events => {
    console.log(events)
})