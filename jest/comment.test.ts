import { AxiosError } from "axios";
import { GROWI } from "../src";
import config from './config.json';
import {describe, expect, test} from '@jest/globals';
import { Comment } from "../src";

const growi = new GROWI(config);

describe('Comment', () => {
  test('Get page comments', async () => {
		const page = await growi.page({path: '/API Test'});
		const comments = await page.comments();
		expect(comments).toBeInstanceOf(Array);
		expect(comments[0]).toBeInstanceOf(Comment);
	});

	test('Add a comment', async () => {
		const page = await growi.page({path: '/API Test'});
		const comment = page.comment();
		const testComment = 'Test comment';
		comment.set('comment', testComment);
		await comment.save();
		expect(comment.comment).toBe(testComment);
		await comment.remove();
	});

	test('Update a comment', async () => {
		const page = await growi.page({path: '/API Test'});
		const comment = page.comment();
		const testComment = 'Test comment, old';
		comment.set('comment', testComment);
		await comment.save();
		expect(comment.comment).toBe(testComment);
		const newComment = 'Test comment, new';
		comment.set('comment', newComment);
		await comment.save();
		expect(comment.comment).toBe(newComment);
		const newComment2 = 'Test comment, new 2';
		comment.set('comment', newComment2);
		await comment.save();
		await comment.remove();
	});

	test('Remove a comment', async () => {
		const page = await growi.page({path: '/API Test'});
		const comment = page.comment();
		const testComment = 'Test comment, old';
		comment.set('comment', testComment);
		await comment.save();
		expect(comment.comment).toBe(testComment);
		const res = await comment.remove();
		expect(res).toBeTruthy();
	});
});