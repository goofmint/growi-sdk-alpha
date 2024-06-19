import { AxiosError } from "axios";
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

  test('Get content of page', async () => {
    const page = await growi.root();
    expect(page.path).toBe('/');
    expect(page.id).toBeDefined();
    const content = await page.contents();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  test('Get content of child page', async () => {
    const page = await growi.root();
    expect(page.path).toBe('/');
    expect(page.id).toBeDefined();
    const pages = await page.children();
    const content = await pages[0].contents();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    expect(pages[0].revision).toBeInstanceOf(growi.Revision);
  });

  test('Create a new page and delete', async () => {
    const page = await growi.root();
    const name = `Test page ${new Date().toISOString()}`;
    try {
      const newPage = await page.create({ name });
      expect(newPage.path).toBe(`/${name}`);
      expect(newPage.id).toBeDefined();
      expect(newPage.revision).toBeDefined();
      expect(newPage.revision).toBeInstanceOf(growi.Revision);
      const res = await newPage.remove();
      expect(res).toBe(true);
    } catch (e) {
      console.log((e as AxiosError).response?.data);
      expect(true).toEqual(false);
    }
  });

  test('Create a new page and delete completely.', async () => {
    const page = await growi.root();
    const name = `Test page ${new Date().toISOString()}`;
    try {
      const newPage = await page.create({ name });
      expect(newPage.path).toBe(`/${name}`);
      expect(newPage.id).toBeDefined();
      expect(newPage.revision).toBeDefined();
      expect(newPage.revision).toBeInstanceOf(growi.Revision);
      const res = await newPage.remove({ isCompletely: true});
      expect(res).toBe(true);
    } catch (e) {
      console.log((e as AxiosError).response?.data);
      expect(true).toEqual(false);
    }
  });

  test('Update page', async () => {
    const page = await growi.root();
    const name = `Test page ${new Date().toISOString()}`;
    const newPage = await page.create({ name, grant: growi.Page.Grant.public });
    try {
      const body = 'This is a test page.';
      newPage.contents(body);
      await newPage.save();
      expect(newPage.body).toBe(body);
    } catch (e) {
      console.log((e as AxiosError));
    }
    const res = await newPage.remove();
  });
});
