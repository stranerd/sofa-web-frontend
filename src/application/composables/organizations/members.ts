import { addToArray, v } from 'valleyed'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { createStore } from '../core/store'
import { MemberEntity, MembersUseCases, MemberTypes } from '@modules/organizations'

const store = createStore(
	<
		Record<
			string,
			{
				members: MemberEntity[]
				listener: ReturnType<typeof useListener>
			}
		>
	>{},
	'organizations/members',
)

export const useOrganizationMembers = (id: string) => {
	store[id] ??= {
		members: reactive([]),
		listener: useListener(() =>
			MembersUseCases.listenToAll(id, {
				created: (entity) => {
					addToArray(
						store[id].members,
						entity,
						(q) => q.id,
						(e) => e.id,
					)
				},
				updated: (entity) => {
					addToArray(
						store[id].members,
						entity,
						(q) => q.id,
						(e) => e.id,
					)
				},
				deleted: (entity) => {
					const index = store[id].members.findIndex((q) => q.id === entity.id)
					if (index !== -1) store[id].members.splice(index, 1)
				},
			}),
		),
	}

	const {
		asyncFn: fetchMembers,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const members = await MembersUseCases.getAll(id)
			members.results.forEach((m) => {
				addToArray(
					store[id].members,
					m,
					(q) => q.id,
					(e) => e.id,
				)
			})
		},
		{ key: 'organizations/members/all' },
	)

	onMounted(async () => {
		if (!called.value) await fetchMembers()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	const teachers = computed(() => store[id].members.filter((m) => m.type === MemberTypes.teacher))
	const students = computed(() => store[id].members.filter((m) => m.type === MemberTypes.student))

	return { ...store[id], loading, error, teachers, students }
}

export const useManageOrganizationMembers = (id: string) => {
	const { message, setMessage } = useSuccessHandler()

	const addMembersEmails = ref('')

	const {
		asyncFn: addMembers,
		loading: addMembersLoading,
		error: addMembersError,
	} = useAsyncFn(async (type: MemberTypes) => {
		const emails = addMembersEmails.value
			.split(',')
			.map((e) => e.trim())
			.filter((e) => v.string().email().parse(e).valid)
		if (emails.length === 0) throw 'no valid emails found in list'
		await MembersUseCases.add({ organizationId: id, emails, type })
		await setMessage('Members added')
		addMembersEmails.value = ''
		useModals().organizations.addMember.close()
	})

	const {
		asyncFn: removeMember,
		loading: removeMemberLoading,
		error: removeMemberError,
	} = useAsyncFn(
		async (member: MemberEntity) => {
			await MembersUseCases.remove({ organizationId: id, email: member.email, type: member.type })
			await setMessage('Member removed')
			return true
		},
		{
			pre: async () =>
				await $utils.confirm({
					title: 'Are you sure you want to remove this member?',
					sub: '',
					right: { label: 'Yes, remove' },
				}),
		},
	)

	const {
		asyncFn: acceptMember,
		loading: acceptMemberLoading,
		error: acceptMemberError,
	} = useAsyncFn(
		async (member: MemberEntity, accept: boolean) => {
			const key = accept ? 'accept' : 'reject'
			await MembersUseCases.accept({ organizationId: id, email: member.email, type: member.type, accept })
			await setMessage(`Member ${key}ed`)
			return true
		},
		{
			pre: async (_, accept) => {
				const key = accept ? 'accept' : 'reject'
				return await $utils.confirm({
					title: `Are you sure you want to ${key} this member?`,
					sub: '',
					right: { label: `Yes, ${key}` },
				})
			},
		},
	)

	return {
		message,
		addMembersEmails,
		addMembers,
		addMembersLoading,
		addMembersError,
		removeMember,
		removeMemberLoading,
		removeMemberError,
		acceptMember,
		acceptMemberLoading,
		acceptMemberError,
	}
}
