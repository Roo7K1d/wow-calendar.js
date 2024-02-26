(async() => {
    const calendar = require("./index.js")
    
    let event = await calendar.getActiveEvents("de")

    console.log(event)
})()
