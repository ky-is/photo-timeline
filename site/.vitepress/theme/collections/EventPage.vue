<template>
	<article class="mt-8 px-2 sm:px-0">
		<header>
			<h1 class="text-3xl">{{ event.title }}</h1>
			<div>
				<Date :date="event.dateStart" />
				<span v-if="event.dateEnd"> - <Date :date="event.dateEnd" /></span>
			</div>
			<div>🫂 <Person v-for="person in attendees" :key="person.name" :person="person" :date="event.dateStart" /></div>
		</header>
		<Content />
	</article>
	<PhotoGrid :photos="photos" class="mb-8" />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useData } from 'vitepress'

import type { EventData, PersonData, PhotoData } from '../../collections'
import Date from '../components/Date.vue'
import Person from '../components/Person.vue'
import PhotoGrid from '../components/PhotoGrid.vue'

const { theme } = useData()

const props = defineProps<{
	event: EventData
}>()

const photos = computed(() => {
	const eventName = props.event.title
	if (!eventName) {
		return []
	}
	const photos = theme.value.photos as PhotoData[]
	return photos.filter(photo => photo.event === eventName)
})

const attendees = computed(() => {
	const eventName = props.event.title
	if (!eventName) {
		return []
	}
	const people = theme.value.people as PersonData[]
	const namesInEventPhotos = photos.value.flatMap(photo => (photo.photographer ? [ ...photo.subjects, photo.photographer ] : photo.subjects))
	return Array.from(new Set(namesInEventPhotos.concat(props.event.additionalAttendees)))
		.map(name => people.find(person => person.name === name))
		.filter((person): person is PersonData => !!person)
})
</script>
