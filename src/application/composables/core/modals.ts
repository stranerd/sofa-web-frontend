import { modal } from './modal'

import AddTutor from '@app/components/conversations/AddTutorModal.vue'
import ClassCardMoreOptions from '@app/components/organizations/classes/ClassCardMoreOptionsModal.vue'
import CreateClass from '@app/components/organizations/classes/CreateClassModal.vue'
import EditClass from '@app/components/organizations/classes/EditClassModal.vue'
import AddMember from '@app/components/organizations/members/AddMemberModal.vue'
import JoinOrganization from '@app/components/organizations/members/JoinOrganizationModal.vue'
import AddMaterial from '@app/components/study/AddMaterialModal.vue'
import MaterialMoreOptions from '@app/components/study/MaterialMoreOptionsModal.vue'
import SaveToFolder from '@app/components/study/folders/SaveToFolderModal.vue'
import ChooseStudyMode from '@app/components/study/quizzes/ChooseStudyModeModal.vue'
import ManageAccess from '@app/components/study/quizzes/ManageAccessModal.vue'
import CustomizeAi from '@app/components/users/users/CustomizeAiModal.vue'

export const useConversationModal = () =>
	modal.register('Conversation', {
		addTutor: { component: AddTutor },
	})

export const useOrganizationModal = () =>
	modal.register('Organization', {
		addMember: { component: AddMember },
		createClass: { component: CreateClass },
		editClass: { component: EditClass },
		joinOrganization: { component: JoinOrganization },
		classCardMoreOptions: { component: ClassCardMoreOptions, modalArgs: { popover: true } },
	})

export const useStudyModal = () =>
	modal.register('Study', {
		addMaterial: { component: AddMaterial, modalArgs: { closeOnClickOutside: true } },
		chooseStudyMode: { component: ChooseStudyMode, modalArgs: { closeOnClickOutside: true } },
		materialMoreOptions: { component: MaterialMoreOptions, modalArgs: { popover: true } },
		manageAccess: { component: ManageAccess },
		saveToFolder: { component: SaveToFolder, modalArgs: { closeOnClickOutside: true } },
	})

export const useUserModal = () =>
	modal.register('User', {
		customizeAi: { component: CustomizeAi },
	})
