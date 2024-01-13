import { modal } from './modal'

import ClassCardMoreOptions from '@/components/organizations/classes/ClassCardMoreOptions.vue'
import CreateClass from '@/components/organizations/classes/CreateClassModal.vue'
import EditClass from '@/components/organizations/classes/EditClassModal.vue'
import AddMember from '@/components/organizations/members/AddMemberModal.vue'
import SaveToFolder from '@/components/study/folders/SaveToFolderModal.vue'
import AddMaterialModal from '@/components/study/AddMaterialModal.vue'
import ChooseStudyMode from '@/components/study/quizzes/ChooseStudyModeModal.vue'
import CustomizeAi from '@/components/users/users/CustomizeAiModal.vue'

export const useOrganizationModal = () =>
	modal.register('Organization', {
		addMember: { component: AddMember },
		createClass: { component: CreateClass },
		editClass: { component: EditClass },
		classCardMoreOptions: { component: ClassCardMoreOptions, modalArgs: { popover: true } },
	})

export const useStudyModal = () =>
	modal.register('Study', {
		addMaterial: { component: AddMaterialModal, modalArgs: { closeOnClickOutside: true } },
		saveToFolder: { component: SaveToFolder, modalArgs: { closeOnClickOutside: true } },
		chooseStudyMode: { component: ChooseStudyMode, modalArgs: { closeOnClickOutside: true } },
	})

export const useUserModal = () =>
	modal.register('User', {
		customizeAi: { component: CustomizeAi },
	})
