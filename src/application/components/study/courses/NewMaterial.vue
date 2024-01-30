<template>
	<div class="w-full flex flex-col gap-4">
		<div class="w-full grid grid-cols-2 h-full md:!gap-6 gap-3">
			<template v-for="(item, index) in newMaterialOptions" :key="index">
				<a
					v-if="item.type == 'quiz'"
					class="col-span-1 rounded-custom md:!h-[280px] h-[120px] border-darkLightGray border-2 flex flex-col gap-3 items-center justify-center"
					@click="showAddQuiz = true">
					<SofaIcon :name="item.icon" customClass="h-[22px]"> </SofaIcon>
					<SofaNormalText customClass="!font-bold">
						{{ item.name }}
					</SofaNormalText>
				</a>

				<SofaFileAttachment
					v-if="item.type == 'image'"
					v-model="imageFile"
					:isWrapper="true"
					customClass="col-span-1 flex flex-col"
					accept="image/png, image/gif, image/jpeg">
					<template #content>
						<a
							class="w-full rounded-custom md:!h-[280px] h-[120px] border-darkLightGray border-2 flex flex-col gap-3 items-center justify-center">
							<SofaIcon :name="item.icon" customClass="h-[22px]"> </SofaIcon>
							<SofaNormalText customClass="!font-bold">
								{{ item.name }}
							</SofaNormalText>
						</a>
					</template>
				</SofaFileAttachment>

				<SofaFileAttachment
					v-if="item.type == 'document'"
					v-model="documentFile"
					:isWrapper="true"
					customClass="col-span-1 flex flex-col"
					accept="application/pdf">
					<template #content>
						<a
							class="w-full rounded-custom md:!h-[280px] h-[120px] border-darkLightGray border-2 flex flex-col gap-3 items-center justify-center">
							<SofaIcon :name="item.icon" customClass="h-[22px]"> </SofaIcon>
							<SofaNormalText customClass="!font-bold">
								{{ item.name }}
							</SofaNormalText>
						</a>
					</template>
				</SofaFileAttachment>

				<SofaFileAttachment
					v-if="item.type == 'video'"
					v-model="videoFile"
					:isWrapper="true"
					customClass="col-span-1 flex flex-col"
					accept="video/mp4">
					<template #content>
						<a
							class="w-full rounded-custom md:!h-[280px] h-[120px] border-darkLightGray border-2 flex flex-col gap-3 items-center justify-center">
							<SofaIcon :name="item.icon" customClass="h-[22px]"> </SofaIcon>
							<SofaNormalText customClass="!font-bold">
								{{ item.name }}
							</SofaNormalText>
						</a>
					</template>
				</SofaFileAttachment>

				<!-- <div
          v-if="item.type == 'video'"
          :customClass="'col-span-1 flex flex-col'"
          @click="handleShowAddVideo()"
        >
          <a
            class="w-full rounded-custom md:!h-[280px] h-[120px] border-darkLightGray border-2 flex flex-col gap-3 items-center justify-center"
          >
            <sofa-icon :name="item.icon" :customClass="'h-[22px]'"> </sofa-icon>
            <sofa-normal-text :customClass="'!font-bold'">
              {{ item.name }}
            </sofa-normal-text>
          </a>
        </div> -->
			</template>
		</div>
	</div>
	<SofaModalOld
		v-if="showAddVideo"
		:close="
			() => {
				showAddVideo = false
			}
		">
		<div
			class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full w-full h-[95%] md:w-[70%] flex flex-col items-center relative"
			@click.stop="
				() => {
					//
				}
			">
			<div
				class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 py-4 px-4 rounded-[16px] items-center justify-center">
				<SofaHeaderText customClass="text-xl" content="Add video" />

				<AddVideo />
			</div>
		</div>
	</SofaModalOld>

	<!-- Add question modal -->
	<SofaModalOld
		v-if="showAddQuiz"
		:close="
			() => {
				showAddQuiz = false
			}
		"
		:canClose="false">
		<div
			class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] w-full flex flex-col justify-end md:!justify-start items-center relative"
			@click.stop="
				() => {
					//
				}
			">
			<div
				class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 pt-0 pb-3 px-4 md:!rounded-[16px] rounded-t-[19px] items-center justify-center">
				<div class="w-full text-center hidden md:!inline-block">
					<SofaHeaderText customClass="!text-xl !font-bold" content="Add a quiz" />
				</div>

				<div class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden">
					<SofaNormalText customClass="!font-bold !text-base"> Add a quiz </SofaNormalText>
					<SofaIcon customClass="h-[16px]" name="circle-close" @click="showAddQuiz = false" />
				</div>

				<div class="w-full flex flex-col gap-4">
					<SofaSelect
						ref="quiz"
						v-model="selectedQuiz"
						customClass="rounded-custom !bg-lightGray"
						name="Quiz"
						placeholder="Quiz"
						:rules="[Logic.Form.RequiredRule]"
						borderColor="border-transparent"
						:options="allQuizzes"
						:hasTitle="true">
						<template #title> Choose a quiz </template>
					</SofaSelect>

					<div v-if="!selectedQuiz" class="w-full flex flex-row items-center justify-center py-3">
						<SofaButton padding="px-5 py-2" @click="Logic.Common.GoToRoute('/quiz/create')"> Create a quiz </SofaButton>
					</div>

					<div class="w-full flex flex-row items-center justify-between z-[50] bg-white">
						<SofaButton
							padding="px-5 py-2"
							bgColor="bg-white"
							textColor="text-grayColor"
							customClass="border border-gray-100 hidden mdlg:!inline-block"
							@click.prevent="showAddQuiz = false">
							Exit
						</SofaButton>

						<div class="mdlg:!w-auto w-full">
							<SofaButton
								padding="px-5 py-2"
								customClass="mdlg:!w-auto w-full"
								@click="selectedQuiz ? handleAddQuiz() : null">
								Add
							</SofaButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	</SofaModalOld>
</template>
<script lang="ts">
import { capitalize, defineComponent, onMounted, ref, watch } from 'vue'
import AddVideo from './AddVideo.vue'
import { addCourseFile, addCourseFileForm, addQuizToCourse } from '@app/composables/course'
import { Conditions, Logic } from 'sofa-logic'

export default defineComponent({
	name: 'NewCourseMaterial',
	components: { AddVideo },
	props: {
		customClass: {
			type: String,
			default: '',
		},
	},
	emits: ['OnItemSelected'],
	setup(props, context) {
		const SingleCourse = ref(Logic.Study.SingleCourse!)
		const AllQuzzies = ref(Logic.Study.AllQuzzies!)

		const newMaterialOptions: { name: string; type: string; icon: IconName }[] = [
			{
				name: 'Quiz',
				type: 'quiz',
				icon: 'quiz-course',
			},
			{
				name: 'Image',
				type: 'image',
				icon: 'image-course',
			},
			{
				name: 'Document',
				type: 'document',
				icon: 'document-course',
			},
			{
				name: 'Video',
				type: 'video',
				icon: 'video-course',
			},
		]

		const videoFile = ref()
		const imageFile = ref()
		const documentFile = ref()

		const allQuizzes = ref<{ key: string; value: string }[]>([])

		const setQuizzes = () => {
			allQuizzes.value.length = 0
			AllQuzzies.value.results.forEach((quiz) => {
				const canAddQuiz = quiz.user.id === Logic.Common.AuthUser?.id && quiz.courseId === null
				if (canAddQuiz)
					allQuizzes.value.push({
						key: quiz.id,
						value: quiz.title,
					})
			})
		}

		const showAddVideo = ref(false)

		const showAddQuiz = ref(false)

		const selectedQuiz = ref('')

		const handleShowAddVideo = () => {
			if (Logic.Common.isLarge) showAddVideo.value = true
			else context.emit('OnItemSelected', 'video')
		}

		const addFile = (file: File, type: 'video' | 'image' | 'document') => {
			addCourseFileForm.description = `${capitalize(type)} file for ${SingleCourse.value.title}`
			addCourseFileForm.media = file
			addCourseFileForm.tagIds = []
			addCourseFileForm.title = `${file.name}`
			addCourseFileForm.topicId = SingleCourse.value.topicId

			addCourseFile()
			context.emit('OnItemSelected', '')
		}

		const handleAddQuiz = () => {
			addQuizToCourse(selectedQuiz.value)
			showAddQuiz.value = false
			context.emit('OnItemSelected', '')
		}

		watch(videoFile, () => {
			addFile(videoFile.value, 'video')
		})
		watch(imageFile, () => {
			addFile(imageFile.value, 'image')
		})

		watch(documentFile, () => {
			addFile(documentFile.value, 'document')
		})

		onMounted(() => {
			setQuizzes()
			Logic.Study.watchProperty('AllQuzzies', AllQuzzies)
			Logic.Study.watchProperty('SingleCourse', SingleCourse)
			Logic.Study.GetQuizzes({
				where: [
					{
						field: 'user.id',
						value: Logic.Common.AuthUser?.id,
						condition: Conditions.eq,
					},
				],
			}).then(() => {
				setQuizzes()
			})
		})

		watch(AllQuzzies, () => {
			setQuizzes()
		})

		return {
			Logic,
			newMaterialOptions,
			showAddVideo,
			handleShowAddVideo,
			videoFile,
			imageFile,
			documentFile,
			showAddQuiz,
			allQuizzes,
			addQuizToCourse,
			selectedQuiz,
			handleAddQuiz,
		}
	},
})
</script>
