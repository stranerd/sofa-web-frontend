<template>
	<div class="w-full flex flex-col items-start gap-4 p-4">
		<div class="flex w-full items-center gap-2 justify-between">
			<div class="flex items-center gap-1">
				<SofaIcon class="h-[24px] fill-primaryPurple" name="add-tutor" />
				<SofaHeaderText class="!font-bold !text-primaryPurple" content="Tutor help" />
			</div>
			<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
		</div>
		<SofaNormalText color="" content="Need extra help with your work?" class="!text-deppGray" />
		<SofaButton :bgColor="'bg-primaryPurple'" :textColor="'!text-white'" :padding="'px-6 py-4'" @click="addTutor">
			Add a tutor
		</SofaButton>
	</div>
</template>

<script lang="ts" setup>
import { ConversationEntity } from '@modules/conversations'

defineProps<{
	close: () => void
	conversation: ConversationEntity
	addTutor: () => void
}>()
</script>
