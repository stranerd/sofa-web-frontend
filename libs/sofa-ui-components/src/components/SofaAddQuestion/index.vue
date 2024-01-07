<template>
	<div class="w-full hidden mdlg:flex flex-col gap-4 h-full overflow-y-auto scrollbar-none">
		<Draggable :list="reactiveQuestions" class="w-full flex flex-col gap-4" item-key="id" group="question-list-lg">
			<template #item="{ element, index }">
				<a
					class="w-full p-4 group rounded-lg gap-2 flex flex-col"
					:class="selectedQuestionId == element.id ? 'bg-skyBlue' : 'bg-lightGray'"
					@click="selectQuestion(element)">
					<div class="flex items-center gap-2">
						<SofaNormalText class="!font-bold" :content="`${index + 1}`" />
						<span class="w-[4px] h-[4px] rounded-full bg-deepGray" />
						<SofaNormalText
							class="!font-bold truncate"
							:content="Logic.Study.getQuestionTypeLabel(factory.entityId === element.id ? factory.type : element.type)" />

						<div class="flex flex-row-reverse items-center ml-auto text-bodyBlack">
							<template v-for="(user, index) in users[element.id] ?? []" :key="user.id">
								<SofaAvatar v-if="index < 3" :photoUrl="user.bio.photo?.link" size="28" class="-ml-1" />
								<SofaAvatar v-if="index === 3" bgColor="bg-darkBody !bg-opacity-80 text-lightGray" size="28" class="-ml-1">
									<span>{{ users[element.id].length - 3 }}+</span>
								</SofaAvatar>
							</template>
						</div>
					</div>

					<div
						class="w-full h-[144px] bg-cover"
						:style="`background-image: url('/images/${Logic.Study.getQuestionTypeImage(
							factory.entityId === element.id ? factory.type : element.type,
						)}.svg')`">
						<div class="h-full w-full hidden group-hover:flex gap-3 items-center justify-center">
							<a
								@click.stop="emits('duplicateQuestion', element)"
								class="w-[40px] h-[40px] bg-darkLightGray opacity-50 rounded-lg flex items-center justify-center">
								<SofaIcon name="duplicate-quiz" class="h-[24px]" />
							</a>
							<a
								v-if="quiz.status !== 'published'"
								@click.stop="emits('deleteQuestion', element.id)"
								class="w-[40px] h-[40px] bg-darkLightGray opacity-50 rounded-lg flex items-center justify-center">
								<SofaIcon name="delete-quiz" class="h-[24px]" />
							</a>
						</div>
					</div>
				</a>
			</template>
		</Draggable>

		<a
			class="h-[144px] flex-shrink-0 w-full rounded-xl border-2 border-darkLightGray flex items-center justify-center"
			@click="emits('addQuestion')">
			<SofaIcon name="add-item" class="h-[30px]" />
		</a>
	</div>

	<!-- Smaller screens bottom bar -->
	<div
		class="w-full overflow-x-auto scrollbar-hide flex mdlg:!hidden items-center py-3 gap-2 px-4 border-t justify-between bg-white border-lightGray">
		<Draggable
			class="w-full flex flex-nowrap gap-2 items-center whitespace-nowrap"
			:list="reactiveQuestions"
			group="question-list-mobile"
			item-key="id"
			direction="horizontal"
			:disabled="true">
			<template #item="{ element, index }">
				<a
					class="w-[48px] h-[48px] flex-shrink-0 rounded-custom items-center justify-center flex relative"
					:class="selectedQuestionId === element.id ? 'bg-primaryPurple' : 'bg-lightGray'"
					@click="selectQuestion(element)">
					<SofaNormalText
						:color="selectedQuestionId === element.id ? 'text-white' : 'text-bodyBlack'"
						:content="`${index + 1}`" />
					<SofaNormalText
						v-if="users[element.id]?.length"
						class="aspect-square leading-none h-4 rounded-full flex items-center justify-center bg-primaryRed absolute right-[-0.25rem] top-[-0.25rem]"
						color="text-lightGray"
						:content="`${users[element.id].length}`" />
				</a>
			</template>
		</Draggable>

		<SofaIcon class="h-[44px] cursor-pointer flex-shrink-0" name="faded-plus" @click="emits('addQuestion')" />
	</div>
</template>

<script lang="ts" setup>
import { QuestionEntity, QuestionFactory, QuizEntity } from '@modules/study'
import { Logic, SingleUser } from 'sofa-logic'
import { PropType, computed, defineEmits, defineProps, reactive, ref, toRef, watch } from 'vue'
import Draggable from 'vuedraggable'
import SofaAvatar from '../SofaAvatar'
import SofaIcon from '../SofaIcon'
import { SofaNormalText } from '../SofaTypography'

const props = defineProps({
	questionId: {
		type: String,
		required: true,
	},
	questions: {
		type: Array as PropType<QuestionEntity[]>,
		required: true,
	},
	quiz: {
		type: QuizEntity,
		required: true,
	},
	factory: {
		type: QuestionFactory,
		required: true,
	},
	users: {
		type: Object as PropType<Record<string, SingleUser[]>>,
		required: true,
	},
})

const emits = defineEmits(['update:questionId', 'addQuestion', 'duplicateQuestion', 'deleteQuestion', 'reorderQuestions'])

const selectedQuestionId = computed({
	get: () => props.questionId,
	set: (v) => {
		emits('update:questionId', v)
	},
})

const questionsRef = toRef(props, 'questions')
const reactiveQuestions = reactive([...questionsRef.value])
const canEmit = ref(false)

const selectQuestion = (question: QuestionEntity) => {
	selectedQuestionId.value = question.id
}

watch(questionsRef, () => {
	reactiveQuestions.splice(0, reactiveQuestions.length, ...questionsRef.value)
	canEmit.value = true
})

watch(reactiveQuestions, () => {
	const ids = reactiveQuestions.map((q) => q.id)
	if (canEmit.value && !Logic.Differ.equal(props.quiz.questions, ids)) emits('reorderQuestions', ids)
})
</script>
