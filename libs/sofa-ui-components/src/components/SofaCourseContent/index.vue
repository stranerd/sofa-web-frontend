<template>
  <div class="flex flex-col h-full w-full relative pb-4">
    <div class="flex flex-col w-full gap-2 py-4 px-4 border-[#F1F6FA] border-t-[1px]"
      v-for="(option, index) in sectionOptions" :key="index">
      <template v-if="option">
        <template v-if="option.name != 'unsectioned'">
          <div class="w-full flex flex-row items-center justify-between cursor-pointer px-1" @click="
            option?.opened ? (option.opened = false) : (option.opened = true)
          selectedSection = index;
          ">
            <div class="flex flex-row items-center gap-2">
              <sofa-normal-text :customClass="'!font-bold'">{{
                option.name
              }}</sofa-normal-text>
            </div>
            <div class="md:flex flex-row items-center gap-3 hidden">
              <sofa-icon :customClass="'h-[7px] cursor-pointer'" :name="option.opened ? 'chevron-up' : 'chevron-down'" />
            </div>
          </div>
        </template>

        <template v-if="option.opened">
          <div class="w-full gap-1">
            <!-- For larger screens -->
            <template v-if="!Logic.Common.isOnlyMobile">
              <div v-for="(material, index) in option.materials" :key="index" :class="`w-fill flex flex-col gap-1 ${lockContent ? 'opacity-80' : ''
                } rounded-[8px] px-3 py-3 cursor-pointer ${selectedMaterial?.id == material.id
                  ? 'bg-lightBlue'
                  : 'bg-white'
                }  hover:bg-lightBlue `" @click.stop="selectItem(material)">
                <div class="w-full flex flex-row justify-between items-center">
                  <sofa-normal-text :customClass="'!text-left !line-clamp-1'">
                    {{ material.name }}
                  </sofa-normal-text>
                  <sofa-icon :customClass="'h-[18px]'" v-if="!lockContent" :name="itemIsStudied(material.id) ? 'selected' : 'not-selected'
                    " />
                  <sofa-icon :customClass="'h-[25px]'" v-else :name="'locked-content'" />
                </div>
                <div class="w-full flex flex-row gap-2 items-center">
                  <div class="flex flex-row items-center gap-1">
                    <sofa-icon :customClass="'h-[17px]'" :name="material.type" />
                    <sofa-normal-text :color="'text-grayColor'" :customClass="'!text-left !capitalize'">
                      {{ material.type.split("-")[0] }}
                    </sofa-normal-text>
                  </div>

                  <!-- <span class="w-[5px] h-[5px] rounded-full bg-grayColor"> </span> -->
                </div>
              </div>
            </template>
            <template v-else>
              <div class="w-full flex flex-col gap-3 pt-2">
                <div v-for="(material, index) in option.materials" :key="index"
                  class="w-full flex flex-row gap-3 items-center py-1 hover:bg-lightBlue"
                  @click.stop="selectItem(material)">
                  <sofa-icon :customClass="'h-[18px]'" :name="material.type" />
                  <sofa-normal-text :customClass="'!text-left !line-clamp-1'" :color="'text-[#141618]'">
                    {{ material.name }}
                  </sofa-normal-text>
                </div>
              </div>
            </template>
          </div>
        </template>
      </template>
    </div>
  </div>
  <!-- <div
    class="sticky bottom-0 left-0 w-full flex flex-col gap-1 bg-white z-50 py-4 border-t-[1px] border-[#F1F6FA] px-4"
    v-if="sectionOptions.length"
  >
    <sofa-normal-text :customClass="'!font-bold'">
      Your progress
    </sofa-normal-text>
    <div class="w-full flex flex-col py-1">
      <div class="w-full bg-[#E1E6EB] rounded-[8px] h-[8px] relative">
        <div
          class="h-full absolute top-0 left-0 rounded-[8px] bg-primaryOrange"
          :style="`width: ${
            (studiedMaterial /
              Logic.Common.SumArray(
                sectionOptions.map((item) => item.materials.length)
              )) *
            100
          }%;`"
        ></div>
      </div>
    </div>
    <sofa-normal-text :color="'text-grayColor'">
      {{ studiedMaterial + "/"
      }}{{
        Logic.Common.SumArray(
          sectionOptions.map((item) => item.materials.length)
        )
      }}
      materials studied
    </sofa-normal-text>
  </div> -->
</template>
<script lang="ts">
import {
  capitalize,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch
} from "vue"
import { Logic, ContentDetails, Course, Question, Quiz, SofaFile } from "sofa-logic"
import SofaAvatar from "../SofaAvatar"
import SofaIcon from "../SofaIcon"
import SofaImageLoader from "../SofaImageLoader"
import SofaRatings from "../SofaRatings"
import { SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaImageLoader,
    SofaRatings,
    SofaAvatar,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    close: {
      type: Function,
      required: false,
    },
    modelValue: {
      type: Object as () => any,
    },
    lockContent: {
      type: Boolean,
      required: false,
    },
  },
  emits: ["update:modelValue", "OnMaterialSelected", "onCourseContentSet"],
  name: "SofaCourseContent",
  setup (props, context) {
    const selectedSection = ref(0)

    const SingleCourse = ref<Course>(Logic.Study.SingleCourse)
    const SingleCourseFiles = ref<SofaFile[]>(Logic.Study.SingleCourseFiles)
    const SingleCourseQuizzes = ref<Quiz[]>(Logic.Study.SingleCourseQuizzes)

    const sectionOptions = reactive([])

    const staticSectionOptions = ref([])

    const studiedMaterial = ref(0)

    const selectedMaterial = ref<any>()

    const selectItem = (material: any) => {
      selectedMaterial.value = {
        id: material.id,
        data: material.data,
        details: material.details,
        type: material.type.split("-")[0],
        name: material.name,
      }
      handleItemSelected()
    }

    const itemIsStudied = (materialId: string) => {
      return localStorage.getItem(
        `course_${SingleCourse.value.id}_material_${materialId}`
      )
    }

    const setStudiesMaterial = () => {
      let savedMaterial = 0

      sectionOptions.forEach((option) => {
        option.materials.forEach((material) => {
          if (itemIsStudied(material.id)) {
            savedMaterial++
          }
        })
      })
      studiedMaterial.value = savedMaterial
    }

    watch(SingleCourse, () => {
      if (sectionOptions.length < SingleCourse.value.sections.length) {
        setSections(SingleCourse.value.sections.length - 1)
      }
    })

    watch(selectedMaterial, () => {
      context.emit("update:modelValue", selectedMaterial.value)
    })

    const handleItemSelected = () => {
      context.emit("OnMaterialSelected", selectedMaterial.value)
      if (
        selectedMaterial.value.type == "document" ||
        selectedMaterial.value.type == "image" ||
        selectedMaterial.value.type == "video"
      ) {
        localStorage.setItem(
          `course_${SingleCourse.value.id}_material_${selectedMaterial.value.id}`,
          "done"
        )
      }
      setStudiesMaterial()
    }

    const saveSectionToLocalStorage = (autoLoad = false) => {
      if (!autoLoad) {
        localStorage.setItem(
          "course_content_sections" + SingleCourse.value.id,
          JSON.stringify(staticSectionOptions.value)
        )
      }

      const sectionOptionsData = JSON.parse(
        localStorage.getItem("course_content_sections" + SingleCourse.value.id)
      )
      sectionOptions.length = 0
      sectionOptions.push(...sectionOptionsData)

      setStudiesMaterial()
    }

    const setSectionMaterial = (
      mediaFile: SofaFile | undefined,
      quiz: Quiz | undefined,
      save = false,
      index: number
    ) => {
      if (mediaFile) {
        const mediaUrl = `${Logic.Common.apiUrl}/study/files/${mediaFile.id
          }/media?AccessToken=${JSON.parse(localStorage.getItem("AuthTokens")).accessToken
          }`
        if (mediaFile.type == "image") {
          staticSectionOptions.value[index].materials.push({
            name: mediaFile.title,
            id: mediaFile.id,
            type: "image-course",
            details: {
              title: mediaFile.title,
              description: mediaFile.description,
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

        if (mediaFile.type == "video") {
          staticSectionOptions.value[index].materials.push({
            name: mediaFile.title,
            id: mediaFile.id,
            type: "video-course",
            hover: false,
            details: {
              title: mediaFile.title,
              link: mediaUrl,
              duration: "4m 44s",
              description: mediaFile.description,
              id: mediaFile.id,
            },
            data: {
              zoom: 100,
              fullScreen: false,
              videoUrl: mediaUrl,
            },
          })
        }

        if (mediaFile.type == "document") {
          staticSectionOptions.value[index].materials.push({
            name: mediaFile.title,
            id: mediaFile.id,
            type: "document-course",
            hover: false,
            details: {
              title: mediaFile.title,
              pages: "3",
              description: mediaFile.description,
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
      }

      if (quiz) {
        const allRequests: Promise<any>[] = []

        if (!props.lockContent) {
          allRequests.push(
            new Promise((resolve) => {
              Logic.Study.GetQuestions(quiz.id)
                .then((response) => {
                  if (response) {
                    const questions: Question[] = response.results ?? []

                    const allQuestions = questions.map((eachQuestion) => {
                      let answers = ""

                      if (eachQuestion.data.type == "multipleChoice") {
                        answers =
                          eachQuestion.data.options[
                          eachQuestion.data.answers[0]
                          ]
                      } else if (eachQuestion.data.type == "trueOrFalse") {
                        answers = `${capitalize(
                          eachQuestion.data.answer.toString()
                        )}`
                      } else if (
                        eachQuestion.data.type == "writeAnswer" ||
                        eachQuestion.data.type == "sequence" ||
                        eachQuestion.data.type == "dragAnswers" ||
                        eachQuestion.data.type == "fillInBlanks"
                      ) {
                        answers = capitalize(
                          eachQuestion.data.answers?.join(", ")
                        )
                      } else if (eachQuestion.data.type == "match") {
                        answers = capitalize(
                          eachQuestion.data.set
                            .map((item) => {
                              return item.a
                            })
                            .join(", ")
                        )
                      }
                      return {
                        type: Logic.Study.questionTypes[eachQuestion.data.type]
                          .type,
                        duration:
                          Logic.Common.EquivalentsSecondsInString[
                          `${eachQuestion.timeLimit}`
                          ],
                        content: eachQuestion.question,
                        answer: answers,
                      }
                    })

                    const contentDetails = reactive<ContentDetails>(
                      Logic.Study.contentDetails
                    )

                    contentDetails.title = quiz.title
                    contentDetails.id = quiz.id
                    contentDetails.price = 0
                    contentDetails.image = quiz.photo
                      ? quiz.photo.link
                      : "/images/default.png"
                    contentDetails.info = quiz.description
                    contentDetails.lastUpdated = `Last updated ${Logic.Common.momentInstance(
                      quiz.updatedAt
                    ).format("DD/MM/YYYY")}`
                    contentDetails.tags = quiz.tagIds.map((id) => {
                      return Logic.Study.GetTagName(id)
                    })
                    contentDetails.user.name = quiz.user.bio.name.full
                    contentDetails.user.photoUrl = quiz.user.bio.photo
                      ? quiz.user.bio.photo.link
                      : ""

                    contentDetails.content.materialsCount =
                      quiz.questions.length

                    contentDetails.labels = {
                      color: "purple",
                      main: "Quiz",
                      sub: `${quiz.questions.length} question${quiz.questions.length > 1 ? "s" : ""
                        }`,
                    }

                    contentDetails.questions = allQuestions

                    staticSectionOptions.value[index].materials.push({
                      name: quiz.title,
                      id: quiz.id,
                      type: "quiz-course",
                      data: contentDetails,
                      hover: false,
                    })

                    resolve("")
                  }
                })
                .catch(() => {
                  staticSectionOptions.value[index].materials.push({
                    name: quiz.title,
                    id: quiz.id,
                    type: "quiz-course",
                    data: [],
                    hover: false,
                  })
                })
            })
          )
        } else {
          staticSectionOptions.value[index].materials.push({
            name: quiz.title,
            id: quiz.id,
            type: "quiz-course",
            data: [],
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

    const setSections = (index = 0) => {
      staticSectionOptions.value.length = 0
      selectedSection.value = index

      if (
        localStorage.getItem("course_content_sections" + SingleCourse.value.id)
      ) {
        saveSectionToLocalStorage(true)
      }

      let hasQuiz = false

      SingleCourse.value.sections.forEach((section, index) => {
        staticSectionOptions.value.push({
          name: section.label,
          id: Logic.Common.makeid(9),
          materials: [],
          opened: index == selectedSection.value,
          edit: false,
        })

        section.items.map((item) => {
          if (item.type == "quiz") {
            const quizData = SingleCourseQuizzes.value.filter(
              (quiz) => quiz.id == item.id
            )
            if (quizData.length) {
              setSectionMaterial(undefined, quizData[0], false, index)
            }
            hasQuiz = true
          } else {
            const fileData = SingleCourseFiles.value.filter(
              (file) => file.id == item.id
            )
            setSectionMaterial(fileData[0], undefined, false, index)
          }
        })
      })

      if (!hasQuiz) {
        saveSectionToLocalStorage()
      }
    }

    watch(sectionOptions, () => {
      context.emit("onCourseContentSet", sectionOptions)
    })
    onMounted(() => {
      if (SingleCourse.value) {
        setSections()
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
                  type: sectionOptions[0].materials[0].type.split("-")[0],
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
      studiedMaterial,
      selectItem,
    }
  },
})
</script>
