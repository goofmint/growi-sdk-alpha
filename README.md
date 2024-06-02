# Growi node.js SDK

This is a SDK for [Growi](https://growi.org/) written in node.js.

## Installation

```bash
$ npm install growi
```

## Usage

### Create a client

```javascript
import { Growi } from 'growi';
const growi = new Growi({apiToken: 'YOUR_API_TOKEN'});
```

Initialize parameters are as follows:

| Parameter | Description |
| --------- | ----------- |
| `apiToken` | API token for Growi. You can get it from the setting page of Growi. |
| `url` | URL of Growi. Default is `http://localhost:3000`. |
| `path` | Endpoint path of Growi API. Default is `/_api/v3`. |

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

## Class

### Page

#### Properties



## License




