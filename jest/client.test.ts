import { AxiosError } from "axios";
import { GROWI } from "../src";
import config from './config.json';
import {describe, expect, test} from '@jest/globals';

const growi = new GROWI(config);

describe('Tag', () => {
  test('Search page', async () => {
		const result = await growi.search({q: 'tag:test'});
		expect(result).toBeDefined();
		expect(result.pages).toBeDefined();
		expect(result.pages[0]).toBeInstanceOf(growi.Page);
		expect(result.pages[0].path).toBeDefined();
		expect(result.pages[0].id).toBeDefined();
		expect(result.pages[0].revision).toBeDefined();
		expect(typeof result.total).toBe('number');
		expect(typeof result.took).toBe('number');
		expect(typeof result.hitsCount).toBe('number');
	});
});