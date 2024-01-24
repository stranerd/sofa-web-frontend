import { MemberTypes, MembersUseCases } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { computed, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useSuccessHandler } from '../core/states'
import { useUsersInList } from './users'

export const useMyOrganizations = () => {
	const { user } = useAuth()
	const { users: orgs } = useUsersInList(computed(() => user.value?.account.organizationsIn.map((o) => o.id) ?? []))
	const { message, setMessage } = useSuccessHandler()
	const code = ref('')

	const organizations = computed(() =>
		orgs.value.map((u) => ({
			id: u.id,
			name: u.publicName,
			photo: u.bio.photo?.link,
		})),
	)

	const { asyncFn: requestToJoinOrganization } = useAsyncFn(async (id: string) => {
		if (!code.value) return false
		await MembersUseCases.request({ type: MemberTypes.student, organizationId: id, code: code.value })
		await setMessage('Your join request has been sent')
		code.value = ''
		return true
	})

	const { asyncFn: leaveOrganization } = useAsyncFn(
		async (id: string) => {
			const types = user.value?.account.organizationsIn.filter((o) => o.id === id) ?? []
			await Promise.all(types.map(({ type }) => MembersUseCases.leave({ organizationId: id, type })))
			await setMessage('You have been removed from this organization.')
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: 'Are you sure you want to leave this organization?',
					sub: 'This action is permanent. You will lose access to all current and future resources of this organization.',
					right: { label: 'Yes, leave' },
				}),
		},
	)

	return {
		organizations,
		message,
		code,
		requestToJoinOrganization,
		leaveOrganization,
	}
}
