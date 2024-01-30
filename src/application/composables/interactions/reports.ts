import { useAsyncFn } from '../core/hooks'
import { useSuccessHandler } from '@app/composables/core/states'
import { Interaction, ReportFactory, ReportsUseCases } from '@modules/interactions'

export const useCreateReport = (interaction: Interaction) => {
	const factory = new ReportFactory()
	const { message, setMessage } = useSuccessHandler()

	const {
		asyncFn: createReport,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ReportsUseCases.add(interaction, factory)
		factory.reset()
		await setMessage('Reported successfully')
		return true
	})

	return { factory, error, message, loading, createReport }
}
