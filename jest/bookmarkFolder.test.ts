import { AxiosError } from "axios";
import { GROWI, BookmarkFolder } from "../src";
import config from './config.json';
import {describe, expect, test} from '@jest/globals';

const growi = new GROWI(config);

describe('BookmarkFolder', () => {
  test('Get bookmark folders', async () => {
		const user = await growi.currentUser();
		const bookmarkFolders = await user.bookmarkFolders();
		expect(bookmarkFolders).toBeInstanceOf(Array);
		// expect(typeof tags[0]).toBe('string');
    await Promise.all(bookmarkFolders.map((folder) => folder.remove()));
	});

  test('Create bookmark folder', async () => {
		const bookmarkFolder = new BookmarkFolder();
    bookmarkFolder.name = 'test';
    await bookmarkFolder.save();
		expect(bookmarkFolder.id !== '').toBeTruthy();
    const res = await bookmarkFolder.remove();
    expect(res).toBeTruthy();
	});

  test('Update bookmark folder', async () => {
		const user = await growi.currentUser();
		const bookmarkFolder = new BookmarkFolder();
    bookmarkFolder.name = 'test';
    await bookmarkFolder.save();
		expect(bookmarkFolder.id !== '').toBeTruthy();
    bookmarkFolder.name = 'test2';
    await bookmarkFolder.save();
    await bookmarkFolder.fetch();
    expect(bookmarkFolder.name).toBe('test2');
    const res = await bookmarkFolder.remove();
    expect(res).toBeTruthy();
	});

  test('Create bookmark folder in bookmark folder', async () => {
		const bookmarkFolder = new BookmarkFolder();
    bookmarkFolder.name = 'Parent';
    await bookmarkFolder.save();
		expect(bookmarkFolder.id !== '').toBeTruthy();
		const bookmarkFolder2 = new BookmarkFolder();
    bookmarkFolder2.name = 'Child';
    bookmarkFolder2.parent = bookmarkFolder;
    await bookmarkFolder2.save();
    expect(bookmarkFolder2.name).toBe('Child');
    expect(bookmarkFolder2.parent!.id).toBe(bookmarkFolder.id);
    const res = await bookmarkFolder.remove();
    expect(res).toBeTruthy();
	});
  
  test('Create bookmark folder in bookmark folder', async () => {
		const bookmarkFolder = new BookmarkFolder();
    bookmarkFolder.name = 'Parent';
		const bookmarkFolder2 = new BookmarkFolder();
    bookmarkFolder2.name = 'Child';
    await bookmarkFolder.addFolder(bookmarkFolder2);
    expect(bookmarkFolder.id !== '').toBeTruthy();
    expect(bookmarkFolder2.id !== '').toBeTruthy();
    expect(bookmarkFolder2.name).toBe('Child');
    expect(bookmarkFolder2.parent!.id).toBe(bookmarkFolder.id);
    const res = await bookmarkFolder.remove();
    expect(res).toBeTruthy();
  });

  test('Create bookmark folder in bookmark folder', async () => {
		const bookmarkFolder = new BookmarkFolder();
    bookmarkFolder.name = 'Parent - 1';

		const bookmarkFolder2 = new BookmarkFolder();
    bookmarkFolder2.name = 'Parent - 2';

		const bookmarkFolder3 = new BookmarkFolder();
    bookmarkFolder3.name = 'Child';
    await bookmarkFolder.addFolder(bookmarkFolder3);
    expect(bookmarkFolder.id !== '').toBeTruthy();
    await bookmarkFolder.fetch();
    expect(bookmarkFolder.childFolders.length).toBe(1);
    expect(bookmarkFolder3.id !== '').toBeTruthy();
    expect(bookmarkFolder3.name).toBe('Child');
    expect(bookmarkFolder3.parent!.id).toBe(bookmarkFolder.id);
    bookmarkFolder3.parent = bookmarkFolder2;
    await bookmarkFolder3.save();
    await bookmarkFolder.fetch();
    await bookmarkFolder2.fetch();
    expect(bookmarkFolder.childFolders.length).toBe(0);
    expect(bookmarkFolder2.childFolders.length).toBe(1);
    const res = await bookmarkFolder.remove();
    await bookmarkFolder2.remove();
    expect(res).toBeTruthy();
  });
  
});