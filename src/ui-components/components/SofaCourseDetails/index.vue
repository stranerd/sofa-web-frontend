<template>
	<div v-if="data" class="w-full flex flex-col h-full gap-4 relative">
		<div
			class="flex flex-row gap-2 justify-between items-center px-4 py-4 mdlg:!pt-0 border-b sticky top-0 left-0 bg-white border-[#F2F5F8]">
			<SofaNormalText :customClass="'!text-sm !font-bold'"> Details </SofaNormalText>
			<SofaIcon :customClass="'h-[19px] mdlg:!hidden '" :name="'circle-close'" @click="close()" />
		</div>
		<div class="flex flex-col gap-3 h-full w-full px-4">
			<template v-if="type == 'quiz'">
				<SofaImageLoader :customClass="'w-full rounded-custom h-[200px]'" :photoUrl="data.image_url" />

				<SofaNormalText :customClass="'text-left font-bold'">
					{{ data.title }}
				</SofaNormalText>

				<div class="w-full flex items-center gap-2 flex-row">
					<SofaNormalText :color="'text-primaryPurple'">
						{{ data.type }}
					</SofaNormalText>
					<span class="w-[4px] h-[4px] rounded-full bg-primaryPurple"></span>
					<SofaNormalText :color="'text-primaryPurple'">
						{{ data.questions }}
					</SofaNormalText>
				</div>

				<SofaNormalText :customClass="'text-left'">
					{{ data.description }}
				</SofaNormalText>

				<div class="w-full flex flex-col gap-2">
					<div class="flex flex-row gap-1 items-center">
						<SofaRatings v-model="data.ratings.avg" :size="'h-[14px] mdlg:!h-[15px]'" />
						<SofaNormalText> {{ data.ratings.avg }} </SofaNormalText>
						<SofaNormalText :color="'text-grayColor pl-2'"> ({{ data.ratings.count }} ratings) </SofaNormalText>
					</div>

					<div class="w-full flex flex-row items-center">
						<div class="gap-2 flex flex-row items-center">
							<SofaAvatar :size="'20'" :photoUrl="data.user.photoUrl" />
							<SofaNormalText>
								{{ data.user.name }}
							</SofaNormalText>
						</div>
					</div>

					<div class="w-full flex flex-row items-center gap-2">
						<SofaIcon :customClass="'h-[16px]'" :name="'calendar-black'" />
						<SofaNormalText> Last updated {{ data.last_updated }} </SofaNormalText>
					</div>
				</div>
			</template>

			<template v-if="type == 'document'">
				<SofaTextField
					ref="document_title"
					v-model="dataReactive.title"
					:customClass="'rounded-custom !bg-lightGray'"
					type="text"
					:name="'Document title'"
					:updateValue="dataReactive.title"
					:placeholder="'Document title'"
					:hasTitle="true"
					:rules="[Logic.Form.RequiredRule]"
					:borderColor="'border-transparent'">
					<template #title> Document title </template>
				</SofaTextField>

				<SofaTextarea
					v-model="dataReactive.description"
					:hasTitle="false"
					:textAreaStyle="'h-[60px] rounded-custom !bg-lightGray md:!py-4 md:!px-4 px-3 py-3 resize-none'"
					:placeholder="'Description'" />
			</template>

			<template v-if="type == 'image'">
				<SofaTextField
					ref="image_title"
					v-model="dataReactive.title"
					:customClass="'rounded-custom !bg-lightGray'"
					type="text"
					:name="'Image title'"
					:placeholder="'Image title'"
					:hasTitle="true"
					:rules="[Logic.Form.RequiredRule]"
					:updateValue="dataReactive.title"
					:borderColor="'border-transparent'">
					<template #title> Image title </template>
				</SofaTextField>

				<SofaTextarea
					v-model="dataReactive.description"
					:hasTitle="false"
					:textAreaStyle="'h-[60px] rounded-custom !bg-lightGray md:!py-4 md:!px-4 px-3 py-3 resize-none'"
					:placeholder="'Description'" />
			</template>

			<template v-if="type == 'video'">
				<SofaTextField
					ref="video_title"
					v-model="dataReactive.title"
					:customClass="'rounded-custom !bg-lightGray'"
					type="text"
					:name="'Video title'"
					:placeholder="'Video title'"
					:hasTitle="true"
					:rules="[Logic.Form.RequiredRule]"
					:updateValue="dataReactive.title"
					:borderColor="'border-transparent'">
					<template #title> Video title </template>
				</SofaTextField>

				<SofaTextarea
					v-model="dataReactive.description"
					:hasTitle="false"
					:textAreaStyle="'h-[60px] rounded-custom !bg-lightGray md:!py-4 md:!px-4 px-3 py-3 resize-none'"
					:placeholder="'Description'" />
			</template>
			<div v-if="type != 'quiz'" class="w-full flex flex-row items-center justify-end">
				<SofaButton :padding="'px-4 py-2'" @click="updateFile()"> Save changes </SofaButton>
			</div>
		</div>

		<div
			class="sticky bottom-0 left-0 bg-white rounded-b-[12px] w-full px-4 py-4 border-t-2 border-[#F2F5F8] z-50 flex flex-col gap-3 scrollbar-hide">
			<div
				class="w-full flex flex-row items-center justify-start gap-3 cursor-pointer"
				@click="
					async () => {
						const confirm = await Logic.Common.confirm({
							title: 'Are you sure?',
							sub: 'This action is permanent. You won\'t be able to undo this',
							right: { label: 'Yes, delete' },
						})
						if (!confirm) return
						await deleteFile(data.id)
					}
				">
				<SofaIcon :name="'trash'" :customClass="'h-[16px]'" />
				<SofaNormalText :color="'text-primaryRed'">Delete {{ type }}</SofaNormalText>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Logic } from 'sofa-logic'
import { defineComponent, reactive, toRef, watch } from 'vue'
import SofaAvatar from '../SofaAvatar'
import SofaButton from '../SofaButton'
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
		const dataReactive = reactive(dataRef.value)

		watch(dataRef, () => {
			dataReactive.title = dataRef.value.title
			dataReactive.description = dataRef.value.description
		})

		const updateFile = () => {
			if (!Logic.Study.SingleCourse) return
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
			if (!Logic.Study.SingleCourse) return
			// remove file from coursable
			// move item to course
			Logic.Study.MoveItemToCourseForm = {
				add: false,
				coursableId: id,
				type: 'file',
				id: Logic.Study.SingleCourse.id,
			}
			Logic.Study.MoveItemToCourse(true)?.then((response) => {
				if (response) {
					Logic.Study.DeleteFile(id).then(() => {
						Logic.Study.GetCourse(Logic.Study.SingleCourse!.id)
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
			})
		}

		return {
			Logic,
			dataReactive,
			deleteFile,
			updateFile,
		}
	},
})
</script>
