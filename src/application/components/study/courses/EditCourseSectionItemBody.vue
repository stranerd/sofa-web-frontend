<template>
	<EmbeddedSection v-if="item?.type === Coursable.file" :item="item" :course="course" class="w-full rounded-custom" />

	<div v-if="item?.type == Coursable.quiz" class="flex flex-col gap-4">
		<div class="w-full flex items-center justify-between">
			<SofaHeaderText> Questions </SofaHeaderText>
			<SofaNormalText color="text-primaryPink" as="a" @click="showAnswers = !showAnswers">
				{{ showAnswers ? 'Hide' : 'Show' }} answers
			</SofaNormalText>
		</div>
		<QuizWrapper :quiz="item.quiz">
			<template #default="{ questions }">
				<div v-for="question in questions" :key="question.hash" class="w-full bg-lightGray p-4 flex flex-col gap-2 rounded-custom">
					<div class="flex items-center gap-2">
						<SofaNormalText color="text-grayColor" :content="question.label" />
						<span class="size-[5px] rounded-full bg-grayColor" />
						<SofaNormalText color="text-grayColor" :content="$utils.getDigitalTime(question.timeLimit)" />
					</div>
					<SofaNormalText class="!font-bold" :content="question.content" />
					<SofaNormalText v-if="showAnswers" :content="question.answer" />
				</div>
			</template>
		</QuizWrapper>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Coursable, CourseEntity, ExtendedCourseSectionItem } from '@modules/study'
import EmbeddedSection from '@app/components/core/EmbeddedSection.vue'

defineProps<{
	course: CourseEntity
	item?: ExtendedCourseSectionItem
}>()

const showAnswers = ref(true)
</script>
