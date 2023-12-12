<template>
	<sub-page-layout v-if="!index && !Logic.Common.isLarge">
		<div class="w-full h-full flex-1 flex flex-col justify-start relative">
			<div class="w-full flex items-center gap-3 justify-between bg-backgroundGray p-4">
				<SofaIcon class="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
				<SofaNormalText class="!font-bold !text-base" :content="title" />
				<span class="w-4" />
			</div>

			<div class="w-full flex flex-col gap-3 px-4 h-full overflow-y-auto">
				<slot :user="user!" />
			</div>
		</div>
	</sub-page-layout>
	<dashboard-layout v-else :topbarOptions="{ title }">
		<template v-slot:left-session>
			<div class="w-full shadow-custom bg-white rounded-2xl flex flex-col p-4 gap-4">
				<div class="w-full flex items-center gap-3">
					<SofaAvatar size="84" :photoUrl="user.bio.photo?.link" />

					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-1">
							<SofaHeaderText class="!text-base !font-bold"
								:content="user.type?.name ?? user.bio.name.full" />
							<SofaIcon v-if="user.roles.isVerified" name="verify" class="h-[13px]" />
							<SofaIcon v-if="user.type?.type === 'teacher'" name="tutor-bagde" class="h-[13px]" />
						</div>
						<SofaNormalText class="capitalize" color="text-grayColor" :content="user.type?.type ?? 'student'" />
						<SofaNormalText color="text-primaryPink" as="router-link" to="/profile" content="View Profile" />
					</div>
				</div>

				<div class="h-[1px] w-full bg-lightGrayVaraint" />

				<div class="w-full flex flex-col gap-1">
					<router-link
						class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-deepGray hover:bg-lightBlue"
						v-for="item in options" :key="item.route" :to="item.route"
						exact-active-class="bg-lightBlue !font-bold">
						<SofaIcon :name="item.icon" class="h-[17px] fill-current" />
						<SofaNormalText color="text-inherit" :content="item.title" />
					</router-link>
				</div>
			</div>
		</template>

		<template v-slot:middle-session>
			<div v-if="index" class="w-full flex flex-col gap-4 px-4 mdlg:!hidden">
				<div class="bg-white flex flex-col shadow-custom rounded-custom">
					<router-link :to="item.route"
						class="w-full flex items-center gap-3 p-4 border-b border-lightGrayVaraint" v-for="item in options"
						:key="item.route">
						<SofaIcon :name="item.icon" class="h-[16px] fill-current" />
						<SofaNormalText color="text-inherit" :content="item.title" />
					</router-link>
				</div>
			</div>
			<div class="flex flex-col gap-4 h-full overflow-y-auto">
				<slot :user="user!" />
			</div>
		</template>

		<template v-slot:right-session>
			<div class="w-full shadow-custom bg-white rounded-2xl flex flex-col gap-4 p-6">
				<SofaHeaderText class="!text-lg !font-bold" content="Start something" />

				<div class="grid grid-cols-2 gap-y-2 gap-x-4">
					<SofaBadge v-for="command in rightCommands" :key="command.label" color="gray" :isInverted="true" as="a"
						class="!py-3 !px-4 truncate" @click="command.action">
						{{ command.label }}
					</SofaBadge>
				</div>
			</div>
		</template>
	</dashboard-layout>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/auth/auth'
import { Logic } from "sofa-logic"
import { SofaAvatar, SofaBadge, SofaHeaderText, SofaIcon, SofaNormalText } from "sofa-ui-components"
import { computed, defineProps } from 'vue'
import { useMeta } from "vue-meta"

const { user } = useAuth()

const options = [
	{ title: 'Dashboard', icon: 'dashboard', route: '/organization/dashboard' },
	{ title: 'Classes', icon: 'classes', route: '/organization/classes' },
	{ title: 'Teachers', icon: 'tutor', route: '/organization/teachers' },
	{ title: 'Students', icon: 'user-unfilled', route: '/organization/students' },
]

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	index: {
		type: Boolean,
		required: false,
		default: false
	}
})

useMeta(computed(() => ({
	title: props.title
})))

const rightCommands = [
	{ label: 'Add a student', action: () => null },
	{ label: 'Add a teacher', action: () => null },
	{ label: 'Create a quiz', action: () => null },
	{ label: 'Create a course', action: () => null },
	{ label: 'Create a class', action: () => null },
]
</script>
