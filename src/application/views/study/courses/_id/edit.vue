<template>
	<FullLayout
		v-if="SingleCourse"
		:topbarOptions="{
			type: 'subpage',
			title: SingleCourse.title,
			actions: [
				{
					isIcon: true,
					data: [
						{
							name: 'Settings',
							icon: 'cog',
							handler: () => openEditModal(SingleCourse!),
							size: 'h-[20px]',
						},
					],
				},
				{
					IsOutlined: true,
					name: 'Exit',
					handler: () => {
						Logic.Common.goBack()
					},
				},
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
					color: SingleCourse.isPublished ? 'green' : 'gray',
				},
			],
		}"
		:hide="{
			bottom: true,
			top: true,
		}"
		bgColor="mdlg:!bg-lightGray bg-white">
		<template #left-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-[16px] flex flex-col h-full gap-4 overflow-y-auto">
				<SofaCourseSections
					v-if="Logic.Common.isLarge && SingleCourse"
					v-model="selectedMaterial"
					:sectionInput="updateCourseSectionForm"
					:updateSections="updateCourseSections"
					:close="() => {}" />
			</div>
		</template>

		<template #middle-session>
			<!-- Top bar for smaller screens -->
			<div
				class="w-full flex mdlg:!hidden justify-between items-center z-50 bg-lightGray px-4 py-4 sticky top-0 left-0 overflow-y-auto">
				<SofaIcon customClass="h-[19px]" name="circle-close" @click="handleMobileGoback()" />
				<SofaNormalText customClass="!font-bold !text-sm">
					{{ mobileTitle }}
				</SofaNormalText>

				<div class="flex items-center gap-3">
					<SofaIcon customClass="h-[18px]" name="cog" @click="openEditModal(SingleCourse!)" />

					<SofaIcon
						v-if="selectedMaterial"
						customClass="h-[6px]"
						name="more-options-horizontal"
						@click="showMateterialDetails()" />
				</div>
			</div>

			<template v-if="currentContent == 'sections'">
				<div class="w-full mdlg:!hidden flex-col h-full grow bg-white py-2 px-4 md:!flex">
					<SofaCourseSections
						v-if="!Logic.Common.isLarge && SingleCourse"
						v-model="selectedMaterial"
						:sectionInput="updateCourseSectionForm"
						:updateSections="updateCourseSections"
						:close="() => {}"
						@onMaterialSelected="handleItemSelected" />

					<div class="h-[100px]"></div>
				</div>
			</template>

			<div
				class="w-full mdlg:!shadow-custom md:!py-5 md:!px-5 px-4 py-2 relative bg-white mdlg:!rounded-[16px] grow flex flex-col gap-4">
				<template v-if="!selectedMaterial">
					<div class="w-full mdlg:!flex flex-col hidden gap-4">
						<div class="w-full flex flex-row items-center justify-center">
							<SofaHeaderText> Add study material </SofaHeaderText>
						</div>
						<NewCourseMaterial />
					</div>
				</template>
				<template v-if="selectedMaterial?.type == 'quiz'">
					<div class="w-full flex flex-row items-center justify-between">
						<SofaHeaderText> Questions </SofaHeaderText>
						<SofaNormalText color="text-primaryPink"> Hide answers </SofaNormalText>
					</div>

					<div class="w-full flex flex-col gap-3">
						<div
							v-for="(question, index) in selectedMaterial.data"
							:key="index"
							class="w-full bg-lightGray p-4 flex flex-col gap-2 rounded-custom">
							<div class="flex items-center gap-2">
								<SofaNormalText color="text-grayColor" :content="question.type" />
								<span class="size-[5px] rounded-full bg-grayColor"> </span>
								<SofaNormalText color="text-grayColor" :content="question.duration" />
							</div>

							<SofaNormalText customClass="text-left !font-bold" :content="question.content" />
							<SofaNormalText customClass="text-left" :content="question.answer" />
						</div>
					</div>
				</template>

				<template v-if="selectedMaterial?.type == 'document'">
					<div class="w-full mdlg:!h-full grow flex flex-col shrink-0 oveflow-y-auto">
						<SofaDocumentReader :key="selectedMaterial.details.id" :documentUrl="selectedMaterial.data.documentUrl" />
					</div>
				</template>

				<template v-if="selectedMaterial?.type == 'image'">
					<div class="w-full flex flex-col">
						<SofaImageLoader
							:key="selectedMaterial.details.id"
							customClass="w-full h-[400px] rounded-[12px]"
							:photoUrl="selectedMaterial.data.imageUrl" />
					</div>
				</template>

				<template v-if="selectedMaterial?.type == 'video'">
					<div class="w-full flex flex-col">
						<SofaVideoPlayer
							:key="selectedMaterial.details.id"
							:videoUrl="selectedMaterial.data.videoUrl"
							:type="selectedMaterial.details.media.type" />
					</div>
				</template>
			</div>

			<!-- Bottom save button sm -->
			<div class="mdlg:hidden sticky bottom-0 px-4 py-4 bg-white flex flex-col w-full z-0">
				<div :class="`w-full flex flex-col ${hasUnsavedChanges ? '' : 'opacity-50'}`">
					<SofaButton
						customClass="w-full"
						padding="py-3"
						@click="hasUnsavedChanges ? Logic.Study.SaveCourseLocalChanges() : null">
						Save changes
					</SofaButton>
				</div>
			</div>
			<!-- More option / settings for smaller screens -->
			<SofaModalOld
				v-if="showMoreOptions"
				:close="
					() => {
						showMoreOptions = false
					}
				"
				customClass="mdlg:!hidden">
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
						<SofaNormalText customClass="!font-bold !text-base">
							{{ modalData.title }}
						</SofaNormalText>
						<SofaIcon customClass="h-[19px]" name="circle-close" @click="showMoreOptions = false" />
					</div>

					<div v-if="modalData.content == 'add_material'" class="w-full flex flex-col px-4 pb-4">
						<NewCourseMaterial v-if="SingleCourse" @onItemSelected="handleAddMaterialChanged" />
					</div>

					<div v-if="modalData.content == 'add_video'" class="w-full flex flex-col px-4 pb-4">
						<AddVideo />
					</div>

					<SofaCourseDetails
						v-if="modalData.content == 'material_details' && SingleCourse"
						:data="selectedMaterial?.details"
						:type="selectedMaterial?.type"
						:close="
							() => {
								showMoreOptions = false
							}
						" />
				</div>
			</SofaModalOld>
		</template>

		<template #right-session>
			<div
				class="w-full shadow-custom px-0 pt-4 bg-white rounded-[16px] flex flex-col gap-4 h-full justify-between relative overflow-y-auto">
				<template v-if="selectedMaterial">
					<SofaCourseDetails
						:key="selectedMaterial.details.id"
						:data="selectedMaterial.details"
						:type="selectedMaterial.type"
						:close="() => {}" />
				</template>
			</div>
		</template>
	</FullLayout>
</template>

<script lang="ts">
import { capitalize, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'
import AddVideo from '@app/components/study/courses/AddVideo.vue'
import NewCourseMaterial from '@app/components/study/courses/NewMaterial.vue'
import { Logic } from 'sofa-logic'

import { useModals } from '@app/composables/core/modals'
import { hasUnsavedChanges, updateCourseSectionForm, updateCourseSections } from '@app/composables/course'
import { CourseEntity } from '@modules/study'

export default defineComponent({
	name: 'EditCourse',
	components: { NewCourseMaterial, AddVideo },
	routeConfig: {
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
				params: [],
				useRouteId: true,
				ignoreProperty: true,
			},
		],
	},
	setup() {
		useMeta({
			mobileTitle: 'Edit Course',
		})

		const SingleCourse = ref(Logic.Study.SingleCourse)

		const selectedMaterial = ref<any>()

		const showMoreOptions = ref(false)

		const mobileTitle = ref('Content')

		const modalData = reactive({
			title: 'Add study material',
			content: 'add_material',
		})

		const currentContent = ref('sections')

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

		watch(currentContent, () => {
			if (currentContent.value == 'sections') {
				mobileTitle.value = 'Content'
				selectedMaterial.value = undefined
			}
		})

		watch(SingleCourse, () => {
			if (SingleCourse.value) {
				if (localStorage.getItem('couse_section_update') == null) {
					hasUnsavedChanges.value = false
				}
			}
		})

		onMounted(() => {
			Logic.Study.watchProperty('SingleCourse', SingleCourse)
			setTimeout(() => {
				hasUnsavedChanges.value = false
			}, 1000)
		})

		const openEditModal = (course: CourseEntity) => useModals().study.editCourse.open({ course })

		return {
			selectedMaterial,
			showMoreOptions,
			Logic,
			openEditModal,
			mobileTitle,
			currentContent,
			modalData,
			updateCourseSectionForm,
			SingleCourse,
			hasUnsavedChanges,
			handleAddMaterialChanged,
			handleItemSelected,
			handleMobileGoback,
			showMateterialDetails,
			updateCourseSections,
		}
	},
})
</script>
