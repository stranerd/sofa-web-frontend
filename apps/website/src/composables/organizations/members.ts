import { MemberEntity, MembersUseCases, MemberTypes } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, reactive, Ref, ref } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '../core/states'

const store = {} as Record<string, {
	members: MemberEntity[]
	fetched: Ref<boolean>
	listener: ReturnType<typeof useListener>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useOrganizationMembers = (id: string) => {
	store[id] ??= {
		members: reactive([]),
		fetched: ref(false),
		listener: useListener(() => MembersUseCases.listenToAllMembers(id, {
			created: (entity) => {
				Logic.addToArray(store[id].members, entity, (q) => q.id, (e) => e.id)
			},
			updated: (entity) => {
				Logic.addToArray(store[id].members, entity, (q) => q.id, (e) => e.id)
			},
			deleted: (entity) => {
				const index = store[id].members.findIndex((q) => q.id === entity.id)
				if (index !== -1) store[id].members.splice(index, 1)
			}
		})),
		...useErrorHandler(),
		...useLoadingHandler()
	}

	const fetchMembers = async () => {
		await store[id].setError('')
		try {
			await store[id].setLoading(true)
			const members = await MembersUseCases.getAllMembers(id)
			members.results.forEach((m) => {
				Logic.addToArray(store[id].members, m, (q) => q.id, (e) => e.id)
			})
			store[id].fetched.value = true
		} catch (e) {
			await store[id].setError(e)
		}
		await store[id].setLoading(false)
	}

	onMounted(async () => {
		if (!store[id].fetched.value && !store[id].loading.value) await fetchMembers()
		await store[id].listener.start()
	})
	onUnmounted(async () => {
		await store[id].listener.close()
	})

	const teachers = computed(() => store[id].members.filter((m) => m.type === MemberTypes.teacher))
	const students = computed(() => store[id].members.filter((m) => m.type === MemberTypes.student))

	return { ...store[id], teachers, students }
}

export const useManageOrganizationMembers = (id: string) => {
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { message, setMessage } = useSuccessHandler()

	const addMembersEmails = ref('')

	const addMembers = async (type: MemberTypes) => {
		let succeeded = false
		const emails = addMembersEmails.value.split(',')
			.map((e) => e.trim())
			.filter((e) => Logic.v.string().email().parse(e).valid)
		if (emails.length === 0) {
			await setError('no valid emails found in list')
			return succeeded
		}
		await setError('')
		try {
			await setLoading(true)
			await MembersUseCases.add({ organizationId: id, emails, type })
			await setMessage('Members added')
			addMembersEmails.value = ''
			succeeded = true
		} catch (e) {
			await setError(e)
		}
		await setLoading(false)
		return succeeded
	}

	const removeMember = async (member: MemberEntity) => {
		console.log(member)
	}

	const acceptMember = async (member: MemberEntity, accept: boolean) => {
		console.log(member, accept)
	}

	return {
		error,
		loading,
		message,
		addMembersEmails,
		addMembers,
		removeMember, acceptMember
	}
}