<template>
	<ExpandedLayout width="mdlg:!w-[85%] lg:!w-[75%]" layoutStyle="mdlg:py-4">
		<div class="mdlg:!flex hidden flex-row justify-between items-center w-full">
			<SofaNormalText color="text-grayColor w-full flex flex-row justify-start gap-1">
				<router-link to="/classes/explore">Explore Classes</router-link>
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
					<SofaButton
						v-if="!enrollInClassProps.hide"
						padding="py-3 px-5"
						customClass="hidden mdlg:block self-start mt-3"
						@click="enrollInClassProps.handler">
						{{ enrollInClassProps.label }}
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
				<div v-if="currentClass.lessons.length" class="flex gap-4 pt-6">
					<!-- For larger screen -->
					<div class="w-full hidden mdlg:flex gap-4 pt-6">
						<div class="flex mdlg:w-[30%] flex-col">
							<SofaHeaderText content="Lessons" customClass="!text-xl" />
							<div class="flex flex-col gap-4 mt-3">
								<LessonCard
									v-for="lesson in currentClass.lessons"
									:key="lesson.id"
									:lesson="lesson"
									hideJoin
									:class="lesson.id === selectedLesson?.id ? '!bg-lightBlue' : ''"
									:classInst="currentClass"
									@click="selectedLesson = lesson" />
							</div>
						</div>
						<LessonsForExplore :classInst="currentClass" :lesson="selectedLesson" />
					</div>
					<div class="w-full mdlg:hidden flex flex-col">
						<div class="flex flex-col">
							<SofaHeaderText content="Lessons" customClass="!text-xl" />
							<div class="flex flex-col gap-4 mt-3">
								<button
									v-for="lesson in currentClass.lessons"
									:key="lesson.id"
									class="flex items-center justify-between pr-4 rounded-md cursor-pointer"
									:class="lesson.id === selectedLesson?.id ? '!bg-lightBlue' : 'bg-lightGray'"
									@click="openPreviewModal(lesson)">
									<LessonCard
										:lesson="lesson"
										hideJoin
										:classInst="currentClass"
										:class="lesson.id === selectedLesson?.id ? '!bg-lightBlue' : 'bg-lightGray'" />
									<SofaIcon
										class="h-[8px]"
										name="chevron-down"
										:class="{ 'rotate-180': lesson.id === selectedLesson?.id }" />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="flex flex-col gap-4 items-center py-10">
					<img src="/images/empty-lessons.png" class="w-[84px] h-[84px]" />
					<SofaNormalText color="text-grayColor" customClass="font-bold">No lessons created yet!</SofaNormalText>
				</div>
			</div>
			<!-- Similar classes tab content -->
			<div v-if="selectedTab == 'similar_classes'">
				<div v-if="similarClasses.length === 0" class="flex flex-col gap-4 items-center py-10">
					<img src="/images/empty-classes.png" class="w-[84px] h-[84px]" />
					<SofaNormalText color="text-grayColor" customClass="font-bold">No class found!</SofaNormalText>
				</div>
				<div v-else class="w-full">
					<div
						class="mdlg:w-[85%] lg:w-full w-full grid grid-cols-2 md:grid-cols-3 mdlg:grid-cols-4 max-h-full overflow-y-auto gap-3 mdlg:gap-6 px-4 py-8 mdlg:py-12">
						<ExploreClassCard v-for="classItem in similarClasses" :key="classItem.id" :classInst="classItem" />
					</div>
				</div>
			</div>
		</div>
		<div v-if="!enrollInClassProps.hide" class="md:!hidden flex flex-col w-full bg-white p-4" @click="enrollInClassProps.handler">
			<SofaButton padding="px-6 py-3" customClass="w-full">
				{{ enrollInClassProps.label }}
			</SofaButton>
		</div>
	</ExpandedLayout>
</template>

<script lang="ts">
import { pluralize } from 'valleyed'
import { computed, defineComponent, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useClass, usePurchaseClass, useSimilarClasses } from '@app/composables/organizations/classes'
import { ClassLesson } from '@modules/organizations'
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'
export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdExplore',
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const router = useRouter()
		const route = useRoute()
		const { user, wallet } = useAuth()
		const organizationId = route.params.organizationId as string
		const classId = route.params.classId as string
		const tabs = [
			{
				name: 'Activity',
				key: 'activity',
			},
			{
				name: 'Similar Classes',
				key: 'similar_classes',
			},
		]
		const selectedTab = ref(tabs[0].key)
		const { class: currentClass } = useClass(organizationId, classId)
		const lessons = computed(() => currentClass.value?.lessons ?? [])
		const selectedLesson = ref(lessons.value[0])
		const pageTitle = computed(() => currentClass.value?.title ?? 'Class')
		const { purchaseClass } = usePurchaseClass()
		const { similarClasses } = useSimilarClasses(organizationId, classId)

		const openPreviewModal = (lesson: ClassLesson) => {
			selectedLesson.value = lesson
			if (currentClass.value) {
				useModals().organizations.previewCurriculum.open({
					lesson: selectedLesson.value,
					classInst: currentClass.value,
					curriculum: lesson.curriculum,
					isPreview: false,
				})
			}
		}

		watch(
			currentClass,
			() => {
				if (currentClass.value?.lessons) {
					selectedLesson.value = currentClass.value.lessons[0]
				}
			},
			{ once: true },
		)

		useMeta(computed(() => ({ title: pageTitle.value })))
		const shareClass = () => {
			if (currentClass.value) {
				Logic.Common.share(
					`Join ${currentClass.value.title} class on SOFA`,
					currentClass.value.description,
					currentClass.value.shareLink,
				)
			}
		}
		const enrollInClassProps = computed(() => {
			const classInst = currentClass.value
			if (!classInst) return { hide: true, label: 'Class not found', handler: () => {} }
			if (classInst.isEnrolled(user.value!))
				return {
					label: 'Go to class',
					handler: () => router.push(classInst.pageLink),
				}
			const classSub = wallet.value?.getClassSubscription({ organizationId: classInst.organizationId, classId: classInst.id })
			if (classSub && !classSub.active)
				return {
					label: 'Renew enrollment',
					handler: () => purchaseClass(classInst),
				}
			const canAccessFree = classInst.canAccessForFree(user.value!)
			return {
				label: `Enroll for ${canAccessFree ? 'free' : Logic.Common.formatPrice(classInst.price.amount, classInst.price.currency)}/month`,
				handler: () => purchaseClass(classInst),
			}
		})

		return {
			Logic,
			currentClass,
			pageTitle,
			pluralize,
			formatTime,
			tabs,
			selectedTab,
			shareClass,
			lessons,
			selectedLesson,
			purchaseClass,
			similarClasses,
			openPreviewModal,
			enrollInClassProps,
		}
	},
})
</script>
