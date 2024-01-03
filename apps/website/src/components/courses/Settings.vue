<template>
	<sofa-form-wrapper :parentRefs="parentRefs" ref="formComp" class="w-full flex flex-col gap-4">
		<div class="w-full md:!grid md:!grid-cols-2 flex flex-col-reverse gap-4">
			<div class="col-span-1 w-full flex flex-col gap-3">
				<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
					type="text" :name="'Title'" ref="title"
					v-model="courseSettingForm.title" :update-value="courseSettingForm.title" :placeholder="'Title'"
					:borderColor="'border-transparent'" :rules="[Logic.Form.RequiredRule]" />

				<sofa-textarea :hasTitle="false"
					:textAreaStyle="'h-[60px] rounded-custom !bg-lightGray md:!py-4 md:!px-4 px-3 py-3 resize-none'"
					:placeholder="'Description'" ref="description" v-model="courseSettingForm.description" />

				<sofa-select :custom-class="'rounded-custom !bg-lightGray'"
					:name="'Topic'" ref="topic" :placeholder="'Topic'"
					:rules="[FormValidations.RequiredRule]" :borderColor="'border-transparent'"
					:options="allTopics" :can-use-custom="true"
					v-model="courseSettingForm.topic" />

				<sofa-text-field v-if="auth.roles.isVerified"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="text" :name="'Price'" ref="price.amount"
					v-model="courseSettingForm.price" :update-value="courseSettingForm.price" :placeholder="'Price'"
					:borderColor="'border-transparent'" :rules="[Logic.Form.RequiredRule]" :isFormatted="true">
					<template v-slot:inner-prefix>
						<sofa-normal-text>₦</sofa-normal-text>
					</template>
				</sofa-text-field>
			</div>
			<div class="col-span-1 flex flex-col w-full pb-4 md:!pb-0">
				<sofa-image-loader :customClass="'w-full md:!h-full h-[220px] rounded-custom relative'"
					:photoUrl="courseImageUrl ? courseImageUrl : '/images/default.png'">
					<div class="absolute bottom-0 left-0 pb-3 flex w-full flex-row items-center justify-center">
						<sofa-file-attachment :isWrapper="true" v-model="courseSettingForm.photo"
							:accept="'image/png, image/gif, image/jpeg'" v-model:localFileUrl="courseImageUrl">
							<template v-slot:content>
								<div
									class="px-4 py-3 flex flex-row items-center justify-center gap-2 rounded-custom bg-deepGray bg-opacity-50">
									<sofa-icon :customClass="'h-[18px]'" :name="'camera-white'" />
									<sofa-normal-text :color="'text-white'">Add cover photo</sofa-normal-text>
								</div>
							</template>
						</sofa-file-attachment>
					</div>
				</sofa-image-loader>
			</div>
		</div>

		<div class="w-full flex flex-col gap-2">
			<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
				:name="'Tags'" ref="tags"
				:placeholder="'Tags (Comma separated for multiple)'" :borderColor="'border-transparent'"
				v-model="courseSettingForm.tagString" />
			<div class="w-full flex flex-row flex-wrap items-center">
				<template v-for="(item, index) in courseSettingForm.tags" :key="index">
					<div class="py-2 pr-2" v-if="item != 'Not set'">
						<div class="py-2 px-3 border-2 flex flex-row items-center gap-2 rounded-custom border-darkLightGray">
							<sofa-normal-text :color="'text-grayColor'">
								{{ item }}
							</sofa-normal-text>
							<sofa-icon @click="
								courseSettingForm.tags = courseSettingForm.tags.filter(
									(tag) => item != tag
								)
							" :name="'circle-close'" :customClass="'h-[17px] cursor-pointer'"></sofa-icon>
						</div>
					</div>
				</template>
			</div>
		</div>

		<div
			class="w-full flex flex-row items-center justify-between mdlg:!relative fixed z-[50] bottom-0 left-0 mdlg:!bottom-auto mdlg:!left-auto bg-white mdlg:!py-0 mdlg:!px-0 py-4 px-4">
			<sofa-button :padding="'px-5 py-2'" :bgColor="'bg-white'" :textColor="'text-grayColor'"
				:customClass="'border border-gray-100 hidden mdlg:!inline-block'"
				@click.prevent="course ? close() : Logic.Common.goBack()">
				Exit
			</sofa-button>

			<div class="mdlg:!w-auto w-full mdlg:!flex mdlg:!flex-row mdlg:!gap-3 grid grid-cols-2 gap-2 items-center">
				<div :class="`mdlg:!w-auto  flex flex-col ${course && course.status != 'published'
					? 'col-span-1'
					: 'col-span-full'
				}`">
					<sofa-button :padding="'px-5 mdlg:!py-2 py-3'" :customClass="'mdlg:!w-auto w-full'" @click.prevent="
						course ? updateCourse(formComp) : createCourse(formComp)
					">
						{{ course ? "Save" : "Create" }}
					</sofa-button>
				</div>
				<div class="mdlg:!w-auto col-span-1 flex flex-col">
					<sofa-button :padding="'px-5 mdlg:!py-2 py-3'" :customClass="'mdlg:!w-auto w-full'"
						v-if="course && course.status != 'published'" @click.prevent="Logic.Study.PublishCourse(course.id)">
						Publish
					</sofa-button>
				</div>
			</div>
		</div>
	</sofa-form-wrapper>
</template>
<script lang="ts">
import { FormValidations } from '@/composables'
import { useAuth } from '@/composables/auth/auth'
import {
	allGenericTags,
	allTopics,
	courseSettingForm,
	courseSettingSaved,
	createCourse,
	getGenericTags,
	getTopics,
	updateCourse,
} from '@/composables/course'
import { Course, Logic } from 'sofa-logic'
import {
	SofaButton,
	SofaFileAttachment,
	SofaFormWrapper,
	SofaIcon,
	SofaImageLoader,
	SofaNormalText,
	SofaSelect,
	SofaTextField,
	SofaTextarea,
} from 'sofa-ui-components'
import { defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
	components: {
		SofaIcon,
		SofaTextField,
		SofaTextarea,
		SofaSelect,
		SofaImageLoader,
		SofaNormalText,
		SofaFileAttachment,
		SofaButton,
		SofaFormWrapper,
	},
	props: {
		customClass: {
			type: String,
			default: '',
		},
		course: {
			type: Object as () => Course,
		},
		close: {
			type: Function,
		},
	},
	name: 'CourseSettings',
	emits: ['OnCourseUpdated'],
	setup (props, context) {
		const newTags = ref('')

		const formComp = ref<any>()
		const { auth } = useAuth()

		const courseImageUrl = ref('')

		const defaultTags = ref([])

		const preventUpdate = ref(true)

		watch(courseSettingSaved, () => {
			if (!preventUpdate.value) {
				context.emit('OnCourseUpdated', courseSettingSaved)
			}
		})

		const setDefaultValues = () => {
			if (props.course) {
				const course = props.course
				courseSettingForm.title = course.title
				courseSettingForm.description = course.description

				courseSettingForm.topic = Logic.Study.GetTagName(course.topicId)
				courseSettingForm.price = course.price.amount.toString()
				courseSettingForm.tags = course.tagIds.map((id) =>
					Logic.Study.GetTagName(id)
				)
				defaultTags.value = course.tagIds.map((id) =>
					Logic.Study.GetTagName(id)
				)
				courseImageUrl.value = course.photo?.link || ''
				setTimeout(() => {
					formComp.value.fieldsToValidate?.tags.emptyValue()
					courseSettingForm.tagString = ''
				}, 300)
			} else {
				courseSettingForm.title = ''
				courseSettingForm.description = ''
				courseSettingForm.tags = []
				courseSettingForm.topic = ''
				courseImageUrl.value = ''
				setTimeout(() => {
					formComp.value.fieldsToValidate?.title.emptyValue()
					formComp.value.fieldsToValidate?.topic.emptyValue()
					formComp.value.fieldsToValidate?.description.emptyValue()
					formComp.value.fieldsToValidate?.tags.emptyValue()
					if (formComp.value.fieldsToValidate['price.amount']) {
						formComp.value.fieldsToValidate['price.amount']?.emptyValue()
					}
				}, 500)
			}
		}

		onMounted(() => {
			getTopics()
			getGenericTags()
			setDefaultValues()
			setTimeout(() => {
				preventUpdate.value = false
			}, 3000)
		})

		return {
			auth,
			courseSettingForm,
			Logic,
			FormValidations,
			formComp,
			courseImageUrl,
			createCourse,
			updateCourse,
			allTopics,
			allGenericTags,
			defaultTags,
			newTags,
		}
	},
	data () {
		return {
			parentRefs: null,
		}
	},
	mounted () {
		const parentRefs: any = this.$refs
		this.parentRefs = parentRefs
	},
})
</script>
