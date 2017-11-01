/** @format */
/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import getAllPostsUrl from '..';

describe( 'getAllPostsUrl', () => {
	describe( 'when post type is "page"', () => {
		test( 'should have a base path of "/pages"', () => {
			const props = {
				type: 'page',
			};
			const actual = getAllPostsUrl( props );
			const expected = '/pages';

			expect( actual ).to.eql( expected );
		} );
	} );

	describe( 'when post type is "post"', () => {
		test( 'should have a base path of "/posts"', () => {
			const props = {
				type: 'post',
			};
			const actual = getAllPostsUrl( props );
			const expected = '/posts';

			expect( actual ).to.eql( expected );
		} );

		describe( 'when site is jetpack or a single user site', () => {
			test( 'should not add "/my" to the url', () => {
				const props = {
					type: 'post',
					sselectedSite: {
						slug: 'some-slug',
						jetpack: true,
						single_user_site: false,
					},
				};
				const actual = getAllPostsUrl( props );
				const expected = '/posts/some-slug';

				expect( actual ).to.eql( expected );
			} );
		} );

		describe( 'when site is neither jetpack or a single user site', () => {
			test( 'should add "/my" to the url', () => {
				const props = {
					type: 'post',
					sselectedSite: {
						slug: 'some-slug',
						jetpack: false,
						single_user_site: false,
					},
				};
				const actual = getAllPostsUrl( props );
				const expected = '/posts/my/some-slug';

				expect( actual ).to.eql( expected );
			} );
		} );
	} );
	describe( 'when post type is neither "post" or "page"', () => {
		test( 'should have a base path of "/types/" + the custom type', () => {
			const props = {
				type: 'another-post-type',
			};
			const actual = getAllPostsUrl( props );
			const expected = '/types/another-post-type';

			expect( actual ).to.eql( expected );
		} );
	} );

	describe( 'when site prop is present', () => {
		test( 'should add the site fragment based on the slug', () => {
			const props = {
				type: 'page',
				sselectedSite: {
					slug: 'some-slug',
				},
			};
			const actual = getAllPostsUrl( props );
			const expected = '/pages/some-slug';

			expect( actual ).to.eql( expected );
		} );
	} );
} );
