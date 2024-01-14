<template>
	<!-- create item action -->
	<sofa-modal
		:close="
			() => {
				close ? close() : null
			}
		"
		:can-close="canClose">
		<div
			class="mdlg:!w-[60%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative"
			@click.stop="
				() => {
					//
				}
			">
			<div
				class="bg-white w-full flex flex-col lg:!px-6 md:!gap-4 gap-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
				<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
					<sofa-header-text :custom-class="'text-xl'" :content="title" />
				</div>

				<div
					class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-lightGray border-b px-4">
					<sofa-normal-text :custom-class="'!font-bold !text-base'">
						{{ title }}
					</sofa-normal-text>
				</div>

				<div class="w-full flex flex-col gap-4 px-4 py-4 items-center justify-center">
					<template v-if="tutor">
						<div class="w-full flex flex-row justify-center items-center gap-2">
							<sofa-avatar :photo-url="tutor.photo" :size="'27'" />
							<div class="flex flex-row items-center gap-1">
								<SofaNormalText :custom-class="'!font-bold'">
									{{ tutor.name }}
								</SofaNormalText>
								<SofaIcon :name="'tutor-bagde'" :custom-class="'h-[20px]'"></SofaIcon>
							</div>
						</div>
					</template>

					<div v-if="hasRatings" :class="`flex flex-col pb-3 ${tutor ? 'pt-2' : ''} `">
						<sofa-ratings v-model="formData.ratings" :count="formData.ratings" :readonly="false" :size="'h-[23px]'" />
					</div>

					<div class="flex flex-col w-full">
						<sofa-textarea
							v-model="formData.review"
							:padding="'px-3 py-4'"
							:custom-class="'bg-lightGray rounded-custom'"
							:placeholder="'Write a short message'"
							:text-area-style="'!bg-lightGray rounded-custom'">
						</sofa-textarea>
					</div>

					<div class="w-full flex flex-row items-center justify-center">
						<div class="w-full md:w-auto flex flex-col">
							<sofa-button :padding="'px-5 md:py-2 py-3'" :custom-class="'!w-full'" @click="submitReview()">
								Submit
							</sofa-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</sofa-modal>
</template>
<script lang="ts">
import { SofaAvatar, SofaButton, SofaHeaderText, SofaIcon, SofaModal, SofaNormalText, SofaRatings, SofaTextarea } from 'sofa-ui-components'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
	components: {
		SofaModal,
		SofaIcon,
		SofaNormalText,
		SofaHeaderText,
		SofaAvatar,
		SofaRatings,
		SofaTextarea,
		SofaButton,
	},
	props: {
		close: {
			type: Function,
			default: null,
		},
		title: {
			type: String,
			default: '',
		},
		tutor: {
			type: Object as () => {
				name: string
				photo?: string
			},
			required: false,
			default: null,
		},
		canClose: {
			type: Boolean,
			default: false,
		},
		hasRatings: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['OnReviewSubmitted'],
	setup(props, context) {
		const formData = reactive({
			ratings: 1,
			review: '',
		})

		const submitReview = () => {
			context.emit('OnReviewSubmitted', formData)
			props.close()
		}

		return {
			formData,
			submitReview,
		}
	},
})
</script>
