<template>
	<ExpandedLayout :hide="{ bottom: true }" width="mdlg:!w-[85%] lg:!w-[75%]" layoutStyle="mdlg:py-4">
		<div class="mdlg:!flex hidden flex-row justify-between items-center w-full">
			<SofaNormalText color="text-grayColor w-full flex flex-row justify-start gap-1">
				<span class="cursor-pointer" @click="Logic.Common.goBack()">{{ 'Explore Classes ' }}</span>
				<span> / {{ pageTitle }}</span>
			</SofaNormalText>
		</div>
		<div class="!block mdlg:!hidden p-4 self-end">
			<SofaIcon class="h-[16px]" name="circle-close" @click="Logic.Common.goBack()" />
		</div>
		<div v-if="currentClass" class="w-full bg-white rounded-[16px] flex flex-col flex-grow overflow-y-auto px-4 pb-4 mdlg:pt-4 pt-0">
			<!-- Class quick Info -->
			<div
				class="w-full flex mdlg:!flex md:!flex-row mdlg:!flex-none flex-col mdlg:!items-start h-auto items-start justify-start gap-3 mdlg:space-x-3">
				<div class="mdlg:!w-[33%] w-full">
					<SofaImageLoader
						customClass="mdlg:!w-full w-full h-[200px] rounded-custom relative !object-cover"
						:photoUrl="currentClass.picture">
					</SofaImageLoader>
				</div>
				<div class="w-full flex flex-col gap-2 flex-grow">
					<div class="w-full flex flex-row items-center justify-between">
						<SofaHeaderText :content="currentClass.title" />
						<SofaIcon name="share" customClass="h-[16px] cursor-pointer" @click="shareClass" />
					</div>
					<SofaNormalText>{{ currentClass.description }}</SofaNormalText>
					<div class="flex flex-row mdlg:flex-col gap-2">
						<div class="flex items-center gap-1">
							<SofaIcon name="lessons" customClass="fill-black h-[16px]" />
							<SofaNormalText color="text-deepGray">
								{{ currentClass.lessons.length }} {{ pluralize(currentClass.lessons.length, 'lesson', 'lessons') }}
							</SofaNormalText>
						</div>
						<div class="flex items-center gap-1">
							<SofaIcon name="user-unfilled" customClass="!fill-black h-[16px]" />
							<SofaNormalText color="text-deepGray">
								{{ currentClass.members.students.length }}
								{{ pluralize(currentClass.members.students.length, 'student', 'students') }}
							</SofaNormalText>
						</div>
					</div>
					<div class="flex items-center gap-1">
						<SofaAvatar :photoUrl="currentClass.user.bio.photo?.link" customClass="!h-[24px] !w-[24px]" />
						<SofaNormalText :content="currentClass.user.bio.name.full" />
						<div class="h-[5px] w-[5px] rounded-full bg-deepGray"></div>
						<SofaNormalText>
							{{ `Last updated ${formatTime(currentClass.updatedAt)}` }}
						</SofaNormalText>
					</div>
					<SofaButton padding="py-3 px-5" customClass="hidden mdlg:block self-start mt-3">
						{{ `Enroll ${Logic.Common.formatPrice(currentClass.price.amount, currentClass.price.currency)}/month` }}
					</SofaButton>
				</div>
			</div>
			<!-- Tabs -->
			<div
				class="w-full flex flex-row gap-4 items-center border-b border-lightGray mdlg:!pr-5 pr-4 z-50 bg-white pt-3 mdlg:!pt-3 mt-5">
				<SofaNormalText
					v-for="(tab, index) in tabs"
					:key="index"
					:color="selectedTab == tab.key ? 'text-bodyBlack' : 'text-grayColor'"
					:customClass="`!font-semibold cursor-pointer pb-2  ${selectedTab == tab.key ? 'border-b-2 border-bodyBlack' : ''}`"
					@click="selectedTab = tab.key">
					{{ tab.name }}
				</SofaNormalText>
			</div>
			<!-- Class lessons Tab Content -->
			<div v-if="selectedTab == 'activity'">
				<!-- Lessons -->
				<div class="pt-6">
					<SofaHeaderText content="Lessons" customClass="!text-xl" />
					<div class="flex flex-col gap-4 mt-3">
						<LessonCard v-for="lesson in currentClass.lessons" :key="lesson.id" :lesson="lesson" />
					</div>
				</div>
			</div>
			<!-- Similar classes tab content -->
			<div v-if="selectedTab == 'similar_classes'">
				<div class="flex flex-col gap-4 items-center py-10">
					<img src="/images/empty-class.png" class="w-[84px] h-[84px]" />
					<SofaNormalText color="text-grayColor" customClass="font-bold">No class found!</SofaNormalText>
				</div>
			</div>
		</div>
		<div v-if="currentClass" class="md:!hidden flex flex-col w-full bg-white p-4">
			<SofaButton padding="px-6 py-3" customClass="w-full">
				{{ `Enroll ${Logic.Common.formatPrice(currentClass.price.amount, currentClass.price.currency)}/month` }}
			</SofaButton>
		</div>
	</ExpandedLayout>
</template>

<script lang="ts">
import { Logic } from 'sofa-logic'
import { defineComponent, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useClass } from '@app/composables/organizations/classes'
import { useMeta } from 'vue-meta'
import { pluralize } from 'valleyed'
import { formatTime } from '@utils/dates'
import { useAuth } from '@app/composables/auth/auth'
export default defineComponent({
	setup() {
		const route = useRoute()
		const { id: userId } = useAuth()
		const organizationId = route.params.organizationId as string
		const classId = route.params.classId as string
		const tabs = ref([
			{
				name: 'Activity',
				key: 'activity',
			},
			{
				name: 'Similar Classes',
				key: 'similar_classes',
			},
		])
		const selectedTab = ref('activity')
		const { class: currentClass } = useClass(organizationId, classId)
		const pageTitle = computed(() => currentClass.value?.title ?? 'Class')

		useMeta(
			computed(() => ({
				title: pageTitle.value,
			})),
		)
		const shareClass = () => {
			if (currentClass.value) {
				Logic.Common.share(
					`Join ${currentClass.value.title} class on SOFA`,
					currentClass.value.description,
					currentClass.value.shareLink,
				)
			}
		}
		return { Logic, currentClass, pageTitle, pluralize, formatTime, tabs, selectedTab, userId, shareClass }
	},
})
</script>
