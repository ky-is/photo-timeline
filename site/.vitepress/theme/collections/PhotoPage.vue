<template>
	<div class="fixed inset-0 z-30 bg-black  flex" @touchstart.prevent="onHover(!hoveringInfo)" @click="compactWidth ? onHover(!hoveringInfo) : selectPhoto(null)">
		<div v-if="!compactWidth" class="flex-grow-0  w-128 p-4 text-gray-300 bg-gray-900">
			<h1 class="text-2xl">{{ photo.title }}</h1>
			<div v-if="photoDate">📅 <Date :date="photoDate" /></div>
			<div v-if="subjects.length">
				🫂 <Person v-for="person in subjects" :key="person.name" :person="person" :date="photoDate" />
			</div>
			<div v-if="photographer">📸 <Person :person="photographer" :date="photoDate" /></div>
			<Content />
		</div>
		<div class="flex-grow  relative text-white  flex justify-center">
			<div class="absolute inset-0 z-0  flex justify-center items-center">Loading...</div>
			<Photo
				:photo="photo" :size="compactWidth ? 'mobile' : 'desktop'"
				class="z-10"
			/>
			<div v-if="compactWidth" class="info-overlay  fixed inset-0 w-full z-20" :class="hoveringInfo ? null : 'opacity-0'">
				<button type="button" class="absolute top-0 right-0 w-11 h-11 mt-1 mr-1 rounded-full text-4xl font-black" @touchstart.stop="" @click.stop="selectPhoto(null)">╳</button>
				<div class="content-safe  absolute bottom-0 mb-1 px-2 text-gray-300">
					<h1 class="inline text-2xl text-gray-100">{{ photo.title }}</h1><span v-if="photoDate">&ensp;<Date :date="photoDate" /></span>
					<div v-if="subjects.length">
						🫂 <Person v-for="person in subjects" :key="person.name" :person="person" :date="photoDate" />
					</div>
					<div v-if="photographer">📸 <Person :person="photographer" :date="photoDate" /></div>
					<Content />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useSiteData } from 'vitepress'
import { defineProps, ref } from 'vue'

import type { EventData, PersonData, PhotoData } from '../../collections'
import Date from '../components/Date.vue'
import Person from '../components/Person.vue'
import Photo from '../components/Photo.vue'

import { selectPhoto } from '../../useSelectedPhoto'

const props = defineProps<{
	photo: PhotoData
}>()

const compactWidth = typeof window !== 'undefined' ? window.innerWidth < 512 : true

const hoveringInfo = ref(true)

function onHover(hovering: boolean) {
	hoveringInfo.value = hovering
}

const people: PersonData[] = useSiteData().value.customData.people
const event = function () {
	const photoTitle = props.photo.title
	const events: EventData[] = useSiteData().value.customData.events
	return events.find(event => event.title === photoTitle)
}()

const photographer = props.photo?.photographer ? people.find(person => person.name === props.photo.photographer) : null
const subjects = props.photo?.subjects
	.map(name => people.find(person => person.name === name))
	.filter((person): person is PersonData => !!person)

const photoDate = props.photo.date ?? event?.dateStart
</script>

<style scoped lang="postcss">
.info-overlay {
	@apply transition-opacity;
	box-shadow: inset 0 calc(-128px - env(safe-area-inset-bottom)) 48px -40px rgba(0, 0, 0, 0.9);
}

.content-safe {
	margin-bottom: max(4px, env(safe-area-inset-bottom));
}
</style>
