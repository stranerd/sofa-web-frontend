<template>
	<ExpandedLayout v-if="!$screen.desktop" :hide="{ top: true }">
		<div class="w-full flex items-center gap-3 justify-between p-4" :class="{ 'bg-white': light }">
			<SofaIcon class="h-[15px]" name="back-arrow" @click="$utils.goBack()" />
			<SofaHeading :content="title" />
			<span class="w-4" />
		</div>

		<div class="w-full flex flex-col flex-1 overflow-y-auto">
			<slot :extras="extras" />
		</div>
	</ExpandedLayout>
	<FullLayout v-else :topbarOptions="{ title }" :hide="{ right: true }">
		<template #left-session>
			<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col p-4 gap-4">
				<div v-if="user" class="w-full flex items-center gap-3">
					<SofaAvatar :size="84" :photoUrl="user.bio.photo?.link" />

					<div class="flex flex-col">
						<UserName :user="user" :avatar="false" class="font-bold" />
						<SofaText class="capitalize text-grayColor" :content="userType.type" />
						<SofaText class="text-primaryPink" as="router-link" to="/profile" content="View Profile" />
					</div>
				</div>

				<div v-if="user && userType.isStudent" class="w-full grid grid-cols-2 gap-3">
					<div class="p-3 rounded-custom bg-lightGray text-bodyBlack col-span-1 flex gap-3 justify-start items-center">
						<SofaIcon class="h-[40px]" name="xp-points" />
						<div class="flex flex-col items-start justify-center">
							<SofaHeading> {{ $utils.formatNumber(user.account.rankings.overall.value, 2) }} xp </SofaHeading>
							<SofaText content="Point" />
						</div>
					</div>
					<div class="p-3 rounded-custom bg-lightGray text-bodyBlack col-span-1 flex gap-3 justify-start items-center">
						<SofaIcon class="h-[40px]" name="streak-new" />
						<div class="flex flex-col items-start justify-center">
							<SofaHeading>
								{{ user.account.streak.count }} {{ $utils.pluralize(user.account.streak.count, 'day', 'days') }}
							</SofaHeading>
							<SofaText content="Streak" />
						</div>
					</div>
				</div>

				<template v-else>
					<div class="h-[1px] w-full bg-lightGray" />

					<div class="w-full flex flex-col">
						<router-link
							v-for="item in options"
							:key="item.route"
							class="w-full flex items-center gap-3 p-3 rounded-lg text-deepGray hover:bg-lightBlue"
							:to="item.route"
							exactActiveClass="bg-lightBlue font-bold">
							<SofaIcon :name="item.icon" class="h-[17px] fill-current" />
							<SofaText :content="item.title" />
						</router-link>
					</div>
				</template>

				<template v-if="classes.length">
					<div class="h-[1px] w-full bg-lightGray" />

					<div class="w-full flex flex-col">
						<SofaText content="Classes" class="text-grayColor mb-2" />
						<router-link
							v-for="classInst in classes"
							:key="classInst.hash"
							class="w-full flex items-center gap-3 p-3 rounded-lg text-deepGray hover:bg-lightBlue"
							:to="classInst.pageLink"
							activeClass="bg-lightBlue font-bold">
							<SofaAvatar :size="44" :photoUrl="classInst.picture" />
							<div class="flex flex-col truncate grow">
								<SofaText :content="classInst.title" clamp />
								<UserName :user="classInst.user" :avatar="false" size="sub" class="text-grayColor" />
							</div>
						</router-link>
					</div>
				</template>
			</div>
		</template>

		<template #middle-session>
			<div class="flex flex-col h-full overflow-y-auto mdlg:mr-4">
				<slot name="pre-crumbs" />
				<div
					v-if="$screen.desktop && breadcrumbs"
					class="bg-white text-bodyBlack py-3 px-6 rounded-t-2xl border-b border-lightGray flex items-center gap-4"
					:class="{ 'rounded-b-2xl': rounded }">
					<SofaIcon v-if="!index" class="h-[15px]" name="back-arrow" @click="$utils.goBack()" />
					<div class="flex items-center gap-1 shrink-0">
						<template v-for="(breadcrumb, i) in breadcrumbs" :key="i">
							<SofaText
								as="router-link"
								:to="breadcrumb.to"
								:content="breadcrumb.text"
								:class="i === breadcrumbs.length - 1 ? 'text-deepGray' : 'text-grayColor'" />
							{{ i !== breadcrumbs.length - 1 ? '/' : '' }}
						</template>
					</div>
					<SofaInput v-model="searchQuery" placeholder="Search" type="search" class="max-w-[300px] ml-auto" padding="p-3">
						<template #prefix>
							<SofaIcon name="search" class="h-[16px]" />
						</template>
					</SofaInput>
					<SofaButton
						v-if="primary"
						bgColor="bg-primaryBlue"
						padding="py-3 px-6"
						textColor="text-white"
						class="border border-primaryBlue"
						@click="primary.action()">
						{{ primary.label }}
					</SofaButton>
				</div>
				<slot :extras="extras" />
			</div>
		</template>
	</FullLayout>
</template>

<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useAuth } from '@app/composables/auth/auth'
import { useMyClasses } from '@app/composables/organizations/classes-explore'

type ButtonConfig = {
	action: () => void
	label: string
}

const props = withDefaults(
	defineProps<{
		title: string
		index?: boolean
		rounded?: boolean
		breadcrumbs?: { text: string; to: string }[]
		filter?: (query: string) => T[]
		primary?: ButtonConfig
		light?: boolean
	}>(),
	{
		index: false,
		rounded: false,
		primary: undefined,
		filter: undefined,
		breadcrumbs: undefined,
		light: false,
	},
)

useMeta(
	computed(() => ({
		title: props.title,
	})),
)

const { user, userType } = useAuth()
const { classes } = useMyClasses()

const options = computed(() => [
	{ title: 'Dashboard', icon: 'dashboard' as const, route: '/dashboard' },
	...(userType.value.isOrg
		? [
				{ title: 'Classes', icon: 'classes' as const, route: '/dashboard/classes' },
				{ title: 'Teachers', icon: 'tutor' as const, route: '/dashboard/teachers' },
				{ title: 'Students', icon: 'user-unfilled' as const, route: '/dashboard/students' },
			]
		: []),
	...(userType.value.isTeacher ? [{ title: 'Classes', icon: 'classes' as const, route: '/classes' }] : []),
])

const searchQuery = ref('')

const extras = computed(() => ({
	get searchQuery() {
		return searchQuery.value
	},
	set searchQuery(value: string) {
		searchQuery.value = value
	},
	filteredItems: props.filter?.(searchQuery.value) ?? [],
}))
</script>
