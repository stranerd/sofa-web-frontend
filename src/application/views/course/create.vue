<template>
	<dashboard-layout
		:topbar-options="{
			type: 'subpage',
			title: SingleCourse ? SingleCourse.title : 'Create a course',
			actions: [
				{
					isIcon: true,
					data: [
						{
							name: 'Settings',
							icon: 'cog',
							handler: () => {
								showSettingModal = true
							},
							size: 'h-[20px]',
						},
					],
				},
				...actionButtonItems,
				{
					disabled: !hasUnsavedChanges,
					name: 'Save',
					handler: () => {
						Logic.Study.SaveCourseLocalChanges()
					},
				},
			],
			badges: [
				{
					text: SingleCourse.status,
					color: SingleCourse.isPublished ? 'gray' : 'green',
				},
			],
		}"
		:hide="{
			bottom: true,
			top: true,
		}"
		:bg-color="'mdlg:!bg-lightGray bg-white'">
		<template #left-session>
			<div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col h-full gap-4 overflow-y-auto">
				<sofa-course-sections
					v-if="Logic.Common.isLarge && SingleCourse"
					v-model="selectedMaterial"
					:section-input="updateCourseSectionForm"
					:update-sections="updateCourseSections"
					:close="() => {}" />
			</div>
		</template>

		<template #middle-session>
			<!-- Top bar for smaller screens -->
			<div
				class="w-full flex flex-row mdlg:!hidden justify-between items-center z-50 bg-lightGray px-4 py-4 sticky top-0 left-0 overflow-y-auto">
				<sofa-icon :custom-class="'h-[19px]'" :name="'circle-close'" @click="handleMobileGoback()" />
				<sofa-normal-text :custom-class="'!font-bold !text-sm'">
					{{ mobileTitle }}
				</sofa-normal-text>

				<div :class="`flex flex-row items-center gap-3 ${showSettingModal ? 'invisible' : ''} `">
					<sofa-icon
						v-if="!showSettingModal"
						:custom-class="'h-[18px]'"
						:name="'cog'"
						@click="
							() => {
								showSettingModal = true
								currentContent = 'settings'
							}
						" />

					<sofa-icon
						v-if="selectedMaterial"
						:custom-class="'h-[6px]'"
						:name="'more-options-horizontal'"
						@click="showMateterialDetails()" />
				</div>
			</div>
			<!-- create course for smaller screens -->
			<template v-if="showSettingModal">
				<div class="w-full mdlg:!hidden flex-col bg-white py-2 px-4 md:!flex">
					<course-settings
						:course="SingleCourse"
						:close="() => (showSettingModal = false)"
						@on-course-updated="handleCourseSettingSaved" />
				</div>
			</template>

			<template v-if="currentContent == 'sections' && !showSettingModal">
				<div class="w-full mdlg:!hidden flex-col h-full flex-grow bg-white py-2 px-4 md:!flex">
					<sofa-course-sections
						v-if="!Logic.Common.isLarge && SingleCourse"
						v-model="selectedMaterial"
						:section-input="updateCourseSectionForm"
						:update-sections="updateCourseSections"
						:close="() => {}"
						@on-material-selected="handleItemSelected" />

					<div class="h-[100px]"></div>
				</div>
			</template>

			<div
				class="w-full mdlg:!shadow-custom md:!py-5 md:!px-5 px-4 py-2 relative bg-white mdlg:!rounded-[16px] flex-grow h-full flex flex-col gap-4">
				<template v-if="!selectedMaterial">
					<div class="w-full mdlg:!flex flex-col hidden gap-4">
						<div class="w-full flex flex-row items-center justify-center">
							<sofa-header-text> Add study material </sofa-header-text>
						</div>
						<new-course-material />
					</div>
				</template>
				<template v-if="selectedMaterial?.type == 'quiz'">
					<div class="w-full flex flex-row items-center justify-between">
						<sofa-header-text> Questions </sofa-header-text>
						<sofa-normal-text :color="'text-primaryPink'"> Hide answers </sofa-normal-text>
					</div>

					<div class="w-full flex flex-col gap-3">
						<div
							v-for="(question, index) in selectedMaterial.data"
							:key="index"
							class="w-full bg-lightGray px-4 py-4 flex flex-col gap-2 rounded-custom">
							<div class="flex flex-row items-center gap-2">
								<sofa-normal-text :color="'text-grayColor'">
									{{ question.type }}
								</sofa-normal-text>

								<span class="w-[5px] h-[5px] rounded-full bg-grayColor"> </span>

								<sofa-normal-text :color="'text-grayColor'">
									{{ question.duration }}
								</sofa-normal-text>
							</div>

							<sofa-normal-text :custom-class="'text-left !font-bold'">
								{{ question.content }}
							</sofa-normal-text>

							<sofa-normal-text :custom-class="'text-left'">
								{{ question.answer }}
							</sofa-normal-text>
						</div>
					</div>
				</template>

				<template v-if="selectedMaterial?.type == 'document'">
					<div class="w-full mdlg:!h-full flex-grow flex flex-col" style="height: calc(100vh - 90px)">
						<sofa-document-reader :key="selectedMaterial.details.id" :document-url="selectedMaterial.data.documentUrl" />
					</div>
				</template>

				<template v-if="selectedMaterial?.type == 'image'">
					<div class="w-full flex flex-col">
						<sofa-image-loader
							:key="selectedMaterial.details.id"
							:custom-class="'w-full h-[400px] rounded-[12px]'"
							:photo-url="selectedMaterial.data.imageUrl" />
					</div>
				</template>

				<template v-if="selectedMaterial?.type == 'video'">
					<div class="w-full flex flex-col">
						<sofa-video-player
							:key="selectedMaterial.details.id"
							:video-url="selectedMaterial.data.videoUrl"
							:type="selectedMaterial.details.media.type" />
					</div>
				</template>
			</div>

			<!-- Bottom save button sm -->
			<div class="mdlg:!hidden fixed left-0 bottom-0 px-4 py-4 bg-white flex flex-col w-full z-0">
				<div :class="`w-full flex flex-col ${hasUnsavedChanges ? '' : 'opacity-50'}`">
					<sofa-button
						:custom-class="'w-full'"
						:padding="'py-3'"
						@click="hasUnsavedChanges ? Logic.Study.SaveCourseLocalChanges() : null">
						Save changes
					</sofa-button>
				</div>
			</div>
			<!-- More option / settings for smaller screens -->
			<sofa-modal
				v-if="showMoreOptions"
				:close="
					() => {
						showMoreOptions = false
					}
				"
				:custom-class="'mdlg:!hidden'">
				<div
					:class="`mdlg:!w-[70%] mdlg:!hidden bg-white lg:!w-[60%] px-0 pt-0  ${
						modalData.content != 'material_details' ? 'h-auto' : 'h-[95%]'
					} max-h-[95%] w-full flex flex-col rounded-t-[16px] gap-4 justify-between relative overflow-y-auto`"
					@click.stop="
						() => {
							//
						}
					">
					<div
						v-if="modalData.content != 'material_details'"
						class="w-full flex flex-row px-4 pt-3 justify-between items-center sticky top-0 left-0">
						<sofa-normal-text :custom-class="'!font-bold !text-base'">
							{{ modalData.title }}
						</sofa-normal-text>
						<sofa-icon :custom-class="'h-[19px]'" :name="'circle-close'" @click="showMoreOptions = false" />
					</div>

					<div v-if="modalData.content == 'add_material'" class="w-full flex flex-col px-4 pb-4">
						<new-course-material v-if="SingleCourse" @on-item-selected="handleAddMaterialChanged" />
					</div>

					<div v-if="modalData.content == 'add_video'" class="w-full flex flex-col px-4 pb-4">
						<add-video />
					</div>

					<sofa-course-details
						v-if="modalData.content == 'material_details' && SingleCourse"
						:data="selectedMaterial?.details"
						:type="selectedMaterial?.type"
						:close="
							() => {
								showMoreOptions = false
							}
						" />
				</div>
			</sofa-modal>

			<!-- Larger screen setings modal -->
			<sofa-modal
				v-if="showSettingModal"
				:close="
					() => {
						showSettingModal = false
						!SingleCourse ? Logic.Common.goBack() : null
					}
				"
				:custom-class="'hidden mdlg:!flex'"
				:can-close="false">
				<div
					class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] flex flex-col items-center relative"
					@click.stop="
						() => {
							//
						}
					">
					<div
						class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 py-4 px-4 rounded-[16px] items-center justify-center">
						<sofa-header-text :custom-class="'!text-xl !font-bold'">{{
							SingleCourse ? 'Settings' : 'Create a course'
						}}</sofa-header-text>

						<course-settings
							:course="SingleCourse"
							:close="
								() => {
									showSettingModal = false
								}
							"
							@on-course-updated="handleCourseSettingSaved" />
					</div>
				</div>
			</sofa-modal>
		</template>

		<template #right-session>
			<div
				class="w-full shadow-custom px-0 pt-4 bg-white rounded-[16px] flex flex-col gap-4 h-full justify-between relative overflow-y-auto">
				<template v-if="selectedMaterial">
					<sofa-course-details
						:key="selectedMaterial.details.id"
						:data="selectedMaterial.details"
						:type="selectedMaterial.type"
						:close="() => {}" />
				</template>
			</div>
		</template>
	</dashboard-layout>
</template>

<script lang="ts">
import AddVideo from '@/components/study/courses/AddVideo.vue'
import NewCourseMaterial from '@/components/study/courses/NewMaterial.vue'
import CourseSettings from '@/components/study/courses/Settings.vue'
import { Logic } from 'sofa-logic'
import {
	SofaButton,
	SofaCourseDetails,
	SofaCourseSections,
	SofaHeaderText,
	SofaIcon,
	SofaImageLoader,
	SofaModal,
	SofaNormalText,
	SofaDocumentReader,
	SofaVideoPlayer,
} from 'sofa-ui-components'
import { capitalize, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'

import { hasUnsavedChanges, updateCourseSectionForm, updateCourseSections } from '@/composables/course'

export default defineComponent({
	name: 'CreateCourse',
	components: {
		SofaIcon,
		SofaNormalText,
		SofaModal,
		SofaCourseSections,
		SofaHeaderText,
		SofaCourseDetails,
		SofaDocumentReader,
		SofaImageLoader,
		SofaVideoPlayer,
		CourseSettings,
		NewCourseMaterial,
		AddVideo,
		SofaButton,
	},
	middlewares: {
		fetchRules: [
			{
				domain: 'Study',
				property: 'Tags',
				method: 'GetTags',
				params: [
					{
						all: true,
					},
				],
				requireAuth: true,
			},
			{
				domain: 'Study',
				property: 'AllQuzzies',
				method: 'GetQuizzes',
				params: [
					{
						where: [
							{
								field: 'user.id',
								value: Logic.Common.AuthUser?.id,
								condition: 'eq',
							},
						],
					},
				],
				requireAuth: true,
				ignoreProperty: true,
			},
			{
				domain: 'Study',
				property: 'SingleCourse',
				method: 'GetCourse',
				params: [true],
				useRouteQuery: true,
				queries: ['id'],
				requireAuth: true,
				ignoreProperty: true,
			},
		],
	},
	setup() {
		useMeta({
			mobileTitle: 'Create Course',
		})

		const SingleCourse = ref(Logic.Study.SingleCourse)

		const create = () => {
			Logic.Common.GoToRoute('/')
		}

		const selectedMaterial = ref<any>()

		const showMoreOptions = ref(false)

		const showSettingModal = ref(false)

		const mobileTitle = ref('Create course')

		const actionButtonItems = reactive([
			{
				IsOutlined: true,
				name: 'Exit',
				handler: () => {
					Logic.Common.goBack()
				},
			},
		])

		const modalData = reactive({
			title: 'Add study material',
			content: 'add_material',
		})

		const currentContent = ref('')

		watch(showSettingModal, () => {
			if (showSettingModal.value) {
				mobileTitle.value = 'Create course'
			} else {
				mobileTitle.value = 'Content'
				currentContent.value = 'sections'
			}
		})

		const handleAddMaterialChanged = () => {
			showMoreOptions.value = false
		}

		const handleItemSelected = (data: any) => {
			if (data == undefined) {
				modalData.title = 'Add study material'
				modalData.content = 'add_material'

				showMoreOptions.value = true
			} else {
				currentContent.value = data.type
				mobileTitle.value = capitalize(data.type)
				selectedMaterial.value = data
			}
		}

		const handleMobileGoback = () => {
			if (currentContent.value != 'sections') {
				if (currentContent.value == '') {
					Logic.Common.goBack()
				} else {
					showSettingModal.value = false
					currentContent.value = 'sections'
				}
			} else {
				Logic.Common.goBack()
			}
		}

		const showMateterialDetails = () => {
			if (selectedMaterial.value) {
				modalData.title = 'Details'
				modalData.content = 'material_details'

				showMoreOptions.value = true
			}
		}

		const handleCourseSettingSaved = (status: boolean) => {
			if (status) {
				showSettingModal.value = false
			}
		}

		watch(currentContent, () => {
			if (currentContent.value == 'sections') {
				mobileTitle.value = 'Content'
				selectedMaterial.value = undefined
			}
		})

		watch(SingleCourse, () => {
			if (SingleCourse.value) {
				showSettingModal.value = false

				if (localStorage.getItem('couse_section_update') == null) {
					hasUnsavedChanges.value = false
				}
			}
		})

		onMounted(() => {
			Logic.Study.watchProperty('SingleCourse', SingleCourse)
			showSettingModal.value = false
			mobileTitle.value = 'Content'
			currentContent.value = 'sections'
			setTimeout(() => {
				hasUnsavedChanges.value = false
			}, 1000)
		})

		return {
			selectedMaterial,
			showMoreOptions,
			Logic,
			showSettingModal,
			mobileTitle,
			currentContent,
			modalData,
			updateCourseSectionForm,
			actionButtonItems,
			SingleCourse,
			hasUnsavedChanges,
			handleAddMaterialChanged,
			handleItemSelected,
			handleMobileGoback,
			showMateterialDetails,
			handleCourseSettingSaved,
			create,
			updateCourseSections,
		}
	},
})
</script>
<style scoped>
.textarea[contenteditable]:empty::before {
	content: 'Enter message';
	color: #78828c;
}
</style>
