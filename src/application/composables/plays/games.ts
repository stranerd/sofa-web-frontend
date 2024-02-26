import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { generateHooks } from './plays'
import { GamesUseCases, PlayTypes } from '@modules/plays'

const { useMyPlays: useMyGames, singleStore, usePlay, useCreatePlay: useCreateGame } = generateHooks(PlayTypes.games, GamesUseCases)

export { useCreateGame, useMyGames }

export const useGame = (...args: Parameters<typeof usePlay>) => {
	const id = args[0]
	const plays = usePlay(...args)

	const { id: authId } = useAuth()

	const { asyncFn: join } = useAsyncFn(async (join: boolean) => {
		const p = singleStore[id].play.value
		if (!p) return
		if (join === p.participants.includes(authId.value)) return
		await GamesUseCases.join(id, { join })
	})

	return { ...plays, join }
}
