import { AxiosError } from "axios";
import { GROWI, Attachment } from "../src";
import config from './config.json';
import {describe, expect, test} from '@jest/globals';
import path from 'path';

const growi = new GROWI(config);

describe('Attachment', () => {
  test('Upload file', async () => {
		const page = await growi.page({path: '/API Test'});
		const fileName = 'logo.png';
		const attachment = await page.upload(path.resolve("jest", fileName));
		expect(attachment.fileName).toBeDefined();
		expect(attachment.originalName).toBe(fileName);
		expect(attachment.creator).toBeInstanceOf(growi.User);
		expect(attachment.page).toBeInstanceOf(growi.Page);
		expect(attachment.createdAt).toBeInstanceOf(Date);
		expect(attachment.fileSize).toBeGreaterThan(0);
		expect(attachment.page!.id).toBe(page.id);
		page.set('body', `${page.body}\n\n![](${attachment.filePathProxied})`);
		await page.save();
		const a = await Attachment.find(attachment.id!);
		expect(a).toBeInstanceOf(Attachment);
		expect(a.id).toBe(attachment.id);
		expect(a.fileName).toBe(attachment.fileName);
	});

  test('Check upload limit', async () => {
		const bol = await Attachment.limit(1024 * 1024 * 10);
		expect(bol).toBeTruthy();
	});

  test('List', async () => {
		const page = await growi.page({path: '/API Test'});
		const res = await Attachment.list(page);
		expect(res.attachments).toBeInstanceOf(Array);
		expect(res.limit).toBeGreaterThan(0);
		expect(res.page).toBeGreaterThan(0);
		expect(res.totalDocs).toBeGreaterThan(0);
	});
});