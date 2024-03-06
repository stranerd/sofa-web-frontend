import { watch } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useSuccessHandler } from '../core/states'
import { MetaMessageFactory, MetaMessageUseCases } from '@modules/users'

export const useMetaMessage = () => {
	const factory = new MetaMessageFactory()
	const { auth } = useAuth()

	watch(auth, () => auth.value && factory.loadEntity(auth.value))

	const { setMessage } = useSuccessHandler()
	const {
		asyncFn: sendMessage,
		loading,
		error,
	} = useAsyncFn(async () => {
		const result = await MetaMessageUseCases.send(factory)
		if (result) {
			setMessage('Message sent successfully')
		}
		factory.reset()
	})

	return { sendMessage, factory, loading, error }
}
