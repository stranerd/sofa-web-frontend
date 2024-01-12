import { modal, popover } from './modal'

import ClassCardMoreOptions from '@/components/organizations/classes/ClassCardMoreOptions.vue'
import CreateClass from '@/components/organizations/classes/CreateClassModal.vue'
import EditClass from '@/components/organizations/classes/EditClassModal.vue'
import AddMember from '@/components/organizations/members/AddMemberModal.vue'
import CustomizeAi from '@/components/users/users/CustomizeAiModal.vue'

export const useOrganizationModal = () =>
	modal.register('Organization', {
		addMember: { component: AddMember },
		createClass: { component: CreateClass },
		editClass: { component: EditClass },
	})

export const useUserModal = () =>
	modal.register('User', {
		customizeAi: { component: CustomizeAi },
	})

export const useOrganizationPopover = () =>
	popover.register('Organization', {
		classCardMoreOptions: { component: ClassCardMoreOptions },
	})
