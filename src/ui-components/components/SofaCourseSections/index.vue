<template>
	<div class="w-full flex flex-col h-full py-2 mdlg:!py-0 mdlg:!gap-0 gap-4 relative overflow-y-auto overflow-x-hidden">
		<div class="flex flex-col gap-6 h-full w-full">
			<template v-if="sectionOptions.length">
				<template v-for="(option, index) in sectionOptions" :key="index">
					<div class="flex flex-col w-full gap-3">
						<template v-if="option">
							<div
								class="w-full flex flex-row items-center justify-between cursor-pointer"
								@click="option?.opened ? (option.opened = false) : (option.opened = true)">
								<div class="flex flex-row items-center gap-2">
									<SofaNormalText v-if="!option.edit" customClass="!font-bold">{{
										option.name == 'unsectioned' ? 'Unsectioned' : option.name
									}}</SofaNormalText>
									<input
										v-else
										v-model="option.name"
										class="outline-none focus:outline-slate-200 font-semibold px-2 placeholder:font-normal mdlg:text-base text-xs w-full border !bg-white border-gray-100 rounded !text-bodyBlack"
										autofocus
										placeholder="Section name"
										@click.stop="null"
										@blur="option.edit = false" />
								</div>
								<div class="flex flex-row items-center gap-3">
									<SofaIcon
										v-if="option.name != 'unsectioned'"
										customClass="h-[15px] cursor-pointer"
										name="edit-gray"
										@click.stop="option.edit = true" />
									<SofaIcon
										v-if="option.name != 'unsectioned'"
										customClass="h-[15px] cursor-pointer"
										name="trash-gray"
										@click.stop="removeSection(index)" />
									<SofaIcon customClass="h-[7px] cursor-pointer" :name="option.opened ? 'chevron-up' : 'chevron-down'" />
								</div>
							</div>

							<template v-if="option.opened">
								<Draggable
									v-model="option.materials"
									group="course-item"
									class="w-full gap-3"
									itemKey="id"
									handle=".handle">
									<template #item="{ element }">
										<div
											:class="`w-full flex flex-row items-center relative justify-between gap-2 px-2 py-2  rounded-[8px] cursor-pointer hover:bg-lightBlue ${
												selectedMaterial?.id == element.id ? 'bg-lightBlue' : 'bg-white'
											}`"
											@mouseover="element.hover = true"
											@mouseleave="element.hover = false"
											@click.stop="
												() => {
													selectedMaterial = {
														id: element.id,
														data: element.data,
														details: element.details,
														type: element.type.split('-')[0],
													}
													handleItemSelected()
												}
											">
											<div class="flex flex-row items-center gap-2">
												<SofaIcon customClass="h-[17px]" :name="element.type" />
												<SofaNormalText
													class="px-3 !line-clamp-2 text-left whitespace-nowrap overflow-x-hidden"
													:content="element.name" />
											</div>

											<div
												class="flex flex-row gap-2 items-center absolute h-full w-auto right-0 bottom-0 bg-lightBlue px-2 rounded-[8px]">
												<!-- <sofa-icon
                        :customClass="'h-[15px]'"
                        :name="'trash-gray'"
                      /> -->

												<SofaIcon customClass="h-[19px] handle" name="reorder-gray" />
											</div>
										</div>
									</template>
								</Draggable>

								<div
									v-if="option.name != 'unsectioned'"
									class="px-2 py-2 flex flex-row w-full items-center gap-2 cursor-pointer"
									@click="
										() => {
											selectedMaterial = undefined
											selectedSection = index
											handleItemSelected()
										}
									">
									<SofaIcon customClass="h-[17px]" name="box-add-purple" />
									<SofaNormalText color="text-primaryPurple"> Add study material </SofaNormalText>
								</div>
							</template>
						</template>
					</div>
				</template>
			</template>

			<div class="py-2 pt-0 flex flex-row w-full items-center gap-2 cursor-pointer" @click.stop="addNewSection()">
				<SofaIcon customClass="h-[17px]" name="box-add-pink" />
				<SofaNormalText color="text-primaryPink"> Add section </SofaNormalText>
			</div>
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
import { Logic, UpdateCourseSectionsInput } from 'sofa-logic'
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import Draggable from 'vuedraggable'
import SofaIcon from '../SofaIcon'
import { SofaNormalText } from '../SofaTypography'

export default defineComponent({
	name: 'SofaCourseSections',
	components: {
		SofaIcon,
		SofaNormalText,
		Draggable,
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
		sectionInput: {
			type: Object as () => UpdateCourseSectionsInput,
			required: true,
		},
		updateSections: {
			type: Function,
			default: () => {
				//
			},
		},
	},
	emits: ['update:modelValue', 'OnMaterialSelected'],
	setup(props, context) {
		const SingleCourse = ref(Logic.Study.SingleCourse)
		const SingleFile = ref(Logic.Study.SingleFile)
		const SingleQuiz = ref(Logic.Study.SingleQuiz)
		const SingleCourseFiles = ref(Logic.Study.SingleCourseFiles)
		const SingleCourseQuizzes = ref(Logic.Study.SingleCourseQuizzes)
		const NewCoursableItem = ref(Logic.Study.NewCoursableItem)
		const CoursableItemRemoved = ref(Logic.Study.CoursableItemRemoved)
		const SelectedMaterialDetails = ref(Logic.Study.SelectedMaterialDetails)
		const UpdatedFile = ref(Logic.Study.UpdatedFile)

		const selectedSection = ref(0)

		const sectionOptions = reactive([])

		const staticSectionOptions = ref([])
		const staticPropSections = ref([])

		const addSectionMaterial = (id: string, type: 'file' | 'quiz') => {
			Logic.Common.debounce(() => {
				props.sectionInput.sections[selectedSection.value].items.push({
					id,
					type,
				})
				setTimeout(() => {
					props.updateSections()
				}, 1000)
			}, 300)
		}

		const setSectionMaterial = async (mediaFile: FileEntity | undefined, quiz: QuizEntity | undefined, save = false, index: number) => {
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

				if (save) {
					addSectionMaterial(SingleFile.value.id, 'file')
				}
			}

			if (quiz) {
				QuestionsUseCases.getAllQuestions(quiz.id).then((questions) => {
					const allQuestions = questions.results.map((q) => ({
						type: QuestionEntity.getLabel(q.data.type),
						duration: Logic.Common.prettifyTime(q.timeLimit),
						content: q.question,
						answer: q.answer,
					}))

					staticSectionOptions.value[index].materials.push({
						name: quiz.title,
						id: quiz.id,
						type: 'quiz-course',
						details: {
							image_url: quiz.photo?.link || '',
							title: quiz.title,
							type: 'Quiz',
							questions: `${quiz.questions.length} questions`,
							description: quiz.description,
							ratings: {
								...quiz.ratings,
								label: `${quiz.ratings.count} rating${quiz.ratings.count > 1 ? 's' : ''}`,
							},
							user: {
								photoUrl: `${quiz.user.bio?.photo?.link}`,
								name: `${quiz.user.bio?.name?.full}`,
							},
							last_updated: formatTime(quiz.createdAt),
						},
						original: quiz,
						data: allQuestions,
						hover: false,
					})

					if (save) {
						addSectionMaterial(SingleQuiz.value.id, 'quiz')
					}
				})
			}
		}

		watch(SingleCourse, async () => {
			if (sectionOptions.length < SingleCourse.value.sections.length) {
				await setSections(SingleCourse.value.sections.length - 1)
			}
		})

		watch(NewCoursableItem, () => {
			if (sectionOptions.length) {
				Logic.Common.debounce(async () => {
					await setSectionMaterial(SingleFile.value, SingleQuiz.value, true, selectedSection.value)
				}, 500)
			}
		})

		watch(CoursableItemRemoved, async () => {
			await setSections()
			selectedMaterial.value = undefined
			handleItemSelected()
		})

		const addItemToSection = async (item: any, index: any) => {
			if (item.type == 'quiz') {
				const quizData = SingleCourseQuizzes.value?.filter((quiz) => quiz.id == item.id)
				if (quizData.length) {
					await setSectionMaterial(undefined, quizData[0], false, index)
				}
			} else {
				const fileData = SingleCourseFiles.value?.filter((file) => file.id == item.id)
				await setSectionMaterial(fileData[0], undefined, false, index)
			}
		}

		const setSections = async (index = 0) => {
			staticSectionOptions.value.length = 0
			staticPropSections.value.length = 0

			selectedSection.value = index

			await Promise.all(
				SingleCourse.value.sections.map(async (section, index) => {
					staticSectionOptions.value.push({
						name: section.label,
						id: Logic.Common.makeId(),
						materials: [],
						opened: index == selectedSection.value,
						edit: false,
					})

					staticPropSections.value.push({
						items: section.items,
						label: section.label,
					})

					await Promise.all(
						section.items.map(async (item) => {
							await addItemToSection(item, index)
						}),
					)
				}),
			)

			let remainCoursableItems = JSON.parse(JSON.stringify(SingleCourse.value.coursables))

			SingleCourse.value.sections.forEach((items) => {
				items.items.forEach((eachItem) => {
					const itemIndex = remainCoursableItems.findIndex((x) => x.id == eachItem.id)
					if (itemIndex != -1) {
						remainCoursableItems = remainCoursableItems.filter((thisItem) => thisItem.id != eachItem.id)
					}
				})
			})

			const unsectionedSection = SingleCourse.value.sections.filter((section) => section.label == 'unsectioned')

			let unsectionedIndex = SingleCourse.value.sections.length - 1

			if (unsectionedSection.length == 0) {
				staticSectionOptions.value.push({
					name: 'unsectioned',
					id: Logic.Common.makeId(),
					materials: [],
					opened: true,
					edit: false,
					items: [],
				})

				staticPropSections.value.push({
					items: [],
					label: 'unsectioned',
				})

				unsectionedIndex++
			}

			remainCoursableItems.map((item) => {
				addItemToSection(item, unsectionedIndex)
			})

			sectionOptions.length = 0
			sectionOptions.push(...staticSectionOptions.value)
			props.sectionInput.sections.length = 0
			props.sectionInput.sections.push(...staticPropSections.value)
		}

		const addNewSection = () => {
			const currentSectionsLenght = props.sectionInput.sections.length
			const newSectionPosition = currentSectionsLenght - 1 < 0 ? 0 : currentSectionsLenght - 1
			props.sectionInput.sections.splice(newSectionPosition, 0, {
				items: [],
				label: `Section ${sectionOptions.length}`,
			})

			sectionOptions.splice(newSectionPosition, 0, {
				name: `Section ${sectionOptions.length}`,
				id: Logic.Common.makeId(),
				materials: [],
				opened: true,
				edit: false,
				items: [],
			})

			SingleCourse.value.sections.splice(newSectionPosition, 0, {
				items: [],
				label: `Section ${sectionOptions.length}`,
			})

			Logic.Study.SingleCourse.sections.splice(newSectionPosition, 0, {
				items: [],
				label: `Section ${sectionOptions.length}`,
			})

			props.updateSections()
			Logic.Common.showAlert({
				message: 'New section added',
				type: 'success',
			})
		}

		onMounted(async () => {
			Logic.Study.watchProperty('SingleCourse', SingleCourse)
			Logic.Study.watchProperty('SingleFile', SingleFile)
			Logic.Study.watchProperty('SingleCourseFiles', SingleCourseFiles)
			Logic.Study.watchProperty('SingleCourseQuizzes', SingleCourseQuizzes)
			Logic.Study.watchProperty('NewCoursableItem', NewCoursableItem)
			Logic.Study.watchProperty('CoursableItemRemoved', CoursableItemRemoved)
			Logic.Study.watchProperty('UpdatedFile', UpdatedFile)
			Logic.Study.watchProperty('SingleQuiz', SingleQuiz)

			Logic.Study.watchProperty('SelectedMaterialDetails', SelectedMaterialDetails)
			if (SingleCourse.value) {
				await setSections()
			}
		})

		const updateLatestSection = () => {
			sectionOptions.forEach((option, index) => {
				if (option) {
					props.sectionInput.sections[index].items = option.materials.map((item) => ({
						id: item.id,
						type: item.type.includes('quiz') ? 'quiz' : 'file',
					}))
					props.sectionInput.sections[index].label = option.name
				} else {
					props.sectionInput.sections = props.sectionInput.sections.filter((item, itemIndex) => index != itemIndex)
				}
			})

			props.updateSections()
		}

		watch(sectionOptions, () => {
			updateLatestSection()
		})

		const removeSection = async (index: number) => {
			SingleCourse.value.sections.slice(index, 1)

			await setSections()

			return
		}

		watch(selectedSection, () => {
			sectionOptions.forEach((section, index) => {
				if (selectedSection.value == index) {
					section.opened = true
				} else {
					section.opened = false
				}
			})
		})

		watch(SelectedMaterialDetails, () => {
			console.log('I got the changes')
		})

		const selectedMaterial = ref<any>()

		watch(selectedMaterial, () => {
			context.emit('update:modelValue', selectedMaterial.value)
		})

		const handleItemSelected = () => {
			context.emit('OnMaterialSelected', selectedMaterial.value)
		}

		watch(UpdatedFile, () => {
			// update section
			sectionOptions.forEach((option) => {
				option.materials.forEach((item) => {
					if (item.id == UpdatedFile.value.id) {
						item.name = UpdatedFile.value.title
					}
				})
			})

			// update course file
			SingleCourseFiles.value.forEach((item) => {
				if (UpdatedFile.value.id == item.id) {
					item.title = UpdatedFile.value.title
					item.description = UpdatedFile.value.description
				}
			})
		})

		return {
			sectionOptions,
			selectedMaterial,
			handleItemSelected,
			addNewSection,
			selectedSection,
			removeSection,
		}
	},
})
</script>
