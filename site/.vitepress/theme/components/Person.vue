<template>
<span class="inline-block">
	<a :href="person.href">{{ person.name }}</a>
	<span v-if="age" class="text-sm text-gray-500"> ({{ age }})</span>
</span>&ensp;
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { DateData, PersonData } from '../../collections'

const props = defineProps<{
	person: PersonData,
	date?: DateData,
}>()

function getAgeDescriptionAt(date?: DateData) {
	if (!date) {
		return null
	}
	const dateBirth = props.person.dateBirth
	if (!dateBirth) {
		return null
	}
	let yearsDiff = date.year - dateBirth.year
	let monthsDiff = date.month - dateBirth.month
	const daysDiff = (date.day ?? 1) - (dateBirth.day ?? 1)
	if (daysDiff < 0) {
		monthsDiff -= 1
	}
	if (yearsDiff <= 2) {
		const monthsOld = yearsDiff * 12 + monthsDiff
		if (monthsOld < 24) {
			return monthsOld + 'mo'
		}
	}
	if (monthsDiff < 0) {
		yearsDiff -= 1
	}
	return yearsDiff.toString()
}

const age = computed(() => getAgeDescriptionAt(props.date))
</script>
