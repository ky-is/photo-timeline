<template>
	<div class="antialiased">
		<main class="mx-auto" :class="collection === 'photos' ? null : 'container'">
			<Home v-if="!collection" />
			<template v-if="selectedEntry">
				<EventPage v-if="collection === 'events'" :event="selectedEntry" />
				<PersonPage v-else-if="collection === 'people'" :person="selectedEntry" />
				<PhotoPage v-else-if="collection === 'photos'" :photo="selectedEntry" />
			</template>
			<PhotoPage v-if="selectedPhoto" :photo="selectedPhoto" />
		</main>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

import Home from './Home.vue'

import type { CollectionData } from '../collections'
import EventPage from './collections/EventPage.vue'
import PersonPage from './collections/PersonPage.vue'
import PhotoPage from './collections/PhotoPage.vue'

import { useRoutePath } from '../useRoutePath'
import { useSelectedPhoto } from '../useSelectedPhoto'

const selectedPhoto = useSelectedPhoto()

const { theme } = useData()
const route = useRoute()
const routePath = useRoutePath(route)
const collection = computed(() => routePath.value[0])

const selectedEntry = computed(() => {
	let collectionName = collection.value
	if (!collectionName) {
		return undefined
	}
	if (collectionName[0] === '_') {
		collectionName = collectionName.slice(1)
	}
	const entries: CollectionData[] = theme.value[collectionName]
	if (!entries) {
		console.error('Invalid CV', collectionName)
		return undefined
	}
	const entryPath = route.path
	return entries.find(entry => entry.href === entryPath) as any
})
</script>
