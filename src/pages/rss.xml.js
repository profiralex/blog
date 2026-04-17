import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { BASE_PATH, SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `${BASE_PATH}/blog/${post.id}/`,
		})),
	});
}
