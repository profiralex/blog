import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: post,
	}));
}

export const GET: APIRoute = async ({ props }) => {
	const post = props as CollectionEntry<'blog'>;
	const { title, description } = post.data;

	const fontRegular = readFileSync(join(process.cwd(), 'src/assets/fonts/atkinson-regular.woff'));
	const fontBold = readFileSync(join(process.cwd(), 'src/assets/fonts/atkinson-bold.woff'));

	const truncated =
		description && description.length > 120 ? description.slice(0, 120) + '…' : description;

	const contentChildren: object[] = [
		{
			type: 'div',
			props: {
				style: {
					fontSize: title.length > 60 ? '44px' : '56px',
					fontWeight: 700,
					color: '#0f1219',
					lineHeight: 1.2,
					margin: 0,
				},
				children: title,
			},
		},
	];

	if (truncated) {
		contentChildren.push({
			type: 'div',
			props: {
				style: {
					fontSize: '26px',
					color: '#60739f',
					lineHeight: 1.4,
					margin: 0,
					marginTop: '24px',
				},
				children: truncated,
			},
		});
	}

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: '#f8f9fc',
					padding: '60px 72px',
					fontFamily: 'Atkinson',
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								width: '64px',
								height: '6px',
								backgroundColor: '#0a6655',
								borderRadius: '3px',
								marginBottom: '48px',
								flexShrink: 0,
							},
						},
					},
					{
						type: 'div',
						props: {
							style: {
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
							},
							children: contentChildren,
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								borderTop: '1px solid #e5e9f0',
								paddingTop: '24px',
								flexShrink: 0,
							},
							children: [
								{
									type: 'span',
									props: {
										style: {
											fontSize: '22px',
											fontWeight: 700,
											color: '#0a6655',
										},
										children: 'The Append-Only Log',
									},
								},
								{
									type: 'span',
									props: {
										style: {
											fontSize: '20px',
											color: '#60739f',
										},
										children: 'Alexandr Profir',
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{ name: 'Atkinson', data: fontRegular, weight: 400, style: 'normal' },
				{ name: 'Atkinson', data: fontBold, weight: 700, style: 'normal' },
			],
		}
	);

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(png, {
		headers: { 'Content-Type': 'image/png' },
	});
};
