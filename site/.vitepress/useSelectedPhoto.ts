import { computed, ref } from 'vue'
import { useData } from 'vitepress'

import type { CollectionData, PhotoData } from './collections'

const href = ref(typeof window !== 'undefined' ? window.location.hash : '')
if (typeof window !== 'undefined') {
	window?.addEventListener('hashchange', () => {
		href.value = window.location.hash
	}, false)
}

export function selectPhoto(photo: PhotoData | null) {
	let hash: string
	if (!photo) {
		hash = ' '
		window.history.replaceState(null, '', hash)
	} else {
		hash = '#' + toSlug(photo)
		window.history.pushState(null, '', hash)
	}
	href.value = hash
}

export function toSlug(entry: CollectionData) {
	return entry.href.split('/')[2].slice(0, -5)
}

function toHREF(slug: string, collectionType: string) {
	return `/${collectionType}/${slug}.html`
}

export function useSelectedPhoto() {
	return computed(() => {
		if (!href.value) {
			return undefined
		}
		const hashPhotoHREF = toHREF(href.value.slice(1), 'photos')
		const photos = useData().theme.value.customData.photos as PhotoData[]
		return photos.find(photo => photo.href === hashPhotoHREF)
	})
}
