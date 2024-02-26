import { generateHooks } from './plays'
import { PlayTypes, TestsUseCases } from '@modules/plays'

const { useMyPlays: useMyTests, usePlay: useTest, useCreatePlay: useCreateTest } = generateHooks(PlayTypes.tests, TestsUseCases)

export { useCreateTest, useMyTests, useTest }
