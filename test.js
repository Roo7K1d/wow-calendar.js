const calendar = require("./index.js")

calendar.getActiveEvents("de").then(events => {
    console.log(events)
})

calendar.getAllEvents().then(events => {
    console.log(events)
})