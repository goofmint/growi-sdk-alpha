import { AxiosError } from "axios";
import { GROWI } from "../src";
import config from './config.json';
import {describe, expect, test} from '@jest/globals';

const growi = new GROWI(config);

describe('Tag', () => {
  test('Get page tags', async () => {
		const page = await growi.page({path: '/API Test'});
		const tags = await page.tags();
		expect(tags).toBeInstanceOf(Array);
		expect(typeof tags[0]).toBe('string');
	});

  test('Add page tag', async () => {
		const page = await growi.page({path: '/API Test'});
		await page.addTag('test2');
		const tags = await page.tags();
		expect(tags).toContain('test2');
	});

  test('Remove page tag', async () => {
		const page = await growi.page({path: '/API Test'});
		await page.addTag('test2');
		const tags = await page.tags();
		expect(tags).toContain('test2');
		await page.removeTag('test2');
		const tags2 = await page.tags();
		expect(tags2).not.toContain('test2');
	});
});