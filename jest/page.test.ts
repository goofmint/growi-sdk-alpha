import { Growi } from "../src";
import config from './config.json';
import {describe, expect, test} from '@jest/globals';

const growi = new Growi(config);

describe('Page', () => {
  test('Get a root page', async () => {
    const page = await growi.root();
    expect(page.path).toBe('/');
    expect(page.id).toBeDefined();
    expect(page.parent).toBeUndefined();
    expect(page.descendantCount).toBeGreaterThan(0);
    expect(page.isEmpty).toBeFalsy();
    expect(page.status).toBe('published');
    expect(page.grant).toBe(1);
    expect(page.updatedAt).toBeInstanceOf(Date);
    expect(page.createdAt).toBeInstanceOf(Date);
    expect(page.revision).toBeDefined();
    expect(page.version).toBe(1);
  });

  test('Get a children pages of page', async () => {
    const page = await growi.root();
    expect(page.path).toBe('/');
    expect(page.id).toBeDefined();
    const pages = await page.children();
    expect(pages).toBeInstanceOf(Array);
    expect(pages[0]).toBeInstanceOf(growi.Page);
    expect(pages[0].parent).toBe(page);
  });
});
