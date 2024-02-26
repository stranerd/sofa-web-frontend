import { generateHooks } from './plays'
import { PlayTypes, TestsUseCases } from '@modules/plays'

const { useMyPlays: useMyTests, usePlay: useTest } = generateHooks(PlayTypes.tests, TestsUseCases)

export { useMyTests, useTest }
