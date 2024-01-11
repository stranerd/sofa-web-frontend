import { MemberEntity, MembersUseCases, MemberTypes } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, reactive, Ref, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'

const store = {} as Record<
	string,
	{
		members: MemberEntity[]
		fetched: Ref<boolean>
		listener: ReturnType<typeof useListener>
	}
>

export const useOrganizationMembers = (id: string) => {
	store[id] ??= {
		members: reactive([]),
		fetched: ref(false),
		listener: useListener(() =>
			MembersUseCases.listenToAllMembers(id, {
				created: (entity) => {
					Logic.addToArray(
						store[id].members,
						entity,
						(q) => q.id,
						(e) => e.id,
					)
				},
				updated: (entity) => {
					Logic.addToArray(
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
	} = useAsyncFn(
		async () => {
			const members = await MembersUseCases.getAllMembers(id)
			members.results.forEach((m) => {
				Logic.addToArray(
					store[id].members,
					m,
					(q) => q.id,
					(e) => e.id,
				)
			})
			store[id].fetched.value = true
		},
		{ key: 'organizations/members/all' },
	)

	onMounted(async () => {
		if (!store[id].fetched.value) await fetchMembers()
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
			.filter((e) => Logic.v.string().email().parse(e).valid)
		if (emails.length === 0) throw 'no valid emails found in list'
		await MembersUseCases.add({ organizationId: id, emails, type })
		await setMessage('Members added')
		addMembersEmails.value = ''
		return true
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
				await Logic.Common.confirm({
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
				return await Logic.Common.confirm({
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
