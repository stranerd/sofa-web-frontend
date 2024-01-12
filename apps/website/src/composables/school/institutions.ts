import { useSuccessHandler } from '@/composables/core/states'
import { InstitutionEntity, InstitutionFactory, InstitutionsUseCases } from '@modules/school'
import { addToArray } from '@utils/commons'
import { Logic } from 'sofa-logic'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'

const store = {
	fetched: ref(false),
	institutions: ref([] as InstitutionEntity[]),
}

const {
	asyncFn: fetchInstitutions,
	loading,
	error,
} = useAsyncFn(
	async () => {
		const institutions = await InstitutionsUseCases.get()
		institutions.results.forEach((i) =>
			addToArray(
				store.institutions.value,
				i,
				(e) => e.id,
				(e) => e.title,
				true,
			),
		)
		store.fetched.value = true
	},
	{ key: 'school/institutions/all' },
)

export const useInstitutionList = (skipHooks = false) => {
	const schools = computed(() => store.institutions.value.filter((i) => !i.isGateway))
	const gatewayExams = computed(() => store.institutions.value.filter((i) => i.isGateway))
	onMounted(async () => {
		if (skipHooks) return
		if (!store.fetched.value) await fetchInstitutions()
	})
	return { ...store, loading, error, schools, gatewayExams }
}

export const useInstitution = (id: string) => {
	const institution = computed({
		get: () => store.institutions.value.find((s) => s.id === id) ?? null,
		set: (i) => {
			if (i)
				addToArray(
					store.institutions.value,
					i,
					(e) => e.id,
					(e) => e.title,
					true,
				)
		},
	})
	onMounted(async () => {
		if (!store.fetched.value) await fetchInstitutions()
	})

	return { institution }
}

export const useCreateInstitution = () => {
	const router = useRouter()
	const factory = new InstitutionFactory()
	const { setMessage } = useSuccessHandler()

	const {
		asyncFn: createInstitution,
		loading,
		error,
	} = useAsyncFn(async () => {
		const institution = await InstitutionsUseCases.add(factory)
		addToArray(
			store.institutions.value,
			institution,
			(e) => e.id,
			(e) => e.title,
			true,
		)
		factory.reset()
		await setMessage('Institution created successfully')
		await router.push(`/admin/school/institutions/${institution.id}`)
	})

	return { factory, loading, error, createInstitution }
}

let editingInstitution = null as InstitutionEntity | null
export const openInstitutionEditModal = async (institution: InstitutionEntity) => {
	editingInstitution = institution
}

export const useEditInstitution = () => {
	const router = useRouter()
	const factory = new InstitutionFactory()
	const { setMessage } = useSuccessHandler()
	if (editingInstitution) factory.loadEntity(editingInstitution)

	const {
		asyncFn: editInstitution,
		loading,
		error,
	} = useAsyncFn(async () => {
		const updatedInstitution = await InstitutionsUseCases.update(editingInstitution!.id, factory)
		addToArray(
			store.institutions.value,
			updatedInstitution,
			(e) => e.id,
			(e) => e.title,
			true,
		)
		factory.reset()
		await setMessage('Institution updated successfully')
		await router.push(`/admin/school/institutions/${updatedInstitution.id}`)
	})

	return { factory, loading, error, editInstitution }
}

export const useDeleteInstitution = (institutionId: string) => {
	const { setMessage } = useSuccessHandler()

	const {
		asyncFn: deleteInstitution,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			await InstitutionsUseCases.delete(institutionId)
			store.institutions.value = store.institutions.value.filter((s) => s.id !== institutionId)
			await setMessage('Institution deleted successfully')
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: 'Are you sure you want to delete this institution?',
					sub: '',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	return { loading, error, deleteInstitution }
}
