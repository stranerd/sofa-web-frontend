<template>
	<PlayWrapper :id="playId" :type="type" :skipParticipants="true">
		<template #default="{ play, questions, extras }">
			<component
				:is="play.isFlashcards() ? PlayFlashcard : play.isPractice() ? PlayPractice : PlayGeneric"
				v-if="extras.isParticipant"
				:play="play"
				:quizProps="{
					questions: questions,
					title: play.title,
					answers: extras.answers,
					useTimer: play.isTimed,
					timing: play.timing,
					isDark: play.isDark,
					totalTime: play.totalTimeInSec,
					start: extras.startQuiz,
					submit: extras.submitAnswer,
					reset: extras.resetAnswer,
					isInModal,
				}" />
			<div v-else-if="play.canJoinAfterStart && extras.canJoin" class="flex flex-col h-full items-center justify-center gap-4">
				<SofaHeading class="capitalize" size="title" :content="`${play.singularizedType} already started`" />
				<div class="flex gap-4 items-center">
					<SofaButton class="px-6 py-3" @click="extras.join(true)">Join Now</SofaButton>
					<SofaButton class="px-6 py-3" @click="$router.replace(play.resultsPage)">Wait for Results</SofaButton>
				</div>
			</div>
			<div v-else class="flex flex-col h-full items-center justify-center gap-4">
				<SofaText :content="`You cannot join this ${play.singularizedType} anymore`" />
			</div>
		</template>
	</PlayWrapper>
</template>

<script lang="ts" setup>
import PlayWrapper from './PlayWrapper.vue'
import PlayFlashcard from './types/PlayFlashcard.vue'
import PlayGeneric from './types/PlayGeneric.vue'
import PlayPractice from './types/PlayPractice.vue'
import { PlayTypes } from '@modules/plays'

defineProps<{
	playId: string
	type: PlayTypes
	isInModal?: boolean
}>()
</script>
