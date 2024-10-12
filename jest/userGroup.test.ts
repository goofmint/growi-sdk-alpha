import { AxiosError } from "axios";
import { GROWI, UserGroup } from "../src";
import config from './config.json';
import {describe, expect, test} from '@jest/globals';

const growi = new GROWI(config);

describe('UserGroup', () => {
  test('Get all userGroup', async () => {
		const { groups } = await growi.groups();
		expect(groups).toBeInstanceOf(Array);
		expect(groups[0] instanceof UserGroup).toBe(true);
	}, 10000);

  test('Get children', async () => {
		const { groups } = await growi.groups();
		const children = await groups[0].children(true);
		expect(children[0] instanceof UserGroup).toBe(true);
	}, 10000);

  test('Get ancestors', async () => {
		const { groups } = await growi.groups();
		const children = await groups[0].children(true);
		const ancestors = await children[0].ancestors();
		expect(ancestors[0] instanceof UserGroup).toBe(true);
	}, 10000);

  test('Save user group', async () => {
		const group = new UserGroup();
		group.name = 'test';
		group.description = 'test';
		const bol = await group.save();
		expect(bol).toBe(true);
		await group.get();
		const bol2 = await group.delete();
		expect(bol2).toBe(true);
	}, 10000);

  test('Update user group', async () => {
		const group = new UserGroup();
		group.name = 'test';
		group.description = 'test';
		const bol = await group.save();
		expect(bol).toBe(true);
		group.name = 'test2';
		group.description = 'test2';
		const bol1 = await group.save();
		expect(bol1).toBe(true);
		const bol2 = await group.delete();
		expect(bol2).toBe(true);
	}, 10000);
});
