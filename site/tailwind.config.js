module.exports = {
	purge: [
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
