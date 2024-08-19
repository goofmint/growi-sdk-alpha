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

## Tag

### Get tags of a page

```javascript
const tags = await page.tags();
```

### Add a tag to a page

```javascript
await page.addTag('tag');
```

### Remove a tag from a page

```javascript
await page.removeTag('tag');
```

## Comment

### Get comments of a page

```javascript
const comments = await page.comments();
```

### Add a comment to a page

```javascript
const comment = page.comment();
comment.set('comment', 'New comment');
await comment.save();
```

### Update a comment

```javascript
comment.set('comment', 'Updated comment');
await comment.save();
```

### Remove a comment

```javascript
await comment.remove();
```

## Search

### Search pages

```javascript
const result = await growi.search({q: 'keyword'});
result.pages[0] instanceof growi.Page; // true
result.total // total number of pages
result.took // time taken for search
result.hitsCount // number of hits
```

### Search by tag

```javascript
const result = await growi.searchByTag('tag');
result.pages[0] instanceof growi.Page; // true
result.total // total number of pages
result.took // time taken for search
result.hitsCount // number of hits
```

## Attachment

### Upload an attachment

```javascript
const page = await growi.page({path: '/API Test'});
const fileName = 'logo.png';
const attachment = await page.upload(path.resolve("jest", fileName));
attachment // Attachment instance
```

### Get attachments of a page

```javascript
const page = await growi.page({path: '/API Test'});
const res = await Attachment.list(page);
res.attachments // array of Attachment instances
res.limit // 10
res.page // 1
res.totalDocs // 20
```

### Check uploadable file size

```javascript
const bol = await Attachment.limit(1024 * 1024 * 10);
bol // true
```

### Find attachment

```javascript
const a = await Attachment.find(attachment.id!);
a // Attachment instance
```

## License

MIT


