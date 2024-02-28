<template>
	<form class="w-full h-full flex flex-col gap-4 text-grayColor" @submit.prevent="emits('updateQuiz')">
		<div class="flex flex-col flex-grow overflow-y-auto gap-4">
			<div class="w-full md:grid md:grid-cols-2 flex flex-col-reverse gap-4">
				<div class="col-span-1 w-full flex flex-col gap-3">
					<SofaTextField
						v-model="factory.title"
						customClass="rounded-custom !bg-lightGray"
						type="text"
						name="Title"
						placeholder="Title"
						borderColor="border-transparent"
						:error="factory.errors.title" />

					<SofaTextarea
						v-model="factory.description"
						:hasTitle="false"
						:rows="4"
						textAreaStyle="rounded-custom !bg-lightGray md:p-4 p-3"
						placeholder="Description"
						:error="factory.errors.description" />

					<SofaSelect
						v-model="factory.topic"
						customClass="rounded-custom !bg-lightGray"
						name="Topic"
						placeholder="Topic"
						borderColor="border-transparent"
						:error="factory.errors.topic"
						:options="topics.map((t) => ({ key: t.title, value: t.title }))"
						:canUseCustom="true" />
				</div>

				<div class="col-span-1 flex flex-col w-full pb-4 md:!pb-0">
					<SofaImageLoader
						customClass="w-full md:!h-full h-[220px] rounded-custom relative"
						:photoUrl="factory.photo?.link ?? '/images/default.png'">
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

			<SofaCheckbox v-if="isAdmin" v-model="factory.isForTutors" type="switch">
				<SofaNormalText content="Is tutor assessments?" />
			</SofaCheckbox>
		</div>

		<div class="w-full flex items-center justify-between bg-white mdlg:p-0 py-4">
			<SofaButton
				type="button"
				padding="px-5 py-2"
				bgColor="bg-white"
				textColor="text-grayColor"
				customClass="border border-gray-100 hidden mdlg:inline-block"
				@click.prevent="close">
				Exit
			</SofaButton>

			<div class="mdlg:w-auto w-full flex gap-3 items-center">
				<SofaButton :disabled="!factory.valid" padding="px-5 mdlg:py-2 py-3" class="mdlg:w-auto w-full" type="submit">
					Save
				</SofaButton>
				<SofaButton
					v-if="!quiz.isPublished"
					type="button"
					:disabled="!factory.valid"
					padding="px-5 mdlg:py-2 py-3"
					class="mdlg:w-auto w-full"
					@click.prevent="emits('publishQuiz')">
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
import { QuizEntity, QuizFactory } from '@modules/study'

const props = defineProps<{
	quiz: QuizEntity
	factory: QuizFactory
	close: () => void
}>()

const emits = defineEmits<{
	updateQuiz: []
	publishQuiz: []
}>()

const { isAdmin } = useAuth()

const { topics } = useTopicsList()
const { tags } = useGenericTagsList()

watch(
	topics,
	() => {
		if (!topics.length) return
		if (props.factory.topicId && !props.factory.topic) {
			const topic = topics.find((t) => t.id === props.factory.topicId)
			if (topic) props.factory.topic = topic.title
		}
	},
	{ immediate: true },
)

watch(
	tags,
	() => {
		if (!tags.length) return
		if (props.factory.tagIds.length && !props.factory.tags.length) {
			const myTags = tags.filter((t) => props.factory.tagIds.includes(t.id))
			props.factory.tags = props.factory.tagIds.map((t) => myTags.find((mt) => t === mt.id)?.title).filter(Boolean)
		}
	},
	{ immediate: true },
)
</script>
