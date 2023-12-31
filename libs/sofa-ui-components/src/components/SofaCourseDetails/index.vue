<template>
	<div v-if="data" class="w-full flex flex-col h-full gap-4 relative">
		<div
			class="flex flex-row gap-2 justify-between items-center px-4 py-4 mdlg:!pt-0 border-b sticky top-0 left-0 bg-white border-[#F2F5F8]">
			<sofa-normal-text :custom-class="'!text-sm !font-bold'"> Details </sofa-normal-text>
			<sofa-icon :custom-class="'h-[19px] mdlg:!hidden '" :name="'circle-close'" @click="close()" />
		</div>
		<div class="flex flex-col gap-3 h-full w-full px-4">
			<template v-if="type == 'quiz'">
				<sofa-image-loader :custom-class="'w-full rounded-custom h-[200px]'" :photo-url="data.image_url" />

				<sofa-normal-text :custom-class="'text-left font-bold'">
					{{ data.title }}
				</sofa-normal-text>

				<div class="w-full flex items-center gap-2 flex-row">
					<sofa-normal-text :color="'text-primaryPurple'">
						{{ data.type }}
					</sofa-normal-text>
					<span class="w-[4px] h-[4px] rounded-full bg-primaryPurple"></span>
					<sofa-normal-text :color="'text-primaryPurple'">
						{{ data.questions }}
					</sofa-normal-text>
				</div>

				<sofa-normal-text :custom-class="'text-left'">
					{{ data.description }}
				</sofa-normal-text>

				<div class="w-full flex flex-col gap-2">
					<div class="flex flex-row gap-1 items-center">
						<sofa-ratings :count="data.ratings.avg" :size="'h-[14px] mdlg:!h-[15px]'" />
						<sofa-normal-text> {{ data.ratings.avg }} </sofa-normal-text>
						<sofa-normal-text :color="'text-grayColor pl-2'"> ({{ data.ratings.label }}) </sofa-normal-text>
					</div>

					<div class="w-full flex flex-row items-center">
						<div class="gap-2 flex flex-row items-center">
							<sofa-avatar :size="'20'" :photo-url="data.user.photoUrl" />
							<sofa-normal-text>
								{{ data.user.name }}
							</sofa-normal-text>
						</div>
					</div>

					<div class="w-full flex flex-row items-center gap-2">
						<sofa-icon :custom-class="'h-[16px]'" :name="'calendar-black'" />
						<sofa-normal-text> Last updated {{ data.last_updated }} </sofa-normal-text>
					</div>
				</div>
			</template>

			<template v-if="type == 'document'">
				<sofa-text-field
					ref="document_title"
					v-model="dataReactive.title"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="text"
					:name="'Document title'"
					:update-value="dataReactive.title"
					:placeholder="'Document title'"
					:has-title="true"
					:rules="[Logic.Form.RequiredRule]"
					:border-color="'border-transparent'">
					<template #title> Document title </template>
				</sofa-text-field>

				<sofa-textarea
					v-model="dataReactive.description"
					:has-title="false"
					:text-area-style="'h-[60px] rounded-custom !bg-lightGray md:!py-4 md:!px-4 px-3 py-3 resize-none'"
					:placeholder="'Description'" />
			</template>

			<template v-if="type == 'image'">
				<sofa-text-field
					ref="image_title"
					v-model="dataReactive.title"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="text"
					:name="'Image title'"
					:placeholder="'Image title'"
					:has-title="true"
					:rules="[Logic.Form.RequiredRule]"
					:update-value="dataReactive.title"
					:border-color="'border-transparent'">
					<template #title> Image title </template>
				</sofa-text-field>

				<sofa-textarea
					v-model="dataReactive.description"
					:has-title="false"
					:text-area-style="'h-[60px] rounded-custom !bg-lightGray md:!py-4 md:!px-4 px-3 py-3 resize-none'"
					:placeholder="'Description'" />
			</template>

			<template v-if="type == 'video'">
				<sofa-text-field
					ref="video_title"
					v-model="dataReactive.title"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="text"
					:name="'Video title'"
					:placeholder="'Video title'"
					:has-title="true"
					:rules="[Logic.Form.RequiredRule]"
					:update-value="dataReactive.title"
					:border-color="'border-transparent'">
					<template #title> Video title </template>
				</sofa-text-field>

				<sofa-textarea
					v-model="dataReactive.description"
					:has-title="false"
					:text-area-style="'h-[60px] rounded-custom !bg-lightGray md:!py-4 md:!px-4 px-3 py-3 resize-none'"
					:placeholder="'Description'" />
			</template>
			<div v-if="type != 'quiz'" class="w-full flex flex-row items-center justify-end">
				<sofa-button :padding="'px-4 py-2'" @click="updateFile()"> Save changes </sofa-button>
			</div>
		</div>

		<div
			class="sticky bottom-0 left-0 bg-white rounded-b-[12px] w-full px-4 py-4 border-t-2 border-[#F2F5F8] z-50 flex flex-col gap-3 scrollbar-hide">
			<div
				class="w-full flex flex-row items-center justify-start gap-3 cursor-pointer"
				@click="
					() => {
						selectedMaterialId = data.id
						showDeleteMaterial = true
					}
				">
				<sofa-icon :name="'trash'" :custom-class="'h-[16px]'" />
				<sofa-normal-text :color="'text-primaryRed'">Delete {{ type }}</sofa-normal-text>
			</div>
		</div>
	</div>

	<sofa-delete-prompt
		v-if="showDeleteMaterial"
		:title="'Are you sure you?'"
		:sub-title="`This action is permanent. You won't be able to undo this.`"
		:close="
			() => {
				showDeleteMaterial = false
			}
		"
		:buttons="[
			{
				label: 'No',
				isClose: true,
				action: () => {
					showDeleteMaterial = false
				},
			},
			{
				label: 'Yes, delete',
				isClose: false,
				action: () => {
					deleteMaterial()
				},
			},
		]" />
</template>
<script lang="ts">
import { Logic } from 'sofa-logic'
import { defineComponent, reactive, ref, toRef, watch } from 'vue'
import SofaAvatar from '../SofaAvatar'
import SofaButton from '../SofaButton'
import SofaDeletePrompt from '../SofaDeletePrompt'
import { SofaTextField, SofaTextarea } from '../SofaForm'
import SofaIcon from '../SofaIcon'
import SofaImageLoader from '../SofaImageLoader'
import SofaRatings from '../SofaRatings'
import { SofaNormalText } from '../SofaTypography'

export default defineComponent({
	name: 'SofaCourseDetails',
	components: {
		SofaIcon,
		SofaNormalText,
		SofaImageLoader,
		SofaRatings,
		SofaAvatar,
		SofaTextField,
		SofaTextarea,
		SofaDeletePrompt,
		SofaButton,
	},
	props: {
		customClass: {
			type: String,
			default: '',
		},
		close: {
			type: Function,
			required: true,
		},
		type: {
			type: String,
			default: 'video',
		},
		data: {
			type: Object as () => any,
			required: true,
		},
	},
	setup(props) {
		const dataRef = toRef(props, 'data')
		const showDeleteMaterial = ref(false)
		const selectedMaterialId = ref('')
		const dataReactive = reactive(dataRef.value)

		watch(dataRef, () => {
			dataReactive.title = dataRef.value.title
			dataReactive.description = dataRef.value.description
		})

		const updateFile = () => {
			Logic.Study.UpdateFileForm = {
				type: dataReactive.type,
				description: dataReactive.description,
				title: dataReactive.title,
				id: dataRef.value.id,
				tagIds: [],
				topicId: Logic.Study.SingleCourse.topicId,
			}

			Logic.Common.showLoading()

			Logic.Study.UpdateFile(true, dataRef.value.id)
				?.then(() => {
					Logic.Common.showAlert({
						message: 'All changes have been saved',
						type: 'success',
					})
				})
				.finally(() => {
					Logic.Common.hideLoading()
				})
		}

		const deleteFile = (id: string) => {
			// remove file from coursable
			// move item to course
			Logic.Study.MoveItemToCourseForm = {
				add: false,
				coursableId: id,
				type: 'file',
				id: Logic.Study.SingleCourse.id,
			}
			Logic.Study.MoveItemToCourse(true).then((response) => {
				if (response) {
					Logic.Study.DeleteFile(id).then(() => {
						Logic.Study.GetCourse(Logic.Study.SingleCourse.id)
						Logic.Common.showAlert({
							message: 'Material has been deleted.',
							type: 'success',
						})
					})
				} else {
					Logic.Common.showAlert({
						message: 'Unable to delete material. Please try again.',
						type: 'error',
					})
				}
				showDeleteMaterial.value = false
			})
		}

		const deleteMaterial = () => {
			deleteFile(selectedMaterialId.value)
		}
		return {
			Logic,
			dataReactive,
			showDeleteMaterial,
			selectedMaterialId,
			deleteFile,
			deleteMaterial,
			updateFile,
		}
	},
})
</script>
