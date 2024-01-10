<template>
	<dashboard-layout
		:topbar-options="{
			type: 'subpage',
			title: 'Account verification',
			actions: [
				{
					IsOutlined: true,
					name: 'Exit',
					handler: Logic.Common.goBack,
				},
				{
					IsOutlined: false,
					name: 'Submit',
					disabled: !profileFactory.valid || !socialsFactory.valid,
					handler: submit,
				},
			],
		}"
		:wrap="true"
		:hide="{ bottom: true }">
		<template #left-session>
			<div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
				<div class="w-full flex flex-col">
					<sofa-header-text :custom-class="'!font-bold'"> Personal information </sofa-header-text>
					<sofa-normal-text>Edit your profile</sofa-normal-text>
				</div>

				<div class="w-full flex flex-col items-center justify-center pt-3">
					<sofa-image-loader
						:custom-class="`w-[96px] h-[96px] flex flex-row items-center justify-center relative bg-grayColor border border-grayColor rounded-full`"
						:photo-url="profileFactory.photo?.link">
						<sofa-icon v-if="!profileFactory.photo" :custom-class="'h-[50px]'" :name="'user'" />
						<SofaFileInput
							v-model="profileFactory.photo"
							class="`absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full h-[40px] w-[40px] flex items-center justify-center`"
							accept="image/*">
							<sofa-icon class="h-[18px]" name="camera-white" />
						</SofaFileInput>
					</sofa-image-loader>
				</div>

				<SofaTextField
					v-model="profileFactory.first"
					placeholder="Enter name"
					:has-title="true"
					custom-class="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.first">
					<template #title>First Name</template>
				</SofaTextField>

				<SofaTextField
					v-model="profileFactory.last"
					placeholder="Enter name"
					:has-title="true"
					custom-class="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.last">
					<template #title>Last Name</template>
				</SofaTextField>

				<SofaTextarea
					v-model="profileFactory.description"
					placeholder="Description of yourself"
					:has-title="true"
					text-area-style="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.description">
					<template #title>Bio</template>
				</SofaTextarea>
			</div>
		</template>

		<template #middle-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-[16px] flex flex-col gap-4">
				<div class="w-full flex flex-col items-start">
					<sofa-header-text :custom-class="'!font-bold flex flex-row justify-start'"> Page content </sofa-header-text>
					<sofa-normal-text>Add 3 study materials you’ve created </sofa-normal-text>
				</div>

				<div class="w-full flex flex-col gap-2">
					<div class="w-full flex flex-col gap-4 md:!gap-4">
						<template v-for="(content, index) in selectedMaterialList" :key="index">
							<template v-if="!Logic.Common.isOnlyMobile">
								<sofa-activity-card
									v-if="content.subject"
									:activity="content"
									:custom-class="'!bg-lightGray !w-full cursor-pointer'" />
							</template>
							<template v-else>
								<sofa-activity-card :activity="content" :custom-class="'!bg-lightGray'" :is-wrapped="true" />
							</template>
						</template>

						<div class="w-full flex flex-col">
							<SofaButton padding="p-4" @click="showAddMaterialHandler()">
								<sofa-icon :name="'box-add-white'" :custom-class="'h-[18px]'"></sofa-icon>
								Add Content
							</SofaButton>
						</div>
					</div>
				</div>
			</div>

			<!-- Add material modal -->
			<sofa-modal v-if="showAddMaterial" :close="() => (showAddMaterial = false)" :can-close="false">
				<div
					class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] w-full flex flex-col justify-end md:!justify-start items-center relative">
					<div
						class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 pt-0 pb-3 px-4 md:!rounded-[16px] rounded-t-[19px] items-center justify-center">
						<div class="w-full text-center hidden md:!inline-block">
							<sofa-header-text :custom-class="'!text-xl !font-bold '">Add a Material</sofa-header-text>
						</div>

						<div class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden">
							<sofa-normal-text :custom-class="'!font-bold !text-base'"> Add a Material </sofa-normal-text>
							<sofa-icon :custom-class="'h-[16px]'" :name="'circle-close'" @click="showAddMaterial = false" />
						</div>

						<div class="w-full flex flex-col gap-4">
							<sofa-select
								:ref="addMaterialType"
								v-model="selectedMaterial"
								:custom-class="'rounded-custom !bg-lightGray'"
								:name="capitalize(addMaterialType)"
								:placeholder="'Select material'"
								:rules="[FormValidations.RequiredRule]"
								:border-color="'border-transparent'"
								:options="allMaterials"
								:has-title="true">
								<template #title> Choose a material </template>
							</sofa-select>

							<div class="w-full flex flex-row items-center justify-between z-[50] bg-white">
								<sofa-button
									:padding="'px-5 py-2'"
									:bg-color="'bg-white'"
									:text-color="'text-grayColor'"
									:custom-class="'border border-gray-100 hidden mdlg:!inline-block'"
									@click.prevent="showAddMaterial = false">
									Exit
								</sofa-button>

								<div class="mdlg:!w-auto w-full">
									<sofa-button :padding="'px-5 py-2'" :custom-class="'mdlg:!w-auto w-full'" @click="addMaterial()">
										Add
									</sofa-button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</sofa-modal>
		</template>

		<template #right-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex flex-col justify-start">
					<sofa-header-text :custom-class="'!font-bold flex flex-row justify-start'"> Add links (optional) </sofa-header-text>
					<sofa-normal-text>Your educational website and socials</sofa-normal-text>
				</div>

				<SocialMediaUpdate :factory="socialsFactory" />
			</div>

			<!-- Smaller screen CTA -->
			<div class="w-full flex flex-col md:hidden py-4 sticky bottom-0 left-0 items-center justify-center">
				<SofaButton :disabled="!profileFactory.valid || !socialsFactory.valid" padding="py-3" class="w-full" @click="submit">
					Submit
				</SofaButton>
			</div>
		</template>
	</dashboard-layout>
</template>

<script lang="ts">
import SocialMediaUpdate from '@/components/onboarding/SocialMediaUpdate.vue'
import { FormValidations } from '@/composables'
import { useProfileUpdate } from '@/composables/auth/profile'
import { ContentDetails, extractContent } from '@/composables/marketplace'
import { submitVerification, updateVerificationForm } from '@/composables/profile'
import { useUserSocialsUpdate } from '@/composables/users/profile'
import { Conditions, Logic, SelectOption } from 'sofa-logic'
import {
	SofaActivityCard,
	SofaButton,
	SofaFileInput,
	SofaHeaderText,
	SofaIcon,
	SofaImageLoader,
	SofaModal,
	SofaNormalText,
	SofaSelect,
	SofaTextField,
	SofaTextarea,
} from 'sofa-ui-components'
import { capitalize, defineComponent, onMounted, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'VerificationIndexPage',
	components: {
		SofaIcon,
		SofaNormalText,
		SofaHeaderText,
		SofaTextField,
		SofaTextarea,
		SofaImageLoader,
		SofaFileInput,
		SofaModal,
		SofaButton,
		SofaSelect,
		SofaActivityCard,
		SocialMediaUpdate,
	},
	middlewares: {
		fetchRules: [
			{
				domain: 'Users',
				property: 'Verifications',
				method: 'GetVerifications',
				params: [
					{
						where: [
							{
								field: 'userId',
								condition: Conditions.eq,
								value: Logic.Common.AuthUser?.id,
							},
						],
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
								condition: Conditions.eq,
							},
						],
					},
				],
				requireAuth: true,
				ignoreProperty: true,
			},
			{
				domain: 'Study',
				property: 'AllCourses',
				method: 'GetCourses',
				params: [
					{
						where: [
							{
								field: 'user.id',
								value: Logic.Common.AuthUser?.id,
								condition: Conditions.eq,
							},
						],
					},
				],
				requireAuth: true,
				ignoreProperty: true,
			},
		],
	},
	setup() {
		useMeta({
			title: 'Verification application',
		})

		const { factory: profileFactory, updateProfile } = useProfileUpdate()
		const { factory: socialsFactory, updateSocials } = useUserSocialsUpdate()

		const AllQuzzies = ref(Logic.Study.AllQuzzies)
		const AllCourses = ref(Logic.Study.AllCourses)

		const showAddNewItems = ref(false)

		const selectedMaterialList = ref<ContentDetails[]>([])

		const allMaterialsContents = ref<ContentDetails[]>([])

		const showAddMaterial = ref(false)
		const addMaterialType = ref('course')
		const allMaterials = ref<SelectOption[]>([])
		const selectedMaterial = ref('')

		const UserVerification = ref(Logic.Users.Verifications.results[0])

		const setDefaultValues = () => {
			if (UserVerification.value) {
				UserVerification.value.content.courses.forEach((courseId) => {
					selectedMaterial.value = courseId
					addMaterial()
				})

				UserVerification.value.content.quizzes.forEach((quizId) => {
					selectedMaterial.value = quizId
					addMaterial()
				})
			}
		}

		const setMaterialsOptions = () => {
			allMaterials.value.length = 0

			AllCourses.value.results.forEach((course) => {
				allMaterials.value.push({
					key: course.id,
					value: course.title,
				})
			})

			AllQuzzies.value.results.forEach((quiz) => {
				allMaterials.value.push({
					key: quiz.id,
					value: quiz.title,
				})
			})
		}
		const quizContents = ref<ContentDetails[]>([])

		const courseContents = ref<ContentDetails[]>([])

		const setMaterials = () => {
			allMaterialsContents.value.length = 0

			AllQuzzies.value.results.forEach((quiz) => {
				allMaterialsContents.value.push(extractContent(quiz))
			})

			AllCourses.value.results.forEach((course) => {
				allMaterialsContents.value.push(extractContent(course))
			})
		}

		const showAddMaterialHandler = () => {
			setMaterialsOptions()
			showAddMaterial.value = true
		}

		const addMaterial = () => {
			if (selectedMaterial.value) {
				const currentMaterial = allMaterialsContents.value.filter((item) => item.id == selectedMaterial.value)

				if (selectedMaterialList.value.filter((item) => item.id == selectedMaterial.value).length == 0) {
					selectedMaterialList.value.push(currentMaterial[0])

					if (currentMaterial[0].type == 'quiz') updateVerificationForm.content.quizzes.push(currentMaterial[0].id)
					if (currentMaterial[0].type == 'course') updateVerificationForm.content.courses.push(currentMaterial[0].id)
				}
			}
			showAddMaterial.value = false
		}

		const submit = async () => {
			await Promise.all([updateProfile(true), updateSocials(true)]).then((res) => {
				if (res.every(Boolean)) submitVerification()
			})
		}

		onMounted(() => {
			setMaterials()
			setMaterialsOptions()
			setDefaultValues()
		})

		return {
			profileFactory,
			submit,
			socialsFactory,
			quizContents,
			courseContents,
			FormValidations,
			updateVerificationForm,
			selectedMaterialList,
			showAddMaterial,
			addMaterialType,
			Logic,
			allMaterials,
			selectedMaterial,
			showAddNewItems,
			addMaterial,
			showAddMaterialHandler,
			capitalize,
		}
	},
})
</script>
