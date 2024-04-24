<template>
	<ExpandedLayout v-if="!index && !$screen.desktop" :hide="{ top: true, bottom: true }">
		<div class="w-full flex items-center gap-3 justify-between bg-lightGray text-bodyBlack p-4">
			<SofaIcon class="h-[15px]" name="back-arrow" @click="$utils.goBack()" />
			<SofaHeading :content="title" />
			<span class="w-4" />
		</div>

		<div class="w-full flex flex-col gap-3 px-4 flex-1 overflow-y-auto">
			<slot />
		</div>
	</ExpandedLayout>
	<FullLayout v-else :topbarOptions="{ title }" :hide="{ right: true }">
		<template #left-session>
			<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col p-4 gap-4">
				<div v-if="user" class="w-full flex items-center gap-3">
					<SofaAvatar :size="84" :photoUrl="user.bio.photo?.link" />

					<div class="flex flex-col">
						<div class="flex items-center gap-1">
							<SofaHeading :content="user.publicName" />
							<SofaIcon v-if="user.roles.isVerified" name="verify" class="h-[13px]" />
							<SofaIcon v-if="userType.isTeacher" name="tutor-bagde" class="h-[13px]" />
						</div>
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
								<div class="flex items-center gap-2">
									<SofaText class="text-grayColor" size="sub" :content="classInst.user.bio.publicName" />
									<SofaIcon v-if="classInst.user.roles.isVerified" name="verify" class="h-[16px]" />
									<SofaIcon v-if="classInst.user.type?.type === UserType.teacher" name="tutor-bagde" class="h-[18px]" />
								</div>
							</div>
						</router-link>
					</div>
				</template>
			</div>
		</template>

		<template #middle-session>
			<div class="flex flex-col gap-4 h-full overflow-y-auto mdlg:mr-4">
				<slot />
			</div>
		</template>
	</FullLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMeta } from 'vue-meta'
import { useAuth } from '@app/composables/auth/auth'
import { useOrganizationClasses } from '@app/composables/organizations/classes'
import { useMyClassesIn } from '@app/composables/organizations/classes-explore'
import { UserType } from '@modules/users'

const props = withDefaults(
	defineProps<{
		title: string
		index?: boolean
	}>(),
	{
		index: false,
	},
)

useMeta(
	computed(() => ({
		title: props.title,
	})),
)

const { id, user, userType } = useAuth()

const { classes: myClassesIn } = useMyClassesIn()
const { classes: orgClasses } = useOrganizationClasses(id.value)

const classes = computed(() => (userType.value.isOrg ? orgClasses.value : myClassesIn.value))

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
</script>
