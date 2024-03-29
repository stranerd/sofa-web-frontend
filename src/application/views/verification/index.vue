<template>
	<DashboardLayout
		:topbarOptions="{
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
		:wrap="true">
		<template #left-session>
			<div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
				<div class="w-full flex flex-col">
					<SofaHeaderText customClass="!font-bold"> Personal information </SofaHeaderText>
					<SofaNormalText>Edit your profile</SofaNormalText>
				</div>

				<div class="w-full flex flex-col items-center justify-center pt-3">
					<SofaImageLoader
						customClass="w-[96px] h-[96px] flex flex-row items-center justify-center relative bg-grayColor border border-grayColor rounded-full"
						:photoUrl="profileFactory.photo?.link">
						<SofaIcon v-if="!profileFactory.photo" customClass="h-[50px]" name="user" />
						<SofaFileInput
							v-model="profileFactory.photo"
							class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full h-[40px] w-[40px] flex items-center justify-center"
							accept="image/*">
							<SofaIcon class="h-[18px]" name="camera-white" />
						</SofaFileInput>
					</SofaImageLoader>
				</div>

				<SofaTextField
					v-model="profileFactory.first"
					placeholder="Enter name"
					:hasTitle="true"
					customClass="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.first">
					<template #title>First Name</template>
				</SofaTextField>

				<SofaTextField
					v-model="profileFactory.last"
					placeholder="Enter name"
					:hasTitle="true"
					customClass="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.last">
					<template #title>Last Name</template>
				</SofaTextField>

				<SofaTextarea
					v-model="profileFactory.description"
					placeholder="Description of yourself"
					:hasTitle="true"
					textAreaStyle="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.description">
					<template #title>Bio</template>
				</SofaTextarea>
			</div>
		</template>

		<template #middle-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-[16px] flex flex-col gap-4">
				<div class="w-full flex flex-col items-start">
					<SofaHeaderText customClass="!font-bold flex flex-row justify-start"> Page content </SofaHeaderText>
					<SofaNormalText>Add 3 study materials you’ve created </SofaNormalText>
				</div>

				<div class="w-full flex flex-col gap-2">
					<div class="w-full flex flex-col gap-4 md:!gap-4">
						<StudyMaterialCard
							v-for="content in selectedMaterialList"
							:key="content.original.hash"
							type="activity"
							:material="content.original"
							:isWrapped="!Logic.Common.isLarge"
							:isRoute="false" />

						<div class="w-full flex flex-col">
							<SofaButton padding="p-4" @click="showAddMaterialHandler">
								<SofaIcon name="box-add-white" customClass="h-[18px]"></SofaIcon>
								Add Content
							</SofaButton>
						</div>
					</div>
				</div>
			</div>

			<!-- Add material modal -->
			<SofaModalOld v-if="showAddMaterial" :close="() => (showAddMaterial = false)" :canClose="false">
				<div
					class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] w-full flex flex-col justify-end md:!justify-start items-center relative">
					<div
						class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 pt-0 pb-3 px-4 md:!rounded-[16px] rounded-t-[19px] items-center justify-center">
						<div class="w-full text-center hidden md:!inline-block">
							<SofaHeaderText customClass="!text-xl !font-bold ">Add a Material</SofaHeaderText>
						</div>

						<div class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden">
							<SofaNormalText customClass="!font-bold !text-base"> Add a Material </SofaNormalText>
							<SofaIcon customClass="h-[16px]" name="circle-close" @click="showAddMaterial = false" />
						</div>

						<div class="w-full flex flex-col gap-4">
							<SofaSelect
								:ref="addMaterialType"
								v-model="selectedMaterial"
								customClass="rounded-custom !bg-lightGray"
								:name="capitalize(addMaterialType)"
								placeholder="Select material"
								:rules="[Logic.Form.RequiredRule]"
								borderColor="border-transparent"
								:options="allMaterials"
								:hasTitle="true">
								<template #title> Choose a material </template>
							</SofaSelect>

							<div class="w-full flex flex-row items-center justify-between z-[50] bg-white">
								<SofaButton
									padding="px-5 py-2"
									bgColor="bg-white"
									textColor="text-grayColor"
									customClass="border border-gray-100 hidden mdlg:!inline-block"
									@click.prevent="showAddMaterial = false">
									Exit
								</SofaButton>

								<div class="mdlg:!w-auto w-full">
									<SofaButton padding="px-5 py-2" customClass="mdlg:!w-auto w-full" @click="addMaterial()">
										Add
									</SofaButton>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SofaModalOld>
		</template>

		<template #right-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex flex-col justify-start">
					<SofaHeaderText customClass="!font-bold flex flex-row justify-start"> Add links (optional) </SofaHeaderText>
					<SofaNormalText>Your educational website and socials</SofaNormalText>
				</div>

				<SocialMediaUpdate :factory="socialsFactory" />
			</div>

			<!-- Smaller screen CTA -->
			<div class="w-full flex flex-col md:hidden pt-4 pb-2 sticky bottom-0 left-0 items-center justify-center">
				<SofaButton :disabled="!profileFactory.valid || !socialsFactory.valid" padding="py-3" class="w-full" @click="submit">
					Submit
				</SofaButton>
			</div>
		</template>
	</DashboardLayout>
</template>

<script lang="ts">
import { capitalize, defineComponent, onMounted, ref } from 'vue'
import { useMeta } from 'vue-meta'
import SocialMediaUpdate from '@app/components/onboarding/SocialMediaUpdate.vue'
import { useProfileUpdate } from '@app/composables/auth/profile'
import { ContentDetails, extractContent } from '@app/composables/marketplace'
import { submitVerification, updateVerificationForm } from '@app/composables/profile'
import { useUserSocialsUpdate } from '@app/composables/users/profile'
import { Conditions, Logic, SelectOption } from 'sofa-logic'

export default defineComponent({
	name: 'VerificationIndexPage',
	components: { SocialMediaUpdate },
	routeConfig: {
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

		const UserVerification = ref(Logic.Users.Verifications?.results[0])

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

			AllCourses.value?.results.forEach((course) => {
				allMaterials.value.push({
					key: course.id,
					value: course.title,
				})
			})

			AllQuzzies.value?.results.forEach((quiz) => {
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

			AllQuzzies.value?.results.forEach((quiz) => {
				allMaterialsContents.value.push(extractContent(quiz))
			})

			AllCourses.value?.results.forEach((course) => {
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
			await Promise.all([updateProfile(), updateSocials()]).then((res) => {
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
