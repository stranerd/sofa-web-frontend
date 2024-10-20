import { modal } from './modal'

import AddTutorConfirmation from '@app/components/conversations/AddTutorConfirmationModal.vue'
import AddTutor from '@app/components/conversations/AddTutorModal.vue'
import ConversationMoreOptions from '@app/components/conversations/ConversationMoreOptionsModal.vue'
import HomeMobileMenu from '@app/components/home/HomeMobileMenu.vue'
import CreateReport from '@app/components/interactions/reports/CreateReportModal.vue'
import CreateReview from '@app/components/interactions/reviews/CreateReviewModal.vue'
import ClassCardMoreOptions from '@app/components/organizations/classes/ClassCardMoreOptionsModal.vue'
import CreateClass from '@app/components/organizations/classes/CreateClassModal.vue'
import EditClass from '@app/components/organizations/classes/EditClassModal.vue'
import CreateLesson from '@app/components/organizations/lessons/CreateLessonModal.vue'
import EditLesson from '@app/components/organizations/lessons/EditLessonModal.vue'
import SelectLesson from '@app/components/organizations/lessons/SelectLessonModal.vue'
import AddMember from '@app/components/organizations/members/AddMemberModal.vue'
import JoinOrganization from '@app/components/organizations/members/JoinOrganizationModal.vue'
import CreateSchedule from '@app/components/organizations/schedules/CreateScheduleModal.vue'
import SelectPaymentMethod from '@app/components/payment/methods/SelectPaymentMethodModal.vue'
import TransactionDetails from '@app/components/payment/transactions/TransactionDetailsModal.vue'
import FundWallet from '@app/components/payment/wallet/FundWalletModal.vue'
import Withdraw from '@app/components/payment/wallet/WithdrawModal.vue'
import AddMaterial from '@app/components/study/AddMaterialModal.vue'
import MaterialMoreOptions from '@app/components/study/MaterialMoreOptionsModal.vue'
import SelectStudyMaterial from '@app/components/study/SelectStudyMaterialModal.vue'
import EditCourse from '@app/components/study/courses/EditCourseModal.vue'
import CreateFile from '@app/components/study/files/CreateFileModal.vue'
import SaveToFolder from '@app/components/study/folders/SaveToFolderModal.vue'
import ChooseStudyMode from '@app/components/study/quizzes/ChooseStudyModeModal.vue'
import EditQuiz from '@app/components/study/quizzes/EditQuizModal.vue'
import ManageAccess from '@app/components/study/quizzes/ManageAccessModal.vue'
import SelectQuiz from '@app/components/study/quizzes/SelectQuizModal.vue'
import CustomizeAi from '@app/components/users/users/CustomizeAiModal.vue'
import DisplayQrCode from '@app/components/users/users/DisplayQrCodeModal.vue'
import SideBar from '@app/components/users/users/SideBarModal.vue'
import ChoosePublishedStudyMaterial from '@app/components/users/verifications/ChoosePublishedStudyMaterialModal.vue'
import NotificationsList from '@app/components/notifications/notifications/NotificationsListModal.vue'
import TutorRequest from '@app/components/users/users/TutorRequestModal.vue'
import Verification from '@app/components/users/users/VerificationModal.vue'

export const useModals = () => ({
	conversations: modal.register('Conversations', {
		addTutor: { component: AddTutor },
		addTutorConfirmation: { component: AddTutorConfirmation },
		conversationMoreOptions: {
			component: ConversationMoreOptions,
			modalArgs: {
				closeOnClickOutside: true,
				maxWidth: '!w-[80%] !md:w-[60%]',
				maxHeight: 'h-full',
				containerClass: 'mr-auto !rounded-none',
			},
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
		createLesson: { component: CreateLesson, modalArgs: { containerClass: 'h-full' } },
		editLesson: { component: EditLesson, modalArgs: { containerClass: 'h-full' } },
		selectLesson: { component: SelectLesson, modalArgs: { containerClass: 'h-full' } },
		createSchedule: { component: CreateSchedule },
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
		editQuiz: { component: EditQuiz },
		editCourse: { component: EditCourse },
	}),
	users: modal.register('Users', {
		customizeAi: { component: CustomizeAi },
		sideBar: {
			component: SideBar,
			modalArgs: {
				closeOnClickOutside: true,
				maxWidth: '!w-[80%] !md:w-[60%]',
				maxHeight: 'h-full',
				containerClass: 'mr-auto !rounded-none',
			},
		},
		mobileMenu: {
			component: HomeMobileMenu,
			modalArgs: {
				closeOnClickOutside: true,
				maxWidth: '!w-[80%] !md:w-[60%]',
				maxHeight: 'h-full',
				containerClass: 'mr-auto !rounded-none',
			},
		},
		choosePublishedStudyMaterial: { component: ChoosePublishedStudyMaterial },
		tutorRequest: { component: TutorRequest },
		verification: { component: Verification },
		displayQrCode: { component: DisplayQrCode, modalArgs: { maxHeight: 'h-[80dvh]', closeOnClickOutside: true } },
	}),
	payment: modal.register('Payment', {
		transactionDetails: { component: TransactionDetails },
		fundWallet: { component: FundWallet },
		withdraw: { component: Withdraw },
		selectPaymentMethod: { component: SelectPaymentMethod },
	}),
	notifications: modal.register('Notifications', {
		notificationList: { component: NotificationsList, modalArgs: { closeOnClickOutside: true } },
	}),
})
