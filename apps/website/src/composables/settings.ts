import { Logic } from 'sofa-logic'

export const libraryOptions = [
  {
    title: 'In progress',
    icon: 'in-progress',
    id: 'in-progress',
    routePath: '/libraries/in-progress',
    options: [
      {
        name: 'All',
        active: true,
        id: 'in_progress-all',
      },
      {
        name: 'Tests',
        active: false,
        id: 'in_progress-tests',
      },
      {
        name: 'Games',
        active: false,
        id: 'in_progress-games',
      },
    ],
  },
  {
    title: 'Quizzes',
    id: 'quizzes',
    icon: 'quiz',
    routePath: '/libraries/quizzes',
    options: [
      {
        name: 'Recent',
        active: true,
        id: 'quiz-recent',
      },
      {
        name: 'Saved',
        active: false,
        id: 'quiz-saved',
      },
      {
        name: 'Published',
        active: false,
        id: 'quiz-published',
      },
      {
        name: 'Draft',
        active: false,
        id: 'quiz-draft',
      },
    ],
  },
  {
    title: 'Courses',
    icon: 'course-list',
    id: 'courses',
    routePath: '/libraries/courses',
    options: [
      {
        name: 'Recent',
        active: true,
        id: 'course-recent',
      },
      {
        name: 'Saved',
        active: false,
        id: 'course-saved',
      },
      {
        name: 'Published',
        active: false,
        id: 'course-published',
      },
      {
        name: 'Draft',
        active: false,
        id: 'course-draft',
      },
    ],
  },
  {
    title: 'Purchased',
    icon: 'purchased',
    id: 'purchased',
    routePath: '/libraries/purchased',
    options: [],
  },
  {
    title: 'Results',
    icon: 'results',
    id: 'results',
    routePath: '/libraries/results',
    options: [
      {
        name: 'All',
        active: true,
        id: 'results-all',
      },
      {
        name: 'Tests',
        active: false,
        id: 'results-tests',
      },
      {
        name: 'Games',
        active: false,
        id: 'results-games',
      },
    ],
  },
]

export const settingOptions = [
	{
		title: "Account",
		subPages: [
			{
				title: "Profile",
				to: "/settings/profile",
				show: () => true,
			},
			{
				title: "Students",
				to: "/settings/students",
				show: () => Logic.Users.UserProfile?.type?.type == "organization"
			},
			{
				title: "Organizations",
				to: "/settings/organizations",
				show: () => Logic.Users.UserProfile?.type?.type == "student"
			},
			{
				title: "Verification",
				to: "/verification",
				show: () => !Logic.Users.UserProfile.roles.isVerified,
			},
			{
				title: "Tutor Application",
				to: "/verification/tutor",
				show: () => Logic.Users.UserProfile?.type.type == "teacher",
			},
		],
	},
	{
		title: "Billing",
		subPages: [
			{
				title: "Wallet",
				to: "/settings/wallet",
				show: () => true,
			},
			{
				title: "Subscription",
				to: "/settings/subscription",
				show: () => true,
			},
		],
	},
	{
		title: "Preferences",
		subPages: [
			{
				title: "Notifications",
				to: "/settings/notifications",
				show: () => true,
			},
			{
				title: "Security",
				to: "/settings/security",
				show: () => true,
			},
		],
	},
	{
		title: "Support",
		subPages: [
			{
				title: "Contact us",
				to: "/settings/contact_us",
				show: () => true,
			},
		],
	},
]