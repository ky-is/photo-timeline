<template>
	<time :datetime="new Date(date.time).toISOString()" class="inline-block italic">{{ date.string }}</time>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

import type { DateData } from '../../collections'

defineProps<{
	date: DateData
}>()
</script>
