import { computed, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useUsersInList } from './users'
import { Logic } from 'sofa-logic'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '../core/states'
import { MemberTypes, MembersUseCases } from '@modules/organizations'

export const useMyOrganizations = () => {
	const { user } = useAuth()
	const { users: orgs } = useUsersInList(computed(() => user.value?.account.organizationsIn.map((o) => o.id) ?? []))
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { message, setMessage } = useSuccessHandler()
	const code = ref('')

	const organizations = computed(() => orgs.value.map((u) => ({
		id: u.id,
		name: u.type?.name ?? u.bio.name.full,
		photo: u.bio.photo?.link
	})))

	const requestToJoinOrganization = async (id: string) => {
		if (loading.value || !code.value) return
		setError('')
		setLoading(true)
		try {
			await MembersUseCases.request({ type: MemberTypes.student, organizationId: id, code: code.value })
			await setMessage('Your join request has been sent')
			code.value = ''
		} catch (e) {
			setError(e)
		}
		setLoading(false)
	}

	const leaveOrganization = async (id: string) => {
		const confirmed = await Logic.Common.confirm({
			title: 'Are you sure you want to leave this organization?',
			sub: 'This action is permanent. You will lose access to all current and future resources of this organization.',
			right: { label: 'Yes, leave' }
		})
		if (!confirmed) return
		if (loading.value) return
		setError('')
		setLoading(true)
		try {
			const types = user.value?.account.organizationsIn.filter((o) => o.id === id) ?? []
			await Promise.all(types.map(({ type })=> MembersUseCases.leave({ organizationId: id, type })))
			await setMessage('You have been removed from this organization.')
		} catch (e) {
			setError(e)
		}
		setLoading(false)
	}

	return {
		organizations, error, loading, message, code,
		requestToJoinOrganization, leaveOrganization
	}
}