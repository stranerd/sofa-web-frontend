<template>
	<div class="w-full hidden mdlg:flex flex-col gap-4 h-full overflow-y-auto scrollbar-none">
		<VueDraggable v-model="reactiveQuestions" class="w-full flex flex-col gap-4" group="question-list-lg">
			<a
				v-for="(element, index) in reactiveQuestions"
				:key="index"
				class="w-full p-4 group rounded-lg gap-2 flex flex-col"
				:class="selectedQuestionId == element.id ? 'bg-lightBlue' : 'bg-lightGray'"
				@click="selectQuestion(element)">
				<div class="flex items-center gap-2">
					<SofaHeading :content="`${index + 1}`" />
					<span class="size-[4px] rounded-full bg-deepGray" />
					<SofaHeading :content="QuestionEntity.getLabel(factory.entityId === element.id ? factory.type : element.type)" />

					<div class="flex flex-row-reverse items-center ml-auto">
						<template v-for="(user, i) in users[element.id] ?? []" :key="user.id">
							<SofaAvatar v-if="i < 3" :photoUrl="user.bio.photo?.link" :size="28" class="-ml-1" />
							<SofaAvatar v-if="i === 3" bgColor="bg-darkBody !bg-opacity-80 text-lightGray" :size="28" class="-ml-1">
								<span>{{ users[element.id].length - 3 }}+</span>
							</SofaAvatar>
						</template>
					</div>
				</div>

				<SofaImageLoader
					class="w-full aspect-video"
					:photoUrl="`/images/questions/${QuestionEntity.getImage(factory.entityId === element.id ? factory.type : element.type)}.svg`">
					<div class="h-full w-full hidden group-hover:flex gap-3 items-center justify-center">
						<a
							class="size-[40px] bg-darkLightGray opacity-50 rounded-lg flex items-center justify-center"
							@click.stop="emits('duplicateQuestion', element)">
							<SofaIcon name="copy" class="h-[24px] fill-current" />
						</a>
						<a
							v-if="!quiz.isPublished"
							class="size-[40px] bg-darkLightGray opacity-50 rounded-lg flex items-center justify-center"
							@click.stop="emits('deleteQuestion', element.id)">
							<SofaIcon name="trash" class="h-[24px] fill-current" />
						</a>
					</div>
				</SofaImageLoader>
			</a>
		</VueDraggable>

		<a
			class="aspect-video shrink-0 w-full rounded-xl border-2 border-darkLightGray flex items-center justify-center"
			@click="emits('addQuestion')">
			<SofaIcon name="add" class="h-[30px] fill-grayColor" />
		</a>
	</div>

	<!-- Smaller screens bottom bar -->
	<div
		class="w-full overflow-x-auto scrollbar-hide flex mdlg:!hidden items-center py-3 gap-2 px-4 border-t justify-between bg-white border-lightGray">
		<VueDraggable
			v-model="reactiveQuestions"
			class="flex-1 flex flex-nowrap gap-2 items-center whitespace-nowrap"
			group="question-list-mobile"
			direction="horizontal"
			:disabled="true">
			<a
				v-for="(element, index) in reactiveQuestions"
				:key="index"
				class="size-[48px] shrink-0 rounded-custom items-center justify-center flex relative"
				:class="selectedQuestionId === element.id ? 'bg-primaryPurple text-white' : 'bg-lightGray'"
				@click="selectQuestion(element)">
				<SofaText :content="`${index + 1}`" />
				<SofaText
					v-if="users[element.id]?.length"
					class="aspect-square leading-none h-4 rounded-full flex items-center justify-center bg-primaryRed text-white absolute right-[-0.25rem] top-[-0.25rem]"
					:content="`${users[element.id].length}`" />
			</a>
		</VueDraggable>

		<SofaIcon class="h-[44px] fill-lightGray" name="add" @click="emits('addQuestion')" />
	</div>
</template>

<script lang="ts" setup>
import { Differ } from 'valleyed'
import { ref, toRef, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { UserEntity } from '@modules/users'
import { QuestionEntity, QuestionFactory, QuizEntity } from '@modules/study'

const props = defineProps<{
	questions: QuestionEntity[]
	quiz: QuizEntity
	factory: QuestionFactory
	users: Record<string, UserEntity[]>
}>()

const selectedQuestionId = defineModel<string>('questionId')

const emits = defineEmits<{
	addQuestion: []
	duplicateQuestion: [QuestionEntity]
	deleteQuestion: [string]
	reorderQuestions: [string[]]
}>()

const questionsRef = toRef(props, 'questions')
const reactiveQuestions = ref([...questionsRef.value])
const canEmit = ref(false)

const selectQuestion = (question: QuestionEntity) => {
	selectedQuestionId.value = question.id
}

watch(questionsRef, () => {
	reactiveQuestions.value = questionsRef.value
	canEmit.value = true
})

watch(reactiveQuestions, () => {
	const ids = reactiveQuestions.value.map((q) => q.id)
	if (canEmit.value && !Differ.equal(props.quiz.questions, ids)) emits('reorderQuestions', ids)
})
</script>
