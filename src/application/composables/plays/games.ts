import { computed } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useUsersInList } from '../users/users'
import { generateHooks } from './plays'
import { GamesUseCases, PlayTypes } from '@modules/plays'

const { useMyPlays: useMyGames, singleStore, usePlay, useCreatePlay: useCreateGame } = generateHooks(PlayTypes.games, GamesUseCases)

export { useCreateGame, useMyGames }

export const useGame = (id: string, skip: Parameters<typeof usePlay>[1] & { participants: boolean }) => {
	const plays = usePlay(id, skip)

	const { id: authId } = useAuth()

	const { users: participants } = useUsersInList(
		computed(() => (skip.participants ? [] : singleStore[id].play.value?.participants ?? [])),
	)

	const { asyncFn: join } = useAsyncFn(async (join: boolean) => {
		const p = singleStore[id].play.value
		if (!p) return
		if (join === p.participants.includes(authId.value)) return
		await GamesUseCases.join(id, { join })
	})

	return { ...plays, participants, join }
}
