<template>
	<SofaDocumentReader v-if="file.type === FileType.document && mediaUrl" :documentUrl="mediaUrl" />
	<SofaImageLoader v-else-if="file.type === FileType.image && mediaUrl" :photoUrl="mediaUrl" />
	<SofaVideoPlayer v-else-if="file.type === FileType.video && mediaUrl" :videoUrl="mediaUrl" :type="file.media.type" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { CoursableAccess, FileEntity, FileType } from '@modules/study'

const props = defineProps<{
	file: FileEntity
	access?: CoursableAccess['access']
}>()

const mediaUrl = ref('')

watch(
	() => props.file,
	async () => {
		mediaUrl.value = await props.file.getUrl(props.access)
	},
	{ immediate: true },
)
</script>
