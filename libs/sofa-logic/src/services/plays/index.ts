import GamesApi from './GamesApi'
import TestApi from './TestApi'

export const PlayApi = {
	game: new GamesApi(),
	test: new TestApi(),
}
