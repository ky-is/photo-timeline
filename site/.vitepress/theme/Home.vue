<template>
	<div class="mt-16 sm:mt-26 mb-26 ml-16 sm:ml-32">
		<h1 class="inline text-yellow-500 font-thin leading-none">photo-timeline</h1>
		<div class="-mt-1.5 text-gray-600">
			<div v-for="[ year, photosByMonth ] in photosByYearAndMonth" :key="year" class="mt-1 relative border-l-2 sm:border-l-3 border-yellow-500" :class="!photosByMonth ? 'h-13 border-dashed' : null">
				<h2 class="header-timeline  bottom-full -mb-1 text-2xl sm:text-3xl text-gray-700 font-light">{{ year }}</h2>
				<div v-for="[month, [events, photos]] in photosByMonth" :key="month" class="relative" :style="{ height: thumbnailSize }">
					<h3 class="header-timeline  -mt-0.5 text-sm">{{ monthNames[month] }}</h3>
					<div class="h-full ml-0.5 sm:ml-1  flex">
						<div class="overflow-x-auto flex items-center space-x-0.5">
							<div v-if="events.length" class="flex-shrink-0  h-full overflow-y-auto" :style="{ maxWidth: thumbnailSize }">
								<EventLink v-for="event in events" :key="event.title" :event="event" @hover="onHover" />
							</div>
							<template v-for="photo in photos" :key="photo.title">
								<PhotoThumbnail v-if="photo.date && (!filterEvent || photo.event === filterEvent.title || filterEvent.dateStart.year !== year || filterEvent.dateStart.month !== month)"
									:photo="photo"
									class="flex-shrink-0" :style="{ width: thumbnailSize }"
								/>
							</template>
							<div class="flex-shrink-0  w-5 h-px" />
							<!-- <a v-if="filterPerson" :href="`/people/${filterPerson.name}`">See all photos with {{ filterPerson.name }}</a> -->
						</div>
						<div class="scroll-cap  absolute top-0 right-0 z-10 w-32 h-full pointer-events-none" />
					</div>
				</div>
			</div>
			<div class="fixed right-0 bottom-0 z-20 m-3 space-y-1">
				<button type="button" class="zoom-button" :disabled="zoomSize >= zoomRange[1]" @click="onZoom(1)">＋</button>
				<button type="button" class="zoom-button" :disabled="zoomSize <= zoomRange[0]" @click="onZoom(-1)">－</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSiteData } from 'vitepress'

import EventLink from './components/EventLink.vue'
import PhotoThumbnail from './components/PhotoThumbnail.vue'

import type { EventData, PhotoData } from '../collections'

const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]

// Zoom level
const zoomBy = 32
const zoomSize = ref(4)
const zoomRange = [3, 6]

const thumbnailSize = computed(() => `${zoomSize.value * zoomBy}px`)

function onZoom(direction: number) {
	if (direction < 0) {
		if (zoomSize.value <= zoomRange[0]) {
			return
		}
	} else if (zoomSize.value >= zoomRange[1]) {
		return
	}
	zoomSize.value += direction
}

// Filter
const filterEvent = ref<EventData | null>(null)

function onHover(event: EventData | null) {
	filterEvent.value = event
}

// Timeline entries
const photos = useSiteData().value.customData.photos
const events = useSiteData().value.customData.events

function groupPhotosObject<Content>(photosObject: {[key: string]: Content}) {
	return Object.entries(photosObject)
		.map(([grouping, photos]) => [ parseInt(grouping, 10), photos ] as [number, Content])
		.sort((a, b) => a[0] - b[0])
}

const photosByYearAndMonth = computed(() => {
	const resultsObject: {[year: number]: {[month: number]: [EventData[], PhotoData[]]}} = {}
	for (const photo of photos) {
		if (photo.date) {
			let resultsYear = resultsObject[photo.date.year]
			if (!resultsYear) {
				resultsYear = {}
				resultsObject[photo.date.year] = resultsYear
			}
			let resultsMonth = resultsYear[photo.date.month]
			if (!resultsMonth) {
				resultsMonth = [[], []]
				resultsYear[photo.date.month] = resultsMonth
			}
			resultsMonth[1].push(photo)
		}
	}
	for (const event of events) {
		let resultsYear = resultsObject[event.dateStart.year]
		if (!resultsYear) {
			resultsYear = {}
			resultsObject[event.dateStart.year] = resultsYear
		}
		let resultsMonth = resultsYear[event.dateStart.month]
		if (!resultsMonth) {
			resultsMonth = [[], []]
			resultsYear[event.dateStart.month] = resultsMonth
		}
		resultsMonth[0].push(event)
	}
	const resultsArray = groupPhotosObject(resultsObject)
		.map(([year, photosByMonth]) => [ year, groupPhotosObject(photosByMonth) ] as [year: number | undefined, photosByMonth: [month: number, photos: [EventData[], PhotoData[]]][] | undefined])
	const firstYear = resultsArray[0]?.[0]
	if (!firstYear) {
		return resultsArray
	}
	for (let yearIndex = resultsArray.length - 1; yearIndex >= 0; yearIndex -= 1) {
		let year = resultsArray[yearIndex][0] ?? 0
		const previousEntry = resultsArray[yearIndex - 1]
		const previousYear: number = previousEntry?.[0] ?? firstYear
		while (year - 1 !== previousYear) {
			resultsArray.splice(yearIndex, 0, [undefined, undefined])
			if (previousYear === firstYear) {
				break
			}
			year -= 1
		}
	}
	return resultsArray
})
</script>

<style scoped lang="postcss">
.zoom-button {
	@apply block w-10 h-10 rounded-full text-xl font-black;
}

.header-timeline {
	@apply absolute right-full mr-1.5 sm:mr-2;
}

h1 {
	line-height: 80%;
	font-size: 82px;
	margin-left: -5px;
}
@screen sm {
	h1 {
		font-size: 122px;
		margin-left: -7.15px;
	}
}

.scroll-cap {
	box-shadow: inset -14px 0 12px -5px white;
}
</style>
