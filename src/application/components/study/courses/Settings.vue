<template>
	<SofaFormWrapper ref="formComp" :parent-refs="parentRefs ?? {}" class="w-full flex flex-col gap-4">
		<div class="w-full md:!grid md:!grid-cols-2 flex flex-col-reverse gap-4">
			<div class="col-span-1 w-full flex flex-col gap-3">
				<SofaTextField
					ref="title"
					v-model="courseSettingForm.title"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="text"
					:name="'Title'"
					:update-value="courseSettingForm.title"
					:placeholder="'Title'"
					:border-color="'border-transparent'"
					:rules="[Logic.Form.RequiredRule]" />

				<SofaTextarea
					ref="description"
					v-model="courseSettingForm.description"
					:has-title="false"
					:text-area-style="'h-[60px] rounded-custom !bg-lightGray md:!py-4 md:!px-4 px-3 py-3 resize-none'"
					:placeholder="'Description'" />

				<SofaSelect
					ref="topic"
					v-model="courseSettingForm.topic"
					:custom-class="'rounded-custom !bg-lightGray'"
					:name="'Topic'"
					:placeholder="'Topic'"
					:rules="[Logic.Form.RequiredRule]"
					:border-color="'border-transparent'"
					:options="allTopics"
					:can-use-custom="true" />

				<SofaTextField
					v-if="auth?.roles.isVerified"
					ref="price.amount"
					v-model="courseSettingForm.price"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="text"
					:name="'Price'"
					:update-value="courseSettingForm.price"
					:placeholder="'Price'"
					:border-color="'border-transparent'"
					:rules="[Logic.Form.RequiredRule]"
					:is-formatted="true">
					<template #inner-prefix>
						<SofaNormalText>₦</SofaNormalText>
					</template>
				</SofaTextField>
			</div>
			<div class="col-span-1 flex flex-col w-full pb-4 md:!pb-0">
				<SofaImageLoader
					:custom-class="'w-full md:!h-full h-[220px] rounded-custom relative'"
					:photo-url="courseImageUrl ? courseImageUrl : '/images/default.png'">
					<div class="absolute bottom-0 left-0 pb-3 flex w-full flex-row items-center justify-center">
						<SofaFileAttachment
							v-model="courseSettingForm.photo"
							v-model:localFileUrl="courseImageUrl"
							:is-wrapper="true"
							:accept="'image/png, image/gif, image/jpeg'">
							<template #content>
								<div
									class="px-4 py-3 flex flex-row items-center justify-center gap-2 rounded-custom bg-deepGray bg-opacity-50">
									<SofaIcon :custom-class="'h-[18px]'" :name="'camera-white'" />
									<SofaNormalText :color="'text-white'">Add cover photo</SofaNormalText>
								</div>
							</template>
						</SofaFileAttachment>
					</div>
				</SofaImageLoader>
			</div>
		</div>

		<div class="w-full flex flex-col gap-2">
			<SofaTextField
				ref="tags"
				v-model="courseSettingForm.tagString"
				:custom-class="'rounded-custom !bg-lightGray'"
				:name="'Tags'"
				:placeholder="'Tags (Comma separated for multiple)'"
				:border-color="'border-transparent'" />
			<div class="w-full flex flex-row flex-wrap items-center">
				<template v-for="(item, index) in courseSettingForm.tags" :key="index">
					<div v-if="item != 'Not set'" class="py-2 pr-2">
						<div class="py-2 px-3 border-2 flex flex-row items-center gap-2 rounded-custom border-darkLightGray">
							<SofaNormalText :color="'text-grayColor'">
								{{ item }}
							</SofaNormalText>
							<SofaIcon
								:name="'circle-close'"
								:custom-class="'h-[17px] cursor-pointer'"
								@click="courseSettingForm.tags = courseSettingForm.tags.filter((tag) => item != tag)"></SofaIcon>
						</div>
					</div>
				</template>
			</div>
		</div>

		<div
			class="w-full flex flex-row items-center justify-between mdlg:!relative fixed z-[50] bottom-0 left-0 mdlg:!bottom-auto mdlg:!left-auto bg-white mdlg:!py-0 mdlg:!px-0 py-4 px-4">
			<SofaButton
				:padding="'px-5 py-2'"
				:bg-color="'bg-white'"
				:text-color="'text-grayColor'"
				:custom-class="'border border-gray-100 hidden mdlg:!inline-block'"
				@click.prevent="course ? close() : Logic.Common.goBack()">
				Exit
			</SofaButton>

			<div class="mdlg:!w-auto w-full mdlg:!flex mdlg:!flex-row mdlg:!gap-3 grid grid-cols-2 gap-2 items-center">
				<div :class="`mdlg:!w-auto  flex flex-col ${course && !course.isPublished ? 'col-span-1' : 'col-span-full'}`">
					<SofaButton
						:padding="'px-5 mdlg:!py-2 py-3'"
						:custom-class="'mdlg:!w-auto w-full'"
						@click.prevent="course ? updateCourse(formComp) : createCourse(formComp)">
						{{ course ? 'Save' : 'Create' }}
					</SofaButton>
				</div>
				<div class="mdlg:!w-auto col-span-1 flex flex-col">
					<SofaButton
						v-if="course && !course.isPublished"
						:padding="'px-5 mdlg:!py-2 py-3'"
						:custom-class="'mdlg:!w-auto w-full'"
						@click.prevent="Logic.Study.PublishCourse(course.id)">
						Publish
					</SofaButton>
				</div>
			</div>
		</div>
	</SofaFormWrapper>
</template>
<script lang="ts">
import { useAuth } from '@app/composables/auth/auth'
import {
	allGenericTags,
	allTopics,
	courseSettingForm,
	courseSettingSaved,
	createCourse,
	getGenericTags,
	getTopics,
	updateCourse,
} from '@app/composables/course'
import { CourseEntity } from '@modules/study'
import { Logic } from 'sofa-logic'
import { defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
	name: 'CourseSettings',
	props: {
		customClass: {
			type: String,
			default: '',
		},
		course: {
			type: Object as () => CourseEntity,
			default: null,
		},
		close: {
			type: Function,
			required: true,
		},
	},
	emits: ['OnCourseUpdated'],
	setup(props, context) {
		const newTags = ref('')

		const formComp = ref<any>()
		const { auth } = useAuth()

		const courseImageUrl = ref('')

		const defaultTags = ref<string[]>([])

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
				courseSettingForm.tags = course.tagIds.map((id) => Logic.Study.GetTagName(id))
				defaultTags.value = course.tagIds.map((id) => Logic.Study.GetTagName(id))
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
	data() {
		return {
			parentRefs: null,
		}
	},
	mounted() {
		const parentRefs: any = this.$refs
		this.parentRefs = parentRefs
	},
})
</script>
