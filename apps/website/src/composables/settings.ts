import { Logic } from 'sofa-logic'

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