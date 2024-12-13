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

## User

### Get current user

```javascript
const user = await growi.currentUser();
```

## Bookmark Folder

### Get bookmark folders

```javascript
const bookmarkFolders = await user.bookmarkFolders();
```

### Create a bookmark folder

```javascript
const bookmarkFolder = new BookmarkFolder();
bookmarkFolder.name = 'my folder';
await bookmarkFolder.save();
```

### Update a bookmark folder

```javascript
bookmarkFolder.name = 'my folder updated';
await bookmarkFolder.save();
```

### Remove a bookmark folder

```javascript
await bookmarkFolder.remove();
```

### Create a bookmark folder in a folder

```javascript
const bookmarkFolder = new BookmarkFolder();
bookmarkFolder.name = 'Parent';
await bookmarkFolder.save();
const bookmarkFolder2 = new BookmarkFolder();
bookmarkFolder2.name = 'Child';
bookmarkFolder2.parent = bookmarkFolder;
await bookmarkFolder2.save();
```

Or

```javascript
const bookmarkFolder = new BookmarkFolder();
bookmarkFolder.name = 'Parent';
const bookmarkFolder2 = new BookmarkFolder();
bookmarkFolder2.name = 'Child';
await bookmarkFolder.addFolder(bookmarkFolder2);
```

### Move a bookmark folder

```javascript
const bookmarkFolder3 = new BookmarkFolder();
bookmarkFolder3.name = 'New parent';
bookmarkFolder3.parent = bookmarkFolder2;
await bookmarkFolder3.save();
```

### Fetch folder info

```javascript
await bookmarkFolder.fetch();
```

## Bookmark

### Get my bookmarks

```javascript
const bookmarks = await user.bookmarks();
```

### Get bookmark info of a page

```javascript
const page = await growi.root();
const info = await page.bookmarkInfo();
info.bookmarkCount // number of bookmarks
info.bookmarked    // true if the page is bookmarked by the current user
info.users         // array of users who bookmarked the page
```

### Bookmark a page

```javascript
await user.bookmark(page); // unbookmark
```

### Unbookmark a page

```javascript
await user.bookmark(page, false); // unbookmark
```

### Check if a page is bookmarked

```javascript
const bol = await user.isBookmarked(page);
```

### Add bookmark to a folder

```javascript
const folder = new BookmarkFolder();
folder.name = 'my folder';
await folder.save();
await folder.addPage(page);
```

## License

MIT


