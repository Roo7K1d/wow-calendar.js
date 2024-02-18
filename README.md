# wow-calendar.js
An npm package that fetches the World of Warcraft ingame events from [WoWHeads Calendar](https://wowhead.com/events) using Axios & Cheerio.



# Available Functions

### getActiveEvents (Promise)

```js
const calendar = require("wow-calendar.js");

calendar.getActiveEvents([locale]).then(result => {
  //Result: Array Of All Active Events (Objects; Including Event Descriptions)
})
```

| Parameter | Type | Description | Possible Values |
| :--- | :--- | :--- | :--- |
| `locale` | `string` | **Optional (Default: `en`**). The language you wish the results to be in.| `de`, `es`, `fr`, `it`, `pt`, `ru`, `ko`, `cn`

<hr>

### getAllEvents (Promise)

```js
const calendar = require("wow-calendar.js");

calendar.getActiveEvents([locale]).then(result => {
  //Result: Array Of All Events (Objects)
})
```

| Parameter | Type | Description | Possible Values |
| :--- | :--- | :--- | :--- |
| `locale` | `string` | **Optional (Default: `en`**). The language you wish the results to be in.| `de`, `es`, `fr`, `it`, `pt`, `ru`, `ko`, `cn`

<hr>

## Help Wanted!
Feel free to submit pull requests that improve the README, functions, documentation and overall code quality!
