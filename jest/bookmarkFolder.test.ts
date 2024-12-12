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
    console.log(bookmarkFolders);
		// expect(typeof tags[0]).toBe('string');
	});

  test('Create bookmark folder', async () => {
		const bookmarkFolder = new BookmarkFolder();
    bookmarkFolder.name = 'test';
    await bookmarkFolder.save();
		expect(bookmarkFolder.id !== '').toBeTruthy();
    const res = await bookmarkFolder.delete();
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
    expect(bookmarkFolder.name).toBe('test2');
    const res = await bookmarkFolder.delete();
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
    const res = await bookmarkFolder.delete();
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
    const res = await bookmarkFolder.delete();
    expect(res).toBeTruthy();
  });
});