# wow-calendar.js
An npm package that fetches the World of Warcraft ingame events from [WoWHeads Calendar](https://wowhead.com/events) using Axios & Cheerio.



# Available Functions

### getActiveEvents (Promise)

```js
const calendar = require("wow-calendar.js");

calendar.getActiveEvents([locale]).then(result => {
  //Result: Array Of All Active Events (Objects; Including Event Descriptions)

  //Additionally
  //
  //If the description request in the desired locale results in too many redirects because of URL encoding
  //this function automatically falls back to english and also returns:
  //
  //descriptionFallback: true
  //
  //Updating your Node.js version might fix this "Too Many Redirects" issue. It did at least for me.
  //At the moment it seems to work with v18+.
})
```

| Parameter | Type | Description | Possible Values |
| :--- | :--- | :--- | :--- |
| `locale` | `string` | **Optional (Default: `en`**). The language you wish the results to be in.| `de`, `es`, `fr`, `it`, `pt`, `ru`, `ko`, `cn`

<hr>

### getAllEvents (Promise)

```js
const calendar = require("wow-calendar.js");

calendar.getAllEvents([locale]).then(result => {
  //Result: Array Of All Events (Objects)
})
```

| Parameter | Type | Description | Possible Values |
| :--- | :--- | :--- | :--- |
| `locale` | `string` | **Optional (Default: `en`**). The language you wish the results to be in.| `de`, `es`, `fr`, `it`, `pt`, `ru`, `ko`, `cn`

<hr>

### getEvent (Promise)

```js
const calendar = require("wow-calendar.js");

calendar.getEvent(id, [locale]).then(result => {
  //Result: Event object
})
```

| Parameter | Type | Description | Possible Values |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | The WoW event id. | e.g. 181, 643, ...
| `locale` | `string` | **Optional (Default: `en`**). The language you wish the results to be in.| `de`, `es`, `fr`, `it`, `pt`, `ru`, `ko`, `cn`

<hr>

## Help Wanted!
Feel free to submit pull requests that improve the README, functions, documentation and overall code quality!
