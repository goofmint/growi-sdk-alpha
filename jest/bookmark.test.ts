import { AxiosError } from "axios";
import { BookmarkFolder, GROWI } from "../src";
import config from './config.json';
import {describe, expect, test} from '@jest/globals';

const growi = new GROWI(config);

describe('Bookmark', () => {
  test('Get bookmark info', async () => {
    const page = await growi.root();
    try {
      const info = await page.bookmarkInfo();
      expect(info.bookmarkCount).toBe(0);
      expect(info.bookmarked).toBe(false);
      expect(info.users.length).toBe(0);
      const user = await growi.currentUser();
      await user.bookmark(page); // bookmark
      const info2 = await page.bookmarkInfo();
      expect(info2.bookmarkCount).toBe(1);
      expect(info2.bookmarked).toBe(true);
      expect(info2.users.length).toBe(1);
      await user.bookmark(page, false); // unbookmark
    } catch (e) {
      console.log((e as AxiosError).response?.data);
      expect(true).toEqual(false);
    }
  });

  test('Check bookmark status', async () => {
    const page = await growi.root();
    try {
      const user = await growi.currentUser();
      const bol = await user.isBookmarked(page);
      expect(typeof bol).toBe('boolean');
      if (bol) {
        // bookmarked
        await user.bookmark(page, false); // unbookmark
      }
      const info = await page.bookmarkInfo();
      expect(info.bookmarked).toBeFalsy();
    } catch (e) {
      console.log((e as AxiosError).response?.data);
      expect(true).toEqual(false);
    }
  });

  test('Get user bookmarks', async () => {
    const page = await growi.root();
    try {
      const user = await growi.currentUser();
      await user.bookmark(page); // bookmark
      const bookmarks = await user.bookmarks();
      expect(bookmarks).toBeInstanceOf(Array);
      expect(bookmarks[0].path).toBe(page.path);
      await user.bookmark(page, false); // unbookmark
    } catch (e) {
      console.log((e as AxiosError).response?.data);
      expect(true).toEqual(false);
    }
  });

  test('Add bookmark to folder', async () => {
    const page = await growi.root();
    try {
      const user = await growi.currentUser();
      await user.bookmark(page); // bookmark
      const bookmarks = await user.bookmarks();
      expect(bookmarks).toBeInstanceOf(Array);
      expect(bookmarks[0].path).toBe(page.path);
      const folder = new BookmarkFolder();
      folder.name = 'test';
      await folder.save();
      await folder.addPage(page);
      const info = await user.bookmarkFolders();
      expect(info[0].bookmarks[0].id).toBe(page.id);
      await user.bookmark(page, false); // unbookmark
      await folder.remove();
    } catch (e) {
      console.log((e as AxiosError).response?.data);
      expect(true).toEqual(false);
    }
  });
});
