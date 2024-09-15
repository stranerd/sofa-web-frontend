<template>
	<div v-if="item" class="flex flex-col gap-4 grow overflow-y-auto scrollbar-none">
		<template v-if="quiz">
			<SofaImageLoader class="w-full rounded-custom h-[200px]" :photoUrl="quiz.picture" />

			<SofaHeading :content="quiz.title" />

			<div class="w-full text-primaryPurple flex items-center gap-2">
				<SofaText content="Quiz" />
				<span class="size-[4px] rounded-full bg-current" />
				<SofaText :content="`${quiz.questions.length} questions`" />
			</div>

			<SofaText :content="quiz.description" />

			<div class="flex items-center gap-2">
				<SofaRatings v-model="quiz.ratings.avg" size="h-[15px]" />
				<SofaText> {{ quiz.ratings.avg }} </SofaText>
				<SofaText> ({{ quiz.ratings.count }} ratings) </SofaText>
			</div>

			<div class="flex items-center gap-2">
				<SofaAvatar :size="20" :photoUrl="quiz.user.bio.photo?.link" />
				<SofaText :content="quiz.user.bio.publicName" />
			</div>

			<div class="flex items-center gap-2">
				<SofaIcon class="h-[16px]" name="calendar" />
				<SofaText :content="`Last updated ${$utils.formatTime(quiz.updatedAt)}`" />
			</div>
		</template>

		<form v-if="file" class="flex flex-col gap-4" @submit.prevent="updateFile">
			<SofaFormGroup>
				<SofaLabel>Title</SofaLabel>
				<SofaInput v-model="factory.title" type="text" placeholder="File title" />
			</SofaFormGroup>

			<SofaFormGroup>
				<SofaLabel>Description</SofaLabel>
				<SofaTextarea v-model="factory.description" :rows="6" placeholder="File description" />
			</SofaFormGroup>

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
	item: ExtendedCourseSectionItem | null
}>()

const quiz = computed(() => (props.item?.type === Coursable.quiz ? props.item.quiz : null))
const file = computed(() => (props.item?.type === Coursable.file ? props.item.file : null))

const { factory, updateFile } = useUpdateFile(file)

watch(file, () => {
	if (file.value) factory.loadEntity(file.value)
})
</script>
