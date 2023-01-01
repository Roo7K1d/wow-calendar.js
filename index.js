const puppeteer = require("puppeteer")


module.exports = {
    getActiveEvents,
    getAllEvents
}


async function getActiveEvents() {
    const browser = await puppeteer.launch({
        //headless: false    <-- For Testing Purposes
    });
    const page = await browser.newPage();

    await page.goto(`https://www.wowhead.com/events`)

    const result = await page.evaluate(() => {
        const rows = document.querySelectorAll('table > tbody > tr.checked');
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        });
    });

    let events = [];
    result.forEach(event => {
        events.push({name: event[1], duration: event[2], category: event[3]})
    })

    browser.close();
    return events;
}


async function getAllEvents() {
    const browser = await puppeteer.launch({
        //headless: false    <-- For Testing Purposes
    });
    const page = await browser.newPage();

    await page.goto(`https://www.wowhead.com/events`)

    const result = await page.evaluate(() => {
        const rows = document.querySelectorAll('table > tbody > tr');
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        });
    });

    let events = [];
    result.forEach(event => {
        events.push({name: event[1], duration: event[2], category: event[3]})
    })

    browser.close();
    return events;
}