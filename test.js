(async() => {
    const calendar = require("./index.js")
    
    let event = await calendar.getEvent(181, "de")

    console.log(event)
})()