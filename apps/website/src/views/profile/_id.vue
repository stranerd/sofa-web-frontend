<template>
	<expanded-layout v-if="user" :hide="{ bottom: true }" width="mdlg:!w-[85%] lg:!w-[75%]" layoutStyle="mdlg:pt-6">
		<div class="w-full flex mdlg:hidden items-center gap-3 justify-between bg-white p-4">
			<SofaIcon class="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
			<SofaNormalText class="!font-bold !text-base" :content="user.bio.name.full" />
			<div />
		</div>

		<div class="w-full flex flex-col bg-primaryPurple mdlg:shadow-custom mdlg:rounded-2xl pt-[140px]">
			<div class="w-full flex flex-col px-4 pt-4 gap-6 bg-white mdlg:rounded-b-2xl">
				<div class="w-full flex mdlg:flex-row flex-col justify-between items-start mdlg:gap-0 gap-4">
					<div class="flex gap-3 items-start">
						<SofaAvatar :photoUrl="user.bio.photo?.link" size="110" customClass="-mt-[71px]" />

						<div class="flex flex-col">
							<div class="flex items-center gap-2">
								<SofaHeaderText class="!font-bold" :content="user.bio.name.full" />
								<SofaIcon name="verify" class="h-[16px]" v-if="user.roles.isVerified" />
								<SofaIcon name="tutor-bagde" class="h-[18px]" v-if="user.userType.isTeacher" />
							</div>
							<SofaNormalText class="capitalize" :content="user.userType.type" />
						</div>
					</div>

					<div
						class="flex mdlg:flex-row flex-col mdlg:gap-4 mdlg:justify-end items-start gap-3 mdlg:items-center md:w-auto w-full">
						<div class="flex items-center gap-4 justify-start mdlg:justify-start md:w-auto w-full">
							<div v-for="item in [
								{ title: 'Quizzes', icon: 'profile-quiz', value: user.account.meta.publishedQuizzes },
								{ title: 'Courses', icon: 'profile-course', value: user.account.meta.publishedCourses },
								...(user.userType.isOrg ? [
									{ title: 'Students', icon: 'profile-followers', value: user.account.meta.students },
								] : []),
							]" :key="item.title" class="flex mdlg:flex-row mdlg:gap-2 flex-col gap-1 items-center">
								<SofaIcon :name="item.icon" class="h-[40px]" />
								<div class="flex flex-col items-center">
									<SofaNormalText :content="item.title" />
									<SofaHeaderText :content="item.value.toString()" class="!font-bold" />
								</div>
							</div>
						</div>

						<SofaButton padding="px-6 py-2"
							v-if="user.userType.isOrg && !authUser.account.organizationsIn.find((o) => o.id === user.id)"
							@click="showModal = true">
							Join
						</SofaButton>
					</div>
				</div>

				<div class="w-full flex gap-6 items-center">
					<SofaNormalText v-for="item in ['content', 'about']" :key="item" as="router-link"
						:to="`/profile/${user.id}?tab=${item}`"
						class="!font-semibold capitalize pb-2 border-b-2 border-transparent text-deepGray"
						:class="{ '!text-primaryPurple !border-primaryPurple': currentTab === item }" :content="item" />
				</div>
			</div>
		</div>

		<!-- Content sections -->
		<template v-if="currentTab == 'content'">
			<div class="w-full flex flex-col gap-3 py-4">
				<div class="w-full mdlg:px-0 px-4" v-if="materials.length">
					<div class="w-full px-4 py-1 bg-white rounded-custom flex gap-1 items-center justify-start">
						<SofaIcon name="search-black" class="h-[17px]" />
						<SofaTextField customClass="!border-none w-full flex-grow" placeholder="Search"
							v-model="searchQuery" />
					</div>
				</div>

				<div class="w-full flex flex-col mdlg:gap-4 gap-3 pl-4 mdlg:pl-0">
					<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
						<SofaNormalText class="!font-bold" content="Resources" />
						<SofaNormalText color="text-primaryPink" as="router-link" content="View all"
							:to="`/marketplace/search?userId=${user.id}&userName=${user.bio.name.full}`" />
					</div>

					<div v-if="materials.length"
						class="mdlg:gap-4 flex gap-3 mdlg:p-0 pr-4 flex-nowrap md:flex-wrap overflow-x-auto scrollbar-hide">
						<SofaItemCard v-for="activity in filteredMaterials" as="router-link" :key="activity.id"
							:hasBookmark="true" :bookmarkAction="() => saveToFolder(activity)" :content="activity"
							:to="activity.route"
							class="flex-shrink-0 bg-white w-[220px] mdlg:w-[calc((100%-4rem)/5)] shadow-itemBox" />
					</div>
					<div v-else class="pr-4 mdlg:pr-0">
						<SofaEmptyState :title="`${user.bio.name.full} has no published materials yet`"
							subTitle="Discover thousands of other materials on SOFA marketplace"
							:actionLabel="'Marketplace'" :action="() => Logic.Common.GoToRoute('/marketplace')" />
					</div>
				</div>
			</div>
		</template>

		<template v-if="currentTab == 'about'">
			<div class="w-full flex flex-col gap-4 mdlg:p-0 p-4">
				<div class="w-full flex shadow-custom p-6 rounded-2xl bg-white flex-col gap-2">
					<SofaNormalText class="!font-bold" content="Bio" />
					<SofaNormalText :content="user.bio.description" />
				</div>

				<div class="w-full flex shadow-custom p-6 rounded-2xl bg-white flex-col gap-2">
					<SofaNormalText class="!font-bold" content="Links" />
					<div class="w-full flex gap-5 items-center">
						<SofaNormalText v-if="user.socials.length === 0" color="text-grayColor" content="No socials" />
						<a v-for="(item, index) in user.socials" :key="index" :href="item.link" target="_blank">
							<SofaIcon :name="socials[item.ref] ?? 'website'" class="h-[20px]" />
						</a>
					</div>
				</div>
			</div>
		</template>
	</expanded-layout>

	<SofaModal v-if="showModal" :close="() => showModal = false">
		<div class="flex flex-col md:gap-5 gap-3 relative mdlg:p-6 items-center">
			<SofaHeaderText class="hidden mdlg:inline-block text-xl" :content="`Join ${user.orgName}`" />

			<div class="w-full flex justify-between items-center mdlg:hidden py-2 border-lightGray border-b px-4">
				<SofaNormalText class="!font-bold !text-base" :content="`Join ${user.orgName}`" />
				<SofaIcon class="h-[19px]" name="circle-close" @click="showModal = false" />
			</div>

			<div class="w-full flex flex-col gap-5 mdlg:px-0 px-4">
				<SofaTextField v-model="joinCode" custom-class="rounded-custom !bg-lightGray !placeholder:text-grayColor"
					padding="p-3" type="text" placeholder="Enter Join Code" borderColor="border-transparent" />
			</div>

			<div class="w-full flex justify-between items-center md:gap-0 gap-3 mdlg:p-0 p-4">
				<SofaButton textColor="text-grayColor" bgColor="bg-white" padding="px-4 py-1"
					class="hidden md:inline-block border-2 border-gray-100 md:w-auto w-full" @click="showModal = false">
					Cancel
				</SofaButton>

				<SofaButton textColor="text-white" bgColor="bg-primaryBlue" padding="px-4 md:py-1 py-3"
					class="border-2 border-transparent md:w-auto w-full"
					@click="requestToJoinOrganization(user.id).then((succeeded) => succeeded ? showModal = false : null)">
					Continue
				</SofaButton>
			</div>
		</div>
	</SofaModal>
</template>

<script lang="ts">
import { useAuth } from '@/composables/auth/auth'
import { extractResource, saveToFolder } from '@/composables/library'
import { useUsersMaterials } from '@/composables/study/users-materials'
import { useMyOrganizations } from '@/composables/users/organizations'
import { socials } from '@/composables/users/profile'
import { Logic } from 'sofa-logic'
import {
	SofaAvatar,
	SofaButton,
	SofaEmptyState,
	SofaHeaderText,
	SofaIcon,
	SofaItemCard,
	SofaModal2 as SofaModal,
	SofaNormalText,
	SofaTextField,
} from 'sofa-ui-components'
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		SofaNormalText,
		SofaIcon,
		SofaHeaderText,
		SofaButton,
		SofaAvatar,
		SofaTextField,
		SofaItemCard,
		SofaEmptyState,
		SofaModal,
	},
	name: 'ProfileIdPage',
	setup () {
		useMeta({ title: 'Public Profile' })

		const { user: authUser } = useAuth()
		const route = useRoute()
		const currentTab = computed(() => route.query.tab as string | undefined ?? 'content')
		const id = route.params.id as string
		const { user, courses, quizzes } = useUsersMaterials(id)
		const materials = computed(() => [...courses, ...quizzes]
			.map((item) => extractResource(item))
			.sort((a, b) => b.createdAt - a.createdAt)
		)
		const filteredMaterials = computed(() => {
			const query = searchQuery.value.toLowerCase()
			if (!query) return materials.value
			return materials.value.filter((item) => [item.title].some((v) => v.toLowerCase().includes(query)))
		})
		const showModal = ref(false)

		const { code: joinCode, requestToJoinOrganization } = useMyOrganizations()

		const searchQuery = ref('')

		return {
			authUser, user, materials, filteredMaterials,
			Logic, currentTab, socials, searchQuery,
			showModal, joinCode, requestToJoinOrganization,
			saveToFolder,
		}
	},
})
</script>
