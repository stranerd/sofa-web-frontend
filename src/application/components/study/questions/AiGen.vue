<template>
	<div class="flex flex-col gap-6 h-full">
		<div class="flex items-center gap-3">
			<SofaInput :modelValue="factory.title" disabled>
				<template v-if="factory.type === 'document'" #prefix>
					<SofaIcon name="file-document" class="fill-current h-[20px]" />
				</template>
			</SofaInput>
			<SofaButton padding="py-3 px-4">Refresh</SofaButton>
		</div>
		<div class="grid gap-6">
			<div v-for="question in questions" :key="question.id" class="bg-lightGray rounded-lg px-2 py-4">
				<div class="flex items-center justify-between cursor-pointer gap-4" @click="toggleOptions(question.id)">
					<SofaText :content="question.question" size="sub" />
					<SofaIcon name="angle-small-down" class="h-[7px] transition" :class="question.isVisible ? 'rotate-180' : 'rotate-0'" />
					<SofaButton padding="py-2 px-3">Add</SofaButton>
				</div>
				<div v-if="question.isVisible">
					<div
						v-for="(option, index) in question.options"
						:key="option"
						class="bg-white p-2 rounded-lg mt-2 flex items-center gap-2">
						<SofaIcon :name="optionIcons[index]" class="h-[15px]" />
						<SofaText :content="option" size="sub" />
					</div>
				</div>
			</div>
		</div>

		<SofaButton padding="p-3" class="w-full mt-auto">Continue</SofaButton>
	</div>
</template>

<script lang="ts" setup>
import { AiGenFactory } from '@modules/study'

defineProps<{
	factory: AiGenFactory
}>()

// TODO: use content to make a request to aiGen API and populate questions
// on mount, fetch questions with content
// on refresh, fetch new questions with content, but keep track of old quiz and selected questions

const questions = [
	{
		id: 1,
		question: 'The currency used in granting credits to the member countries IMF is',
		options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
		isVisible: false,
	},
	{
		id: 2,
		question: 'The currency used in granting credits to the member countries IMF is',
		options: ['Option A', 'Option B', 'Option C', 'Option D'],
		isVisible: false,
	},
]

const optionIcons: IconName[] = ['q-circle', 'q-triangle', 'q-square', 'q-kite']

const toggleOptions = (id: number) => {
	const question = questions.find((q) => q.id === id)
	if (question) {
		question.isVisible = !question.isVisible
	}
}
</script>
