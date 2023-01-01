const calendar = require("./index.js")

calendar.getActiveEvents().then(events => {
    console.log(events)
})

calendar.getAllEvents().then(events => {
    console.log(events)
})