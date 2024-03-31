<template>
	<DashboardLayout
		:wrap="true"
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
					type: 'submit',
					disabled: !profileFactory.valid || !socialsFactory.valid || !verificationFactory.valid,
				},
			],
		}">
		<template #left-session>
			<form class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4" @submit.prevent="submit">
				<div class="w-full flex flex-col">
					<SofaHeaderText customClass="!font-bold"> Personal information </SofaHeaderText>
					<SofaNormalText>Edit your profile</SofaNormalText>
				</div>

				<SofaImageLoader
					class="size-[96px] flex items-center justify-center relative bg-grayColor border border-grayColor rounded-full mx-auto"
					:photoUrl="profileFactory.photo?.link">
					<SofaIcon v-if="!profileFactory.photo" customClass="h-[50px]" name="user" />
					<SofaFileInput
						v-model="profileFactory.photo"
						class="absolute bottom-[-5%] right-[-5%] bg-black bg-opacity-50 rounded-full size-[40px] flex items-center justify-center"
						accept="image/*">
						<SofaIcon class="h-[18px]" name="camera-white" />
					</SofaFileInput>
				</SofaImageLoader>

				<SofaTextField
					v-model="profileFactory.first"
					placeholder="Enter first name"
					:hasTitle="true"
					customClass="rounded-custom !bg-lightGray"
					:error="profileFactory.errors.first">
					<template #title>First Name</template>
				</SofaTextField>

				<SofaTextField
					v-model="profileFactory.last"
					placeholder="Enter last name"
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
			</form>
		</template>

		<template #middle-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-[16px] flex flex-col gap-4">
				<div class="w-full flex flex-col items-start">
					<SofaHeaderText customClass="!font-bold"> Page content </SofaHeaderText>
					<SofaNormalText>Add 3 study materials you’ve created </SofaNormalText>
				</div>

				<div class="w-full flex flex-col gap-4">
					<StudyMaterialCard
						v-for="material in content.courses"
						:key="material.hash"
						type="activity"
						:material="material"
						:isWrapped="!Logic.Common.isLarge"
						:isRoute="false" />

					<StudyMaterialCard
						v-for="material in content.quizzes"
						:key="material.hash"
						type="activity"
						:material="material"
						:isWrapped="!Logic.Common.isLarge"
						:isRoute="false" />

					<SofaButton padding="p-4" @click="showAddMaterialHandler">
						<SofaIcon name="box-add" class="h-[18px] fill-white" />
						Add Content
					</SofaButton>
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
								v-model="selectedMaterial"
								customClass="rounded-custom !bg-lightGray"
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
			<form class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4" @submit.prevent="submit">
				<div class="w-full flex flex-col">
					<SofaHeaderText customClass="!font-bold"> Add links (optional) </SofaHeaderText>
					<SofaNormalText>Your educational website and socials</SofaNormalText>
				</div>

				<SocialMediaUpdate :factory="socialsFactory" />

				<SofaButton
					:disabled="!profileFactory.valid || !socialsFactory.valid || !verificationFactory.valid"
					padding="p-3"
					class="mdlg:hidden w-full sticky bottom-0"
					type="submit">
					Submit
				</SofaButton>
			</form>
		</template>
	</DashboardLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useMeta } from 'vue-meta'
import SocialMediaUpdate from '@app/components/onboarding/SocialMediaUpdate.vue'
import { useProfileUpdate } from '@app/composables/auth/profile'
import { ContentDetails, extractContent } from '@app/composables/marketplace'
import { useUserSocialsUpdate } from '@app/composables/users/profile'
import { useCreateVerification } from '@app/composables/users/verifications'
import { Conditions, Logic, SelectOption } from 'sofa-logic'

export default defineComponent({
	name: 'VerificationIndexPage',
	components: { SocialMediaUpdate },
	routeConfig: {
		middlewares: ['isAuthenticated'],
		fetchRules: [
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
			title: 'Become a verified creator',
		})

		const { factory: profileFactory, updateProfile } = useProfileUpdate()
		const { factory: socialsFactory, updateSocials } = useUserSocialsUpdate()
		const { factory: verificationFactory, content, createVerification } = useCreateVerification()

		const AllQuzzies = ref(Logic.Study.AllQuzzies)
		const AllCourses = ref(Logic.Study.AllCourses)

		const allMaterialsContents = ref<ContentDetails[]>([])

		const showAddMaterial = ref(false)
		const allMaterials = ref<SelectOption[]>([])
		const selectedMaterial = ref('')

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
				const material = allMaterialsContents.value.find((item) => item.id === selectedMaterial.value)
				if (!material) return
				if (material.type == 'quiz') verificationFactory.addQuiz(material.id)
				if (material.type == 'course') verificationFactory.addCourse(material.id)
			}
			showAddMaterial.value = false
		}

		const submit = async () => {
			const res = await Promise.all([updateProfile(), updateSocials()])
			if (res.every(Boolean)) await createVerification()
		}

		onMounted(() => {
			setMaterials()
			setMaterialsOptions()
		})

		return {
			profileFactory,
			submit,
			socialsFactory,
			verificationFactory,
			content,
			Logic,

			showAddMaterial,
			allMaterials,
			selectedMaterial,
			addMaterial,
			showAddMaterialHandler,
		}
	},
})
</script>
