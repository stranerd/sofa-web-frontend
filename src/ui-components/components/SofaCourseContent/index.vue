<template>
	<div class="flex flex-col h-full w-full relative pb-4">
		<div v-for="(option, index) in sectionOptions" :key="index" class="flex flex-col w-full gap-2 p-4 border-lightGray border-t">
			<template v-if="option">
				<template v-if="option.name != 'unsectioned'">
					<a
						class="w-full flex items-center justify-between px-1"
						@click="
							() => {
								option.opened = !option.opened
								selectedSection = index
							}
						">
						<SofaNormalText customClass="!font-bold">{{ option.name }}</SofaNormalText>
						<SofaIcon customClass="h-[7px] cursor-pointer" :name="option.opened ? 'chevron-up' : 'chevron-down'" />
					</a>
				</template>

				<template v-if="option.opened">
					<div class="w-full gap-1">
						<!-- For larger screens -->
						<template v-if="!Logic.Common.isOnlyMobile">
							<a
								v-for="(material, i) in option.materials"
								:key="i"
								class="w-full flex flex-col gap-1 rounded-lg p-3 hover:bg-lightBlue"
								:class="{
									'opacity-80': lockContent,
									'bg-lightBlue': selectedMaterial?.id === material.id,
									'bg-white': selectedMaterial?.id !== material.id,
								}"
								@click.stop="selectItem(material)">
								<div class="w-full flex justify-between items-center">
									<SofaNormalText customClass="!text-left !line-clamp-1">
										{{ material.name }}
									</SofaNormalText>
									<SofaIcon v-if="lockContent" customClass="h-[25px]" name="locked-content" />
									<SofaIcon v-else-if="itemIsStudied(material.id)" customClass="h-[18px]" name="selected" />
								</div>
								<div class="w-full flex gap-2 items-center">
									<div class="flex items-center gap-1">
										<SofaIcon customClass="h-[17px]" :name="material.type" />
										<SofaNormalText color="text-grayColor" customClass="!text-left !capitalize">
											{{ material.type.split('-')[0] }}
										</SofaNormalText>
									</div>

									<!-- <span class="w-[5px] h-[5px] rounded-full bg-grayColor"> </span> -->
								</div>
							</a>
						</template>
						<template v-else>
							<div class="w-full flex flex-col gap-3 pt-2">
								<div
									v-for="(material, i) in option.materials"
									:key="i"
									class="w-full flex gap-3 items-center py-1 hover:bg-lightBlue"
									@click.stop="selectItem(material)">
									<SofaIcon customClass="h-[18px]" :name="material.type" />
									<SofaNormalText customClass="!text-left !line-clamp-1" color="text-deepGray">
										{{ material.name }}
									</SofaNormalText>
								</div>
							</div>
						</template>
					</div>
				</template>
			</template>
		</div>
	</div>
</template>
<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FileEntity, QuestionEntity, QuestionsUseCases, QuizEntity } from '@modules/study'
import { formatTime } from '@utils/dates'
import { apiBase } from '@utils/environment'
import { getTokens } from '@utils/tokens'
import { ContentDetails, Logic } from 'sofa-logic'
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import SofaIcon from '../SofaIcon'
import { SofaNormalText } from '../SofaTypography'

export default defineComponent({
	name: 'SofaCourseContent',
	components: {
		SofaIcon,
		SofaNormalText,
	},
	props: {
		customClass: {
			type: String,
			default: '',
		},
		modelValue: {
			type: Object,
			required: true,
		},
		lockContent: {
			type: Boolean,
			required: false,
		},
	},
	emits: ['update:modelValue', 'OnMaterialSelected', 'onCourseContentSet'],
	setup(props, context) {
		const selectedSection = ref(0)

		const SingleCourse = ref(Logic.Study.SingleCourse)
		const SingleCourseFiles = ref(Logic.Study.SingleCourseFiles)
		const SingleCourseQuizzes = ref(Logic.Study.SingleCourseQuizzes)

		const sectionOptions = reactive([])

		const staticSectionOptions = ref([])

		const selectedMaterial = ref()

		const selectItem = (material: any) => {
			selectedMaterial.value = {
				id: material.id,
				data: material.data,
				details: material.details,
				original: material.original,
				type: material.type.split('-')[0],
				name: material.name,
			}
			handleItemSelected()
		}

		const itemIsStudied = (materialId: string) => {
			materialId
			return false
			/* return !!localStorage.getItem(
		`course_${SingleCourse.value.id}_material_${materialId}`
	  ) */
		}

		watch(SingleCourse, async () => {
			if (sectionOptions.length < SingleCourse.value.sections.length) {
				await setSections(SingleCourse.value.sections.length - 1)
			}
		})

		watch(selectedMaterial, () => {
			context.emit('update:modelValue', selectedMaterial.value)
		})

		const handleItemSelected = () => {
			context.emit('OnMaterialSelected', selectedMaterial.value)
			if (
				selectedMaterial.value.type == 'document' ||
				selectedMaterial.value.type == 'image' ||
				selectedMaterial.value.type == 'video'
			) {
				localStorage.setItem(`course_${SingleCourse.value.id}_material_${selectedMaterial.value.id}`, 'done')
			}
		}

		const saveSectionToLocalStorage = (autoLoad = false) => {
			if (!autoLoad) {
				localStorage.setItem('course_content_sections' + SingleCourse.value.id, JSON.stringify(staticSectionOptions.value))
			}

			const sectionOptionsData = JSON.parse(localStorage.getItem('course_content_sections' + SingleCourse.value.id))
			sectionOptions.length = 0
			sectionOptions.push(...sectionOptionsData)
		}

		const setSectionMaterial = async (mediaFile: FileEntity | undefined, quiz: QuizEntity | undefined, index: number) => {
			if (mediaFile) {
				const { accessToken } = await getTokens()
				const mediaUrl = `${apiBase}/study/files/${mediaFile.id}/media?AccessToken=${accessToken}`
				if (mediaFile.type == 'image') {
					staticSectionOptions.value[index].materials.push({
						name: mediaFile.title,
						id: mediaFile.id,
						type: 'image-course',
						details: {
							title: mediaFile.title,
							description: mediaFile.description,
							media: mediaFile.media,
							id: mediaFile.id,
						},
						original: mediaFile,
						data: {
							zoom: 100,
							fullScreen: false,
							imageUrl: mediaUrl,
						},
						hover: false,
					})
				}

				if (mediaFile.type == 'video') {
					staticSectionOptions.value[index].materials.push({
						name: mediaFile.title,
						id: mediaFile.id,
						type: 'video-course',
						hover: false,
						details: {
							title: mediaFile.title,
							link: mediaUrl,
							duration: '4m 44s',
							description: mediaFile.description,
							media: mediaFile.media,
							id: mediaFile.id,
						},
						original: mediaFile,
						data: {
							zoom: 100,
							fullScreen: false,
							videoUrl: mediaUrl,
						},
					})
				}

				if (mediaFile.type == 'document') {
					staticSectionOptions.value[index].materials.push({
						name: mediaFile.title,
						id: mediaFile.id,
						type: 'document-course',
						hover: false,
						details: {
							title: mediaFile.title,
							pages: '3',
							description: mediaFile.description,
							media: mediaFile.media,
							id: mediaFile.id,
						},
						original: mediaFile,
						data: {
							pages: {
								total: 3,
								current: 1,
							},
							zoom: 100,
							fullScreen: false,
							documentUrl: mediaUrl,
						},
					})
				}
			}

			if (quiz) {
				const allRequests: Promise<any>[] = []

				if (!props.lockContent) {
					allRequests.push(
						new Promise((resolve) => {
							QuestionsUseCases.getAllQuestions(quiz.id)
								.then((questions) => {
									const allQuestions = questions.results.map((q) => {
										return {
											type: QuestionEntity.getLabel(q.data.type),
											duration: Logic.Common.prettifyTime(q.timeLimit),
											content: q.question,
											answer: q.answer,
										}
									})

									const contentDetails = reactive<ContentDetails>(Logic.Study.contentDetails)

									contentDetails.title = quiz.title
									contentDetails.id = quiz.id
									contentDetails.price = 0
									contentDetails.image = quiz.photo ? quiz.photo.link : '/images/default.png'
									contentDetails.info = quiz.description
									contentDetails.lastUpdated = `Last updated ${formatTime(quiz.updatedAt)}`
									contentDetails.tags = quiz.tagIds.map((id) => {
										return Logic.Study.GetTagName(id)
									})
									contentDetails.user.name = quiz.user.bio.publicName
									contentDetails.user.photoUrl = quiz.user.bio.photo ? quiz.user.bio.photo.link : ''

									contentDetails.content.materialsCount = quiz.questions.length

									contentDetails.labels = {
										color: 'purple',
										main: 'Quiz',
										sub: `${quiz.questions.length} question${quiz.questions.length > 1 ? 's' : ''}`,
									}

									contentDetails.questions = allQuestions

									staticSectionOptions.value[index].materials.push({
										name: quiz.title,
										id: quiz.id,
										type: 'quiz-course',
										data: contentDetails,
										original: quiz,
										hover: false,
									})

									resolve('')
								})
								.catch(() => {
									staticSectionOptions.value[index].materials.push({
										name: quiz.title,
										id: quiz.id,
										type: 'quiz-course',
										original: quiz,
										data: [],
										hover: false,
									})
								})
						}),
					)
				} else {
					staticSectionOptions.value[index].materials.push({
						name: quiz.title,
						id: quiz.id,
						type: 'quiz-course',
						data: [],
						original: quiz,
						hover: false,
					})
				}

				Promise.all(allRequests)
					.then(() => {
						saveSectionToLocalStorage()
					})
					.catch(() => {
						saveSectionToLocalStorage()
					})
			}
		}

		const setSections = async (index = 0) => {
			staticSectionOptions.value.length = 0
			selectedSection.value = index

			if (localStorage.getItem('course_content_sections' + SingleCourse.value.id)) {
				saveSectionToLocalStorage(true)
			}

			let hasQuiz = false

			await Promise.all(
				SingleCourse.value.sections.map(async (section, index) => {
					staticSectionOptions.value.push({
						name: section.label,
						id: Logic.Common.makeId(),
						materials: [],
						opened: index == selectedSection.value,
						edit: false,
					})

					await Promise.all(
						section.items.map(async (item) => {
							if (item.type == 'quiz') {
								const quizData = SingleCourseQuizzes.value.filter((quiz) => quiz.id == item.id)
								if (quizData.length) {
									await setSectionMaterial(undefined, quizData[0], index)
								}
								hasQuiz = true
							} else {
								const fileData = SingleCourseFiles.value.filter((file) => file.id == item.id)
								await setSectionMaterial(fileData[0], undefined, index)
							}
						}),
					)
				}),
			)

			if (!hasQuiz) {
				saveSectionToLocalStorage()
			}
		}

		watch(sectionOptions, () => {
			context.emit('onCourseContentSet', sectionOptions)
		})
		onMounted(async () => {
			if (SingleCourse.value) {
				await setSections()
			}

			setTimeout(() => {
				if (!props.lockContent && !Logic.Common.isOnlyMobile) {
					if (props.modelValue) {
						selectedMaterial.value = props.modelValue
						selectedMaterial.value.isMounted = true
						handleItemSelected()
					} else {
						if (sectionOptions[0]) {
							if (sectionOptions[0].materials[0]) {
								selectedMaterial.value = {
									id: sectionOptions[0].materials[0].id,
									data: sectionOptions[0].materials[0].data,
									details: sectionOptions[0].materials[0].details,
									type: sectionOptions[0].materials[0].type.split('-')[0],
									isMounted: true,
									name: sectionOptions[0].materials[0].name,
								}
								handleItemSelected()
							}
						}
					}
				}
			}, 300)
		})

		return {
			Logic,
			sectionOptions,
			selectedSection,
			selectedMaterial,
			handleItemSelected,
			itemIsStudied,
			selectItem,
		}
	},
})
</script>
