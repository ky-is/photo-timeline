<template>
	<img :src="baseURL + photo.image + `?nf_resize=${resize}&w=${maxDimension}&h=${maxDimension}`" :class="thumbnail ? 'rounded-sm' : 'object-contain'">
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

import type { PhotoData } from '../../collections'

import { baseURL } from '../../getEnvironment'

const props = defineProps<{
	photo: PhotoData
	size: 'thumbnail' | 'mobile' | 'desktop'
}>()

const thumbnail = props.size === 'thumbnail'
const maxDimension = thumbnail ? 256 : (props.size === 'mobile' ? 1024 : 2049)
const resize = thumbnail ? 'smartcrop' : 'fit'
</script>
