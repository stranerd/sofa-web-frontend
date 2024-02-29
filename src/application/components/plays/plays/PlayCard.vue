<template>
	<router-link
		v-if="quiz"
		:to="play.isClosed ? play.resultsPage : play.lobbyPage"
		class="w-full flex gap-3 p-3 rounded-custom bg-white shadow-custom">
		<SofaImageLoader customClass="w-[110px] h-[78px] mdlg:h-[80px] rounded-custom" :photoUrl="quiz.picture" />
		<div class="flex flex-col w-full gap-2">
			<SofaNormalText class="!font-bold line-clamp-1">
				{{ quiz.title }}
			</SofaNormalText>
			<SofaNormalText color="text-grayColor" class="capitalize">
				{{ play.singularizedType }}
			</SofaNormalText>

			<div class="w-full flex items-center justify-between">
				<SofaNormalText :color="play.getResultColor(id)" customClass="font-semibold">
					{{ play.getCardLabel(id) }}
				</SofaNormalText>
				<div v-if="play.isGames()" class="flex items-center gap-2">
					<SofaNormalText color="text-grayColor">
						{{ play.participants.length }}
					</SofaNormalText>
					<SofaIcon name="participant" class="h-[15px]" />
				</div>
			</div>
		</div>
	</router-link>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useQuizzesInList } from '@app/composables/study/quizzes-list'
import { PlayEntity } from '@modules/plays'
import { useAuth } from '@app/composables/auth/auth'

const props = defineProps<{
	play: PlayEntity
}>()

const { id } = useAuth()

const { quizzes } = useQuizzesInList(computed(() => [props.play.quizId]))
const quiz = computed(() => quizzes.value.at(0) ?? null)
</script>
