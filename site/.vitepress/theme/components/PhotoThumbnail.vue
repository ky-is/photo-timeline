<template>
<button type="button" @click="selectPhoto(photo)">
	<Photo :photo="photo" size="thumbnail" />
</button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

import Photo from './Photo.vue'

import { selectPhoto } from '../../useSelectedPhoto'

import type { PhotoData } from '../../collections'

defineProps<{
	photo: PhotoData
}>()
</script>
