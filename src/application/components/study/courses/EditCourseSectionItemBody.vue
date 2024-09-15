<template>
	<EmbeddedSection v-if="item?.type === Coursable.file" :item="item" :course="course" class="w-full rounded-custom" />

	<div v-if="item?.type == Coursable.quiz" class="flex flex-col gap-4">
		<div class="w-full flex items-center justify-between">
			<SofaHeading size="title"> Questions </SofaHeading>
			<SofaText class="text-primaryPink" as="a" @click="showAnswers = !showAnswers">
				{{ showAnswers ? 'Hide' : 'Show' }} answers
			</SofaText>
		</div>
		<QuizWrapper :quiz="item.quiz">
			<template #default="{ questions }">
				<div v-for="question in questions" :key="question.hash" class="w-full bg-lightGray p-4 flex flex-col gap-2 rounded-custom">
					<div class="flex items-center gap-2">
						<SofaText class="text-grayColor" :content="question.label" />
						<span class="size-[5px] rounded-full bg-grayColor" />
						<SofaText class="text-grayColor" :content="$utils.getDigitalTime(question.timeLimit)" />
					</div>
					<SofaHeading :content="question.content" />
					<SofaText v-if="showAnswers" :content="question.answer" />
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
	item: ExtendedCourseSectionItem | null
}>()

const showAnswers = ref(true)
</script>
