<template>
	<div v-if="item" class="flex flex-col gap-4 grow">
		<div class="flex gap-2 justify-between items-center pb-4 border-b border-lightGray">
			<SofaNormalText class="!font-bold" content="Details" />
		</div>
		<div class="flex flex-col gap-4 grow overflow-y-auto scrollbar-none">
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
					<SofaIcon class="h-[16px]" name="calendar-black" />
					<SofaNormalText :content="`Last updated ${$utils.formatTime(quiz.updatedAt)}`" />
				</div>
			</template>

			<template v-if="file">
				<SofaTextField
					v-model="factory.title"
					customClass="rounded-custom !bg-lightGray"
					type="text"
					placeholder="File title"
					:hasTitle="true"
					borderColor="border-transparent">
					<template #title>Title</template>
				</SofaTextField>

				<SofaTextarea
					v-model="factory.description"
					:hasTitle="false"
					:rows="6"
					textAreaStyle="rounded-custom !bg-lightGray md:p-4 p-3"
					placeholder="Description" />
			</template>
		</div>
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

/* const emits = defineEmits<{
	deleteItem: [ExtendedCourseSectionItem]
}>() */

const quiz = computed(() => (props.item?.type === Coursable.quiz ? props.item.quiz : null))
const file = computed(() => (props.item?.type === Coursable.file ? props.item.file : null))

const { factory } = useUpdateFile(file)

watch(file, () => {
	if (file.value) factory.loadEntity(file.value)
})
</script>
