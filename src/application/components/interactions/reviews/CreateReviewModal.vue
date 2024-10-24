<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="submit">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeading size="title" :content="modTitle" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaHeading :content="modTitle" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<UserName v-if="conversation?.tutor" :user="conversation.tutor" bold />

		<SofaRatings v-model="factory.rating" :readonly="false" size="h-[30px]" class="mb-3 self-center" />

		<SofaTextarea v-model="factory.message" placeholder="Why are you reviewing this?" class="p-4" :error="factory.errors.message" />

		<SofaButton :disabled="!factory.valid" type="submit" padding="px-5 py-3" class="self-center w-full mdlg:w-auto">Submit</SofaButton>
	</form>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCreateReview } from '@app/composables/interactions/reviews'
import { ConversationEntity } from '@modules/conversations'
import { Interaction, singulars } from '@modules/interactions'
import { CourseEntity, QuizEntity } from '@modules/study'

const props = defineProps<
	Interaction & {
		close: () => void
		submit?: (data: { message: string; rating: number }) => Promise<boolean | undefined>
		afterSubmit?: () => void
		title?: string
		conversation?: ConversationEntity
		course?: CourseEntity
		quiz?: QuizEntity
	}
>()

const modTitle = computed(() => props.title ?? `Rate this ${singulars[props.type] ?? props.type}`)

const { factory, createReview } = useCreateReview(props)

const submit = async () => {
	const succeeded = await createReview(props.submit ? async (factory) => props.submit!(await factory.toModel()) : undefined)
	if (!succeeded) return
	props.close()
	props.afterSubmit?.()
}
</script>
