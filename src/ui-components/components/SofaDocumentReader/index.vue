<template>
	<div class="w-full flex flex-col h-full overflow-y-auto flex-grow outline-none border border-lightGray rounded-lg">
		<VuePDF v-for="page in pages" :key="page" :page="page" :pdf="pdf" text-layer annotation-layer fit-parent class="h-full" />
	</div>
</template>

<script lang="ts" setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import { defineProps } from 'vue'

const props = defineProps({
	documentUrl: {
		type: String,
		required: true,
	},
})

const { pdf, pages } = usePDF(props.documentUrl)
</script>
