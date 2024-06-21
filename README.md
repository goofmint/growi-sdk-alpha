# Growi node.js SDK

This is a SDK for [GROWI](https://growi.org/) written in node.js.

## Installation

```bash
$ npm install @goofmint/growi-js
```

## Usage

### Create a client

```javascript
import { GROWI } from '@goofmint/growi-js';
const growi = new GROWI({apiToken: 'YOUR_API_TOKEN'});
```

Initialize parameters are as follows:

| Parameter | Description |
| --------- | ----------- |
| `apiToken` | API token for GROWI. You can get it from the setting page of GROWI. |
| `url` | URL of GROWI. Default is `http://localhost:3000`. |
| `path` | Endpoint path of Growi API. Default is `/`. |

### Get root page

```javascript
const page = await growi.root();
page instanceof growi.Page; // true
```

### Get children of a page

```javascript
const pages = await page.children();
pages[0] instanceof growi.Page; // true
```

### Update page contents

```javascript
page.contents('New contents');
await page.save();
```

### Get contents of a page

```javascript
const contents = await page.contents();
```

### Create a page

```javascript
const newPage = await page.create({name: 'New page'});
```

### Remove a page

```javascript
await page.remove();
```

## License

MIT


