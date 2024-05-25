(async() => {
    const calendar = require("./index.js")
    
    let event = await calendar.getEvent(1496, "de")

    console.log(event)
})()
