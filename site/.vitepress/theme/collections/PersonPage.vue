<template>
	<article class="mt-8 px-2 sm:px-0">
		<header>
			<h1 class="text-3xl">{{ person.name }}</h1>
			<div v-if="person.dateBirth">Born <Date :date="person.dateBirth" /></div>
			<div>
				<span v-for="nickname in person.nicknames" :key="nickname">
					{{ nickname }}
				</span>
			</div>
		</header>
		<Content />
	</article>
	<div>
		<EventLink v-for="event in events" :key="event.title" :event="event" @hover="onHover" />
	</div>
	<PhotoGrid :photos="displayPhotos" class="mb-8" />
</template>

<script setup lang="ts">
import { useSiteData } from 'vitepress'
import { computed, defineProps, ref } from 'vue'

import type { EventData, PersonData, PhotoData } from '../../collections'
import Date from '../components/Date.vue'
import EventLink from '../components/EventLink.vue'
import PhotoGrid from '../components/PhotoGrid.vue'

const props = defineProps<{
	person: PersonData
}>()

const filterEventName = ref<string | null>(null)

function onHover(event: EventData | null) {
	filterEventName.value = event?.title ?? null
}

const events = function () {
	const personName = props.person.name
	const events: EventData[] = useSiteData().value.customData.events
	const photos: PhotoData[] = useSiteData().value.customData.photos
	const eventsFromPhotos = photos
		.filter(photo => photo.event && (photo.photographer === personName || photo.subjects.includes(personName)))
		.map(photo => events.find(event => event.title === photo.event))
		.filter((event): event is EventData => !!event)
	const eventsFromEvents = events.filter(event => event.additionalAttendees.includes(personName))
	return Array.from(new Set(eventsFromPhotos.concat(eventsFromEvents)))
}()

const photos = function () {
	const personName = props.person.name
	const photos: PhotoData[] = useSiteData().value.customData.photos
	return personName ? photos.filter(photo => photo.subjects.includes(personName)) : []
}()

const displayPhotos = computed(() => {
	if (!filterEventName.value) {
		return photos
	}
	return photos.filter(photo => photo.event === filterEventName.value)
})
</script>
