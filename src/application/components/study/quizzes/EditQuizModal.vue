<template>
	<form class="w-full h-full flex flex-col gap-4 p-4 mdlg:p-6 text-grayColor" @submit.prevent="updateQuiz">
		<SofaHeaderText class="text-xl hidden mdlg:flex">Update Quiz</SofaHeaderText>

		<div class="w-full flex justify-between items-center sticky top-0 left-0 mdlg:hidden">
			<SofaNormalText class="!font-bold !text-base">Update Quiz</SofaNormalText>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full md:grid md:grid-cols-2 flex flex-col-reverse gap-4">
			<div class="col-span-1 w-full flex flex-col gap-3">
				<SofaTextField
					v-model="factory.title"
					customClass="rounded-custom !bg-lightGray"
					type="text"
					placeholder="Title"
					borderColor="border-transparent"
					:error="factory.errors.title" />

				<SofaTextarea
					v-model="factory.description"
					:rows="4"
					textAreaStyle="rounded-custom !bg-lightGray md:p-4 p-3"
					placeholder="Description"
					:error="factory.errors.description" />

				<SofaSelect
					v-model="factory.topic"
					customClass="rounded-custom !bg-lightGray"
					placeholder="Topic"
					borderColor="border-transparent"
					:error="factory.errors.topic"
					:options="topics.map((t) => ({ key: t.title, value: t.title }))"
					:canUseCustom="true" />
			</div>

			<div class="col-span-1 flex flex-col w-full pb-4 md:!pb-0">
				<SofaImageLoader class="w-full rounded-custom relative" :photoUrl="factory.photo?.link ?? '/images/default.svg'">
					<div class="absolute bottom-0 left-0 pb-3 flex w-full items-center justify-center">
						<SofaFileInput v-model="factory.photo" accept="image/*">
							<div class="p-3 flex items-center justify-center gap-2 rounded-custom bg-deepGray bg-opacity-50">
								<SofaIcon class="h-[18px]" name="camera-white" />
								<SofaNormalText color="text-white" content="Add cover photo" />
							</div>
						</SofaFileInput>
					</div>
				</SofaImageLoader>
			</div>
		</div>

		<div class="w-full flex flex-col gap-2">
			<SofaCheckbox
				:modelValue="factory.timeLimit === null"
				type="switch"
				@update:modelValue="(selected) => (factory.timeLimit = selected ? null : (quiz?.questions.length ?? 0) * 30)">
				<SofaNormalText content="Use individual question times" class="capitalize" />
			</SofaCheckbox>
			<SofaTextField
				v-if="factory.timeLimit !== null"
				v-model="factory.timeLimit"
				type="number"
				:min="1"
				customClass="rounded-custom !bg-lightGray"
				placeholder="Enter time limit"
				:error="factory.errors.timeLimit"
				borderColor="border-transparent">
				<template #inner-suffix>
					<div class="flex items-center gap-1 border-l-2 border-darkLightGray pl-3">
						<SofaNormalText content="s" />
					</div>
				</template>
			</SofaTextField>
		</div>

		<div class="w-full flex flex-col gap-2">
			<SofaTextField
				v-model="factory.tagString"
				customClass="rounded-custom !bg-lightGray"
				name="Tags"
				placeholder="Tags (Comma separated for multiple)"
				borderColor="border-transparent" />
			<div class="w-full flex flex-wrap gap-2 items-center">
				<template v-for="(item, index) in factory.tags" :key="index">
					<div class="p-2 border-2 flex items-center gap-2 rounded-custom border-darkLightGray">
						<SofaNormalText color="text-grayColor" :content="item" />
						<SofaIcon name="circle-close" class="h-[17px] cursor-pointer" @click="factory.removeTag(index)" />
					</div>
				</template>
			</div>
		</div>

		<div class="flex gap-4 items-center flex-wrap">
			<SofaNormalText content="Allowed Modes: " />
			<SofaCheckbox v-for="mode in modes" :key="mode.value" v-model="factory[mode.key] as any" type="switch">
				<SofaNormalText :content="mode.value" class="capitalize" />
			</SofaCheckbox>
		</div>

		<SofaCheckbox v-if="isAdmin" v-model="factory.isForTutors" type="switch">
			<SofaNormalText content="Is for tutor assessments?" />
		</SofaCheckbox>

		<div class="w-full flex items-center justify-between">
			<SofaButton
				type="button"
				padding="px-5 py-2"
				bgColor="bg-white"
				textColor="text-grayColor"
				class="border border-gray-100 hidden mdlg:inline-block"
				@click.prevent="close">
				Exit
			</SofaButton>

			<div class="mdlg:w-auto w-full flex gap-3 items-center">
				<SofaButton :disabled="!factory.valid" padding="px-5 mdlg:py-2 py-3" class="mdlg:w-auto w-full" type="submit">
					Save
				</SofaButton>
				<SofaButton
					v-if="!quiz?.isPublished"
					type="button"
					:disabled="!factory.valid"
					padding="px-5 mdlg:py-2 py-3"
					class="mdlg:w-auto w-full"
					@click.prevent="publishQuiz">
					Publish
				</SofaButton>
			</div>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useGenericTagsList, useTopicsList } from '@app/composables/interactions/tags'
import { useEditQuiz } from '@app/composables/study/quizzes'
import { QuizEntity, QuizModes } from '@modules/study'

const props = defineProps<{
	close: () => void
	quiz: QuizEntity
}>()

const { quiz, quizFactory: factory, updateQuiz, publishQuiz } = useEditQuiz(props.quiz.id)

const { isAdmin } = useAuth()

const { topics } = useTopicsList()
const { tags } = useGenericTagsList()

const modes: { value: QuizModes; key: keyof typeof factory }[] = [
	{ value: QuizModes.games, key: 'modeGames' },
	{ value: QuizModes.tests, key: 'modeTests' },
	{ value: QuizModes.assessments, key: 'modeAssessments' },
	{ value: QuizModes.practice, key: 'modePractice' },
	{ value: QuizModes.flashcards, key: 'modeFlashcards' },
]

watch(
	topics,
	() => {
		if (!topics.length) return
		if (factory.topicId && !factory.topic) {
			const topic = topics.find((t) => t.id === factory.topicId)
			if (topic) factory.topic = topic.title
		}
	},
	{ immediate: true },
)

watch(
	tags,
	() => {
		if (!tags.length) return
		if (factory.tagIds.length && !factory.tags.length) {
			const myTags = tags.filter((t) => factory.tagIds.includes(t.id))
			factory.tags = factory.tagIds.map((t) => myTags.find((mt) => t === mt.id)?.title).filter(Boolean)
		}
	},
	{ immediate: true },
)
</script>
