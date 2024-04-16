<template>
	<div class="w-full flex flex-col overflow-y-auto grow outline-none border border-lightGray rounded-lg shrink-0">
		<VuePDF v-for="page in pages" :key="page" :page="page" :pdf="pdf" textLayer annotationLayer fitParent class="h-full" />
	</div>
</template>

<script lang="ts" setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'

const props = defineProps<{
	documentUrl: string
}>()

const { pdf, pages } = usePDF(props.documentUrl)
</script>
