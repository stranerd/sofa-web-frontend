<template>
	<ExpandedLayout v-if="user" width="mdlg:!w-[85%] lg:!w-[75%]" layoutStyle="mdlg:pt-6">
		<div class="w-full flex mdlg:hidden items-center gap-3 justify-between bg-white p-4">
			<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
			<SofaHeading :content="user.publicName" />
			<div />
		</div>

		<div class="w-full flex flex-col bg-primaryPurple mdlg:shadow-custom mdlg:rounded-2xl pt-[140px]">
			<div class="w-full flex flex-col px-4 pt-4 gap-6 bg-white mdlg:rounded-b-2xl">
				<div class="w-full flex mdlg:flex-row flex-col justify-between items-start mdlg:gap-0 gap-4">
					<div class="flex gap-3 items-start">
						<SofaAvatar :photoUrl="user.bio.photo?.link" :size="110" class="-mt-[71px]" />

						<div class="flex flex-col">
							<UserName :user="user" :avatar="false" name size="title" bold />
							<SofaText class="capitalize" :content="user.userType.type" />
						</div>
					</div>

					<div
						class="flex mdlg:flex-row flex-col mdlg:gap-4 mdlg:justify-end items-start gap-3 mdlg:items-center md:w-auto w-full">
						<div class="flex items-center gap-4 justify-start mdlg:justify-start md:w-auto w-full">
							<div
								v-for="item in [
									{
										title: 'Quizzes',
										icon: 'profile-quiz' as const,
										value: user.account.meta.publishedQuizzes,
									},
									{
										title: 'Courses',
										icon: 'profile-course' as const,
										value: user.account.meta.publishedCourses,
									},
									...(user.userType.isOrg
										? [{ title: 'Students', icon: 'profile-followers' as const, value: user.account.meta.students }]
										: []),
								]"
								:key="item.title"
								class="flex mdlg:flex-row mdlg:gap-2 flex-col gap-1 items-center">
								<SofaIcon :name="item.icon" class="h-[40px]" />
								<div class="flex flex-col items-center">
									<SofaText :content="item.title" />
									<SofaHeading size="title" :content="item.value.toString()" />
								</div>
							</div>
						</div>

						<SofaButton
							v-if="user.userType.isOrg && !authUser?.account.organizationsIn.find((o) => o.id === user!.id)"
							padding="px-6 py-2"
							@click="joinOrgHandler">
							Join
						</SofaButton>
					</div>
				</div>

				<div class="w-full flex gap-6 items-center">
					<SofaHeading
						v-for="item in ['content', 'about']"
						:key="item"
						as="router-link"
						:to="`/profile/${user.id}?tab=${item}`"
						class="capitalize pb-2 border-b-2 border-transparent text-deepGray"
						:class="{ '!text-primaryPurple !border-current': currentTab === item }"
						:content="item" />
				</div>
			</div>
		</div>

		<!-- Content sections -->
		<template v-if="currentTab == 'content'">
			<div class="w-full flex flex-col gap-3 py-4">
				<div v-if="materials.length" class="w-full mdlg:px-0 px-4">
					<div class="w-full px-4 py-1 bg-white rounded-custom flex gap-1 items-center justify-start">
						<SofaIcon name="search-black" class="h-[17px]" />
						<SofaTextField v-model="searchQuery" customClass="!border-none w-full grow" placeholder="Search" />
					</div>
				</div>

				<div class="w-full flex flex-col mdlg:gap-4 gap-3 pl-4 mdlg:pl-0">
					<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
						<SofaHeading content="Resources" />
						<SofaText
							class="text-primaryPink"
							as="router-link"
							content="View all"
							:to="`/marketplace/search?userId=${user.id}&userName=${user.publicName}`" />
					</div>

					<div
						v-if="materials.length"
						class="mdlg:gap-4 flex gap-3 mdlg:p-0 pr-4 flex-nowrap md:flex-wrap overflow-x-auto scrollbar-hide">
						<StudyMaterialCard
							v-for="m in filteredMaterials"
							:key="m.id"
							wrapped
							:material="m"
							class="mdlg:w-[calc((100%-4rem)/5)]" />
					</div>
					<div v-else class="pr-4 mdlg:pr-0">
						<SofaEmptyState
							:title="`${user.publicName} has no published materials yet`"
							subTitle="Discover thousands of other materials on Stranerd's marketplace"
							actionLabel="Marketplace"
							:action="() => $router.push('/marketplace')" />
					</div>
				</div>
			</div>
		</template>

		<template v-if="currentTab == 'about'">
			<div class="w-full flex flex-col gap-4 mdlg:p-0 p-4">
				<div class="w-full flex shadow-custom p-6 rounded-2xl bg-white flex-col gap-2">
					<SofaHeading content="Bio" />
					<SofaText :content="user.bio.description" />
				</div>

				<div class="w-full flex shadow-custom p-6 rounded-2xl bg-white flex-col gap-2">
					<SofaHeading content="Links" />
					<div class="w-full flex gap-5 items-center">
						<SofaText v-if="user.socials.length === 0" class="text-grayColor" content="No socials" />
						<a v-for="(item, index) in user.socials" :key="index" :href="item.link" target="_blank">
							<SofaIcon :name="socials[item.ref] ?? 'website'" class="h-5 fill-deepGray" />
						</a>
					</div>
				</div>
			</div>
		</template>
	</ExpandedLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { useRedirectToAuth } from '@app/composables/auth/session'
import { useModals } from '@app/composables/core/modals'
import { useUsersMaterials } from '@app/composables/study/users-materials'
import { socials } from '@app/composables/users/profile'

export default defineComponent({
	name: 'ProfileIdPage',
	setup() {
		useHead({ title: 'Public Profile' })

		const { user: authUser } = useAuth()
		const { runInAuth } = useRedirectToAuth()
		const route = useRoute()
		const currentTab = computed(() => (route.query.tab as string | undefined) ?? 'content')
		const id = route.params.id as string
		const { user, courses, quizzes } = useUsersMaterials(id)
		const materials = computed(() => [...courses, ...quizzes].sort((a, b) => b.createdAt - a.createdAt))
		const filteredMaterials = computed(() => {
			const query = searchQuery.value.toLowerCase()
			if (!query) return materials.value
			return materials.value.filter((item) => [item.title].some((v) => v.toLowerCase().includes(query)))
		})
		const joinOrgHandler = runInAuth(() => useModals().organizations.joinOrganization.open({ org: user.value! }))

		const searchQuery = ref('')

		return {
			authUser,
			user,
			materials,
			filteredMaterials,
			currentTab,
			socials,
			searchQuery,
			joinOrgHandler,
		}
	},
})
</script>
