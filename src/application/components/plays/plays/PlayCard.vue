<template>
	<router-link
		:to="play.isClosed ? play.resultsPage : play.lobbyPage"
		class="w-full flex gap-3 p-3 rounded-custom bg-white shadow-custom">
		<SofaImageLoader class="w-[110px] h-[80px] rounded-custom" :photoUrl="quiz?.picture ?? '/images/default.svg'" />
		<div class="flex flex-col w-full gap-2">
			<SofaHeading clamp>{{ play.title }}</SofaHeading>
			<SofaText class="capitalize">
				{{ play.singularizedType }}
			</SofaText>

			<div class="w-full flex items-center justify-between">
				<SofaHeading :color="play.getResultColor(id)">
					{{ play.getCardLabel(id) }}
				</SofaHeading>
				<div v-if="play.isGames()" class="flex items-center gap-2">
					<SofaText class="text-grayColor">
						{{ play.participants.length }}
					</SofaText>
					<SofaIcon name="participant" class="h-[15px]" />
				</div>
			</div>
		</div>
	</router-link>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useQuizzesInList } from '@app/composables/study/quizzes-list'
import { PlayEntity } from '@modules/plays'

const props = defineProps<{
	play: PlayEntity
}>()

const { id } = useAuth()

const { quizzes } = useQuizzesInList(
	computed(() => [props.play.quizId]),
	false,
)
const quiz = computed(() => quizzes.value.at(0) ?? null)
</script>
