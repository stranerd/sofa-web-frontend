<template>
	<div v-if="item" class="flex flex-col gap-4 grow overflow-y-auto scrollbar-none">
		<template v-if="quiz">
			<SofaImageLoader class="w-full rounded-custom h-[200px]" :photoUrl="quiz.picture" />

			<SofaNormalText class="font-bold" :content="quiz.title" />

			<div class="w-full text-primaryPurple flex items-center gap-2">
				<SofaNormalText color="text-current" content="Quiz" />
				<span class="size-[4px] rounded-full bg-current" />
				<SofaNormalText color="text-current" :content="`${quiz.questions.length} questions`" />
			</div>

			<SofaNormalText :content="quiz.description" />

			<div class="flex items-center gap-2">
				<SofaRatings v-model="quiz.ratings.avg" size="h-[15px]" />
				<SofaNormalText> {{ quiz.ratings.avg }} </SofaNormalText>
				<SofaNormalText> ({{ quiz.ratings.count }} ratings) </SofaNormalText>
			</div>

			<div class="flex items-center gap-2">
				<SofaAvatar :size="20" :photoUrl="quiz.user.bio.photo?.link" />
				<SofaNormalText :content="quiz.user.bio.publicName" />
			</div>

			<div class="flex items-center gap-2">
				<SofaIcon class="h-[16px]" name="calendar" />
				<SofaNormalText :content="`Last updated ${$utils.formatTime(quiz.updatedAt)}`" />
			</div>
		</template>

		<form v-if="file" class="flex flex-col gap-4" @submit.prevent="updateFile">
			<SofaTextField
				v-model="factory.title"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="File title"
				hasTitle
				borderColor="border-transparent">
				<template #title>Title</template>
			</SofaTextField>

			<SofaTextarea
				v-model="factory.description"
				hasTitle
				:rows="6"
				textAreaStyle="rounded-custom !bg-lightGray md:p-4 p-3"
				placeholder="File description">
				<template #title>Description</template>
			</SofaTextarea>

			<SofaButton v-if="factory.hasChanges" type="submit" :disabled="!factory.valid" padding="px-4 py-2" class="self-end">
				Save changes
			</SofaButton>
		</form>
	</div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useUpdateFile } from '@app/composables/study/files'
import { Coursable, CourseEntity, ExtendedCourseSectionItem } from '@modules/study'

const props = defineProps<{
	course: CourseEntity
	item?: ExtendedCourseSectionItem
}>()

const quiz = computed(() => (props.item?.type === Coursable.quiz ? props.item.quiz : null))
const file = computed(() => (props.item?.type === Coursable.file ? props.item.file : null))

const { factory, updateFile } = useUpdateFile(file)

watch(file, () => {
	if (file.value) factory.loadEntity(file.value)
})
</script>
