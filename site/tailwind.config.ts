/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./site/public/**/*.html',
		'./site/.vitepress/theme/**/*.vue',
	],
	theme: {
		extend: {
			borderWidth: {
				'3': '3px',
			},
		},
	},
}
