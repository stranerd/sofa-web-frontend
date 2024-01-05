<template>
	<div class="w-full flex flex-col h-full overflow-y-auto flex-grow outline-none border border-lightGray rounded-lg">
		<VuePDF :pdf="pdf" :textLayer="true" :fitParent="true" class="!overflow-y-auto" />
	</div>
</template>

<script lang="ts" setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { defineProps } from 'vue'

const props = defineProps({
	documentUrl: {
		type: String,
		default: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
	},
})

const { pdf } = usePDF(props.documentUrl)
</script>
