import './main.postcss'

import type { DefaultTheme } from 'vitepress'

import Layout from './Layout.vue'

import type { EventData, PersonData, PhotoData } from '../collections'

export interface ThemeConfig extends DefaultTheme.Config {
	events: EventData[]
	people: PersonData[]
	photos: PhotoData[]
}

export default {
	Layout,
}
