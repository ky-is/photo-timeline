<template>
<a
	:href="event.href"
	class="button-outline inline-block text-sm" :class="{ highlight: event.major }"
	@mouseover="onHover(event)" @mouseout="onHover(null)"
>
	{{ event.title }}
</a>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

import type { EventData } from '../../collections'

defineProps<{
	event: EventData
}>()

const emit = defineEmits<(name: 'hover', event: EventData | null) => void>()

function onHover(event: EventData | null) {
	emit('hover', event)
}
</script>
