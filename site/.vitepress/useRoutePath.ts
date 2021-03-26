import type { Route } from 'vitepress'
import { computed } from 'vue'

export function useRoutePath(route: Route) {
	return computed(() => {
		const path = route.path.replace(/index.html$/, '')
		const split = path.split('/')
		split.shift()
		return split
	})
}
