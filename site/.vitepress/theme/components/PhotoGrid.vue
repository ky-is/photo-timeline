<template>
	<div class="sm:space-x-1  flex flex-wrap">
		<PhotoThumbnail
			v-for="photo in photos" :key="photo.title"
			:photo="photo"
			class="w-64 sm:mb-1 max-w-1/2"
		/>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

import PhotoThumbnail from '../components/PhotoThumbnail.vue'

import type { PhotoData } from '../../collections'

defineProps<{
	photos: PhotoData[]
}>()
</script>
