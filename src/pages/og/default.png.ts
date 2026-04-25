import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { SITE_DESCRIPTION, SITE_TITLE } from '../../consts';

export const GET: APIRoute = async ({ site }) => {
	const fontRegular = readFileSync(join(process.cwd(), 'src/assets/fonts/atkinson-regular.woff'));
	const fontBold = readFileSync(join(process.cwd(), 'src/assets/fonts/atkinson-bold.woff'));

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
								gap: '20px',
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize: '64px',
											fontWeight: 700,
											color: '#0f1219',
											lineHeight: 1.1,
											margin: 0,
										},
										children: SITE_TITLE,
									},
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '28px',
											color: '#60739f',
											lineHeight: 1.4,
											margin: 0,
										},
										children: SITE_DESCRIPTION,
									},
								},
							],
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
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
