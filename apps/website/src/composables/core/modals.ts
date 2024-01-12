import { modal, popover } from './modal'

import CreateClass from '@/components/organizations/classes/CreateClassModal.vue'
import EditClass from '@/components/organizations/classes/EditClassModal.vue'
import ClassCardMoreOptions from '@/components/organizations/classes/ClassCardMoreOptions.vue'

export const useOrganizationModal = () =>
	modal.register('Organization', {
		createClass: { component: CreateClass },
		editClass: { component: EditClass },
	})

export const useOrganizationPopover = () =>
	popover.register('Organization', {
		classCardMoreOptions: { component: ClassCardMoreOptions },
	})

export const allModals = [useOrganizationModal]
export const allPopovers = [useOrganizationPopover]
