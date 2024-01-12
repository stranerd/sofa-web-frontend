import { modal } from './modal'

import CreateClass from '@/components/organizations/classes/CreateClassModal.vue'
import EditClass from '@/components/organizations/classes/EditClassModal.vue'

export const useOrganizationModal = () =>
	modal.register('Organization', {
		CreateClass: { component: CreateClass },
		EditClass: { component: EditClass },
	})

export const allModals = [useOrganizationModal]

export const allPopovers = [] as typeof allModals
