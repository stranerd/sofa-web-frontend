<template>
	<div class="w-full flex flex-col grow mdlg:gap-0 gap-4 relative overflow-y-auto scrollbar-none">
		<div class="flex flex-col gap-6 h-full overflow-y-auto px-4 mdlg:px-0">
			<div class="w-full flex flex-col gap-4">
				<a class="w-full flex items-center gap-2" @click="toggleOpen('type')">
					<SofaIcon class="h-[18px]" name="question-type" />
					<SofaHeading content="Question type" />
					<SofaText :content="QuestionEntity.getLabel(factory.type)" class="ml-auto" />
					<SofaIcon class="h-[7px]" name="chevron-down" :class="{ 'rotate-180': isOpen('type') }" />
				</a>

				<div v-if="isOpen('type')" class="w-full grid grid-cols-2 gap-3">
					<a
						v-for="type in QuestionEntity.getAllTypes()"
						:key="type.value"
						class="col-span-1 p-3 flex flex-col gap-2 items-center justify-center rounded-lg"
						:class="factory.type === type.value ? 'bg-lightBlue' : 'bg-[#F2F5F8]'"
						@click="factory.type = type.value">
						<SofaIcon :name="type.icon" class="h-[50px]" />
						<SofaText class="text-center" :content="type.label" />
					</a>
				</div>
			</div>

			<div class="w-full flex flex-col gap-4">
				<a class="w-full flex items-center gap-2" @click="toggleOpen('timeLimit')">
					<SofaIcon class="h-[18px]" name="time-limit" />
					<SofaHeading content="Time limit" />
					<SofaText :content="$utils.getDigitalTime(factory.timeLimit)" class="ml-auto" />
					<SofaIcon class="h-[7px]" name="chevron-down" :class="{ 'rotate-180': isOpen('timeLimit') }" />
				</a>

				<div v-if="isOpen('timeLimit')" class="w-full flex flex-wrap gap-3">
					<a
						v-for="time in [5, 10, 20, 30, 60, 90, 120, 180, 240, 300]"
						:key="time"
						class="rounded-lg flex px-4 py-2 items-center justify-center gap-1"
						:class="factory.timeLimit === time ? 'bg-primaryPurple text-white' : 'bg-[#F2F5F8] text-deepGray'"
						@click="factory.timeLimit = time">
						<SofaText class="text-center" :content="$utils.getDigitalTime(time)" />
					</a>
				</div>
			</div>
		</div>

		<div class="rounded-b-xl w-full p-4 mdlg:pb-0 mdlg:px-0 border-t-2 border-[#F2F5F8] flex flex-col gap-4">
			<a class="w-full flex mdlg:hidden items-center justify-start gap-3" @click="emits('showCurrentlyEditing')">
				<SofaIcon name="edit" class="h-[16px] fill-grayColor" />
				<SofaText content="Currently editing" />
				<div class="flex flex-row-reverse items-center ml-auto">
					<template v-for="(user, index) in users[question.id] ?? []" :key="user.id">
						<SofaAvatar v-if="index < 3" :photoUrl="user.bio.photo?.link" :size="28" class="-ml-1" />
						<SofaAvatar v-if="index === 3" bgColor="bg-darkBody !bg-opacity-80 text-lightGray" :size="28" class="-ml-1">
							<span>{{ users[question.id].length - 3 }}+</span>
						</SofaAvatar>
					</template>
				</div>
			</a>
			<a
				:class="{ 'pointer-events-none !text-grayColor': !factory.valid || !factory.hasChanges }"
				class="text-primaryGreen w-full flex mdlg:hidden items-center justify-start gap-3"
				@click="emits('saveQuestion')">
				<SofaIcon name="save" class="h-[16px] fill-current" />
				<SofaText content="Save question" />
			</a>
			<a class="w-full flex mdlg:hidden items-center justify-start gap-3" @click="emits('duplicateQuestion', question)">
				<SofaIcon name="copy" class="h-[16px]" />
				<SofaText content="Duplicate question" />
			</a>
			<a
				v-if="!quiz.isPublished"
				class="w-full flex mdlg:hidden items-center justify-start gap-3"
				@click="emits('deleteQuestion', question.id)">
				<SofaIcon name="trash" class="h-[16px]" />
				<SofaText class="text-primaryRed" content="Delete question" />
			</a>
			<a v-if="!quiz.isPublished" class="w-full flex items-center justify-start gap-3" @click="emits('deleteQuiz')">
				<SofaIcon name="trash" class="h-[16px]" />
				<SofaText class="text-primaryRed" content="Delete quiz" />
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { QuestionEntity, QuestionFactory, QuizEntity } from '@modules/study'
import { UserEntity } from '@modules/users'

defineProps<{
	quiz: QuizEntity
	question: QuestionEntity
	factory: QuestionFactory
	users: Record<string, UserEntity[]>
}>()

const emits = defineEmits<{
	showCurrentlyEditing: []
	duplicateQuestion: [QuestionEntity]
	saveQuestion: []
	deleteQuestion: [string]
	deleteQuiz: []
}>()

const openOptions = ref(['type', 'timeLimit'])

const isOpen = (key: string) => openOptions.value.includes(key)
const toggleOpen = (key: string) => {
	if (isOpen(key)) openOptions.value = openOptions.value.filter((k) => k !== key)
	else openOptions.value.push(key)
}
</script>
