import { modal } from './modal'

import AddTutorConfirmation from '@app/components/conversations/AddTutorConfirmationModal.vue'
import AddTutor from '@app/components/conversations/AddTutorModal.vue'
import ConversationMoreOptions from '@app/components/conversations/ConversationMoreOptionsModal.vue'
import CreateReport from '@app/components/interactions/reports/CreateReportModal.vue'
import CreateReview from '@app/components/interactions/reviews/CreateReviewModal.vue'
import CreateAnnouncement from '@app/components/organizations/announcements/CreateAnnouncementModal.vue'
import ClassCardMoreOptions from '@app/components/organizations/classes/ClassCardMoreOptionsModal.vue'
import CreateClass from '@app/components/organizations/classes/CreateClassModal.vue'
import EditClass from '@app/components/organizations/classes/EditClassModal.vue'
import CreateLesson from '@app/components/organizations/lessons/CreateLessonModal.vue'
import LessonDetails from '@app/components/organizations/lessons/LessonDetailsModal.vue'
import PreviewCurriculum from '@app/components/organizations/lessons/PreviewCurriculumModal.vue'
import ViewCuriculum from '@app/components/organizations/lessons/ViewCurriculumModal.vue'
import AddMember from '@app/components/organizations/members/AddMemberModal.vue'
import JoinOrganization from '@app/components/organizations/members/JoinOrganizationModal.vue'
import CreateSchedule from '@app/components/organizations/schedules/CreateScheduleModal.vue'
import FundWallet from '@app/components/payment/wallet/FundWalletModal.vue'
import TransactionDetails from '@app/components/payment/transactions/TransactionDetailsModal.vue'
import Withdraw from '@app/components/payment/wallet/WithdrawModal.vue'
import AddMaterial from '@app/components/study/AddMaterialModal.vue'
import MaterialMoreOptions from '@app/components/study/MaterialMoreOptionsModal.vue'
import SelectStudyMaterial from '@app/components/study/SelectStudyMaterialModal.vue'
import CreateFile from '@app/components/study/files/CreateFileModal.vue'
import SaveToFolder from '@app/components/study/folders/SaveToFolderModal.vue'
import ChooseStudyMode from '@app/components/study/quizzes/ChooseStudyModeModal.vue'
import ManageAccess from '@app/components/study/quizzes/ManageAccessModal.vue'
import SelectQuiz from '@app/components/study/quizzes/SelectQuizModal.vue'
import CustomizeAi from '@app/components/users/users/CustomizeAiModal.vue'
import SideBar from '@app/components/users/users/SideBarModal.vue'

export const useModals = () => ({
	conversations: modal.register('Conversations', {
		addTutor: { component: AddTutor },
		addTutorConfirmation: { component: AddTutorConfirmation },
		conversationMoreOptions: {
			component: ConversationMoreOptions,
			modalArgs: { closeOnClickOutside: true, maxWidth: '!w-[80%] !md:w-[60%] mr-auto h-full overflow-y-auto !rounded-none' },
		},
	}),
	interactions: modal.register('Interactions', {
		createReport: { component: CreateReport, modalArgs: { closeOnClickOutside: true } },
		createReview: { component: CreateReview, modalArgs: { closeOnClickOutside: true } },
	}),
	organizations: modal.register('Organizations', {
		addMember: { component: AddMember },
		createClass: { component: CreateClass },
		editClass: { component: EditClass },
		joinOrganization: { component: JoinOrganization },
		classCardMoreOptions: { component: ClassCardMoreOptions, modalArgs: { popover: true } },
		createLesson: { component: CreateLesson },
		lessonDetails: { component: LessonDetails },
		createAnnouncement: { component: CreateAnnouncement },
		createSchedule: { component: CreateSchedule },
		previewCurriculum: { component: PreviewCurriculum },
		viewCurriculum: { component: ViewCuriculum, modalArgs: { containerClass: 'h-full overflow-y-auto' } },
	}),
	study: modal.register('Study', {
		addMaterial: { component: AddMaterial, modalArgs: { closeOnClickOutside: true } },
		chooseStudyMode: { component: ChooseStudyMode, modalArgs: { closeOnClickOutside: true } },
		materialMoreOptions: { component: MaterialMoreOptions, modalArgs: { popover: true } },
		manageAccess: { component: ManageAccess },
		saveToFolder: { component: SaveToFolder, modalArgs: { closeOnClickOutside: true } },
		selectStudyMaterial: { component: SelectStudyMaterial, modalArgs: { closeOnClickOutside: true } },
		createFile: { component: CreateFile },
		selectQuiz: { component: SelectQuiz },
	}),
	users: modal.register('Users', {
		customizeAi: { component: CustomizeAi },
		sideBar: {
			component: SideBar,
			modalArgs: { closeOnClickOutside: true, maxWidth: '!w-[80%] !md:w-[60%] mr-auto h-full overflow-y-auto !rounded-none' },
		},
	}),
	payment: modal.register('Payment', {
		transactionDetails: { component: TransactionDetails },
		fundWallet: { component: FundWallet },
		withdraw: { component: Withdraw },
	}),
})
