import { defineConfigWithTheme } from 'vitepress'

import { getEvents, getPeople, getPhotos } from './getCollections'
import type { ThemeConfig } from './theme'

export default defineConfigWithTheme<ThemeConfig>({
	title: 'photo-timeline',
	description: 'A timeline of photos.',
	themeConfig: {
		events: getEvents(),
		people: getPeople(),
		photos: getPhotos(),
	},
})
