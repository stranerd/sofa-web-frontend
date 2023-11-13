<template>
  <div class="w-full flex flex-col gap-4">
    <div class="w-full grid grid-cols-2 h-full md:!gap-6 gap-3">
      <template v-for="(item, index) in newMaterialOptions" :key="index">
        <div v-if="item.type == 'quiz'" @click="showAddQuiz = true"
          class="col-span-1 custom-border md:!h-[280px] h-[120px] border-[#E1E6EB] border-[2px] flex flex-col gap-3 items-center justify-center cursor-pointer">
          <sofa-icon :name="item.icon" :customClass="'h-[22px]'"> </sofa-icon>
          <sofa-normal-text :customClass="'!font-bold'">
            {{ item.name }}
          </sofa-normal-text>
        </div>

        <sofa-file-attachment v-if="item.type == 'image'" :isWrapper="true" :customClass="'col-span-1 flex flex-col'"
          :accept="'image/png, image/gif, image/jpeg'" v-model="imageFile">
          <template v-slot:content>
            <div
              class="w-full custom-border md:!h-[280px] h-[120px] border-[#E1E6EB] border-[2px] flex flex-col gap-3 items-center justify-center cursor-pointer">
              <sofa-icon :name="item.icon" :customClass="'h-[22px]'">
              </sofa-icon>
              <sofa-normal-text :customClass="'!font-bold'">
                {{ item.name }}
              </sofa-normal-text>
            </div>
          </template>
        </sofa-file-attachment>

        <sofa-file-attachment v-if="item.type == 'document'" :isWrapper="true" :customClass="'col-span-1 flex flex-col'"
          :accept="'application/pdf'" v-model="documentFile">
          <template v-slot:content>
            <div
              class="w-full custom-border md:!h-[280px] h-[120px] border-[#E1E6EB] border-[2px] flex flex-col gap-3 items-center justify-center cursor-pointer">
              <sofa-icon :name="item.icon" :customClass="'h-[22px]'">
              </sofa-icon>
              <sofa-normal-text :customClass="'!font-bold'">
                {{ item.name }}
              </sofa-normal-text>
            </div>
          </template>
        </sofa-file-attachment>

        <sofa-file-attachment v-if="item.type == 'video'" :isWrapper="true" :customClass="'col-span-1 flex flex-col'"
          :accept="'video/mp4'" v-model="videoFile">
          <template v-slot:content>
            <div
              class="w-full custom-border md:!h-[280px] h-[120px] border-[#E1E6EB] border-[2px] flex flex-col gap-3 items-center justify-center cursor-pointer">
              <sofa-icon :name="item.icon" :customClass="'h-[22px]'">
              </sofa-icon>
              <sofa-normal-text :customClass="'!font-bold'">
                {{ item.name }}
              </sofa-normal-text>
            </div>
          </template>
        </sofa-file-attachment>

        <!-- <div
          v-if="item.type == 'video'"
          :customClass="'col-span-1 flex flex-col'"
          @click="handleShowAddVideo()"
        >
          <div
            class="w-full custom-border md:!h-[280px] h-[120px] border-[#E1E6EB] border-[2px] flex flex-col gap-3 items-center justify-center cursor-pointer"
          >
            <sofa-icon :name="item.icon" :customClass="'h-[22px]'"> </sofa-icon>
            <sofa-normal-text :customClass="'!font-bold'">
              {{ item.name }}
            </sofa-normal-text>
          </div>
        </div> -->
      </template>
    </div>
  </div>
  <sofa-modal v-if="showAddVideo" :close="() => {
    showAddVideo = false
  }
    ">
    <div class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full w-full h-[95%] md:w-[70%] flex flex-col items-center relative"
      @click.stop="() => {
        //
      }
        ">
      <div
        class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 py-4 px-4 rounded-[16px] items-center justify-center">
        <sofa-header-text :customClass="'text-xl'">Add video</sofa-header-text>

        <add-video />
      </div>
    </div>
  </sofa-modal>

  <!-- Add question modal -->
  <sofa-modal v-if="showAddQuiz" :close="() => {
    showAddQuiz = false
  }
    " :canClose="false">
    <div
      class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] w-full flex flex-col justify-end md:!justify-start items-center relative"
      @click.stop="() => {
        //
      }
        ">
      <div
        class="bg-white w-full flex flex-col lg:!px-6 gap-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 pt-0 pb-3 px-4 md:!rounded-[16px] rounded-t-[19px] items-center justify-center">
        <div class="w-full text-center hidden md:!inline-block">
          <sofa-header-text :customClass="'!text-xl !font-bold '">Add a quiz</sofa-header-text>
        </div>

        <div class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden">
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            Add a quiz
          </sofa-normal-text>
          <sofa-icon :customClass="'h-[16px]'" :name="'circle-close'" @click="showAddQuiz = false" />
        </div>

        <div class="w-full flex flex-col gap-4">
          <sofa-select :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'md:!py-4 md:!px-4 px-3 py-3'" :name="'Quiz'" ref="quiz" :placeholder="'Quiz'"
            :rules="[FormValidations.RequiredRule]" :autoComplete="false" :borderColor="'border-transparent'"
            :options="allQuizzes" :hasTitle="true" v-model="selectedQuiz">
            <template v-slot:title> Choose a quiz </template>
          </sofa-select>

          <div class="w-full flex flex-row items-center justify-center py-3" v-if="!selectedQuiz">
            <sofa-button :padding="'px-5 py-2'" @click="Logic.Common.GoToRoute('/quiz/create')">
              Create a quiz
            </sofa-button>
          </div>

          <div class="w-full flex flex-row items-center justify-between z-[50] bg-white">
            <sofa-button :padding="'px-5 py-2'" :bgColor="'bg-white'" :textColor="'text-grayColor'"
              :customClass="'border-[1px] border-gray-100 hidden mdlg:!inline-block'"
              @click.prevent="showAddQuiz = false">
              Exit
            </sofa-button>

            <div class="mdlg:!w-auto w-full">
              <sofa-button :padding="'px-5 py-2'" :customClass="'mdlg:!w-auto w-full'"
                @click="selectedQuiz ? handleAddQuiz() : null">
                Add
              </sofa-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </sofa-modal>
</template>
<script lang="ts">
import { capitalize, defineComponent, onMounted, ref, watch } from "vue"
import {
  SofaIcon,
  SofaModal,
  SofaNormalText,
  SofaFileAttachment,
  SofaHeaderText,
  SofaSelect,
  SofaButton,
} from "sofa-ui-components"
import { Logic } from "sofa-logic"
import { FormValidations } from "@/composables"
import AddVideo from "./AddVideo.vue"
import { addCourseFileForm, addQuizToCourse } from "@/composables/course"
import { addCourseFile } from "@/composables/course"
import { Conditions } from "sofa-logic/src/logic/types/common"

export default defineComponent({
  components: {
    SofaIcon,
    SofaModal,
    SofaNormalText,
    SofaFileAttachment,
    AddVideo,
    SofaHeaderText,
    SofaSelect,
    SofaButton,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
  },
  name: "NewCourseMaterial",
  emits: ["OnItemSelected"],
  setup (props, context) {
    const SingleCourse = ref(Logic.Study.SingleCourse)
    const AllQuzzies = ref(Logic.Study.AllQuzzies)

    const newMaterialOptions = [
      {
        name: "Quiz",
        type: "quiz",
        icon: "quiz-course",
      },
      {
        name: "Image",
        type: "image",
        icon: "image-course",
      },
      {
        name: "Document",
        type: "document",
        icon: "document-course",
      },
      {
        name: "Video",
        type: "video",
        icon: "video-course",
      },
    ]

    const videoFile = ref()
    const imageFile = ref()
    const documentFile = ref()

    const allQuizzes = ref([])

    const setQuizzes = () => {
      allQuizzes.value.length = 0
      AllQuzzies.value.results.forEach((quiz) => {
        if (quiz.status != "published") {
          allQuizzes.value.push({
            key: quiz.id,
            value: quiz.title,
          })
        }
      })
    }

    const showAddVideo = ref(false)

    const showAddQuiz = ref(false)

    const selectedQuiz = ref("")

    const handleShowAddVideo = () => {
      if (Logic.Common.isLarge) showAddVideo.value = true
      else context.emit("OnItemSelected", "video")
    }

    const addFile = (file: Blob, type: "video" | "image" | "document") => {
      addCourseFileForm.description = `${capitalize(type)} file for ${SingleCourse.value.title
        }`
      addCourseFileForm.media = file
      addCourseFileForm.tagIds = []
      addCourseFileForm.title = `${file.name}`
      addCourseFileForm.topicId = SingleCourse.value.topicId

      addCourseFile()
      context.emit("OnItemSelected", "")
    }

    const handleAddQuiz = () => {
      addQuizToCourse(selectedQuiz.value)
      showAddQuiz.value = false
      context.emit("OnItemSelected", "")
    }

    watch(videoFile, () => {
      addFile(videoFile.value, "video")
    })
    watch(imageFile, () => {
      addFile(imageFile.value, "image")
    })

    watch(documentFile, () => {
      addFile(documentFile.value, "document")
    })

    onMounted(() => {
      setQuizzes()
      Logic.Study.watchProperty("AllQuzzies", AllQuzzies)
      Logic.Study.watchProperty("SingleCourse", SingleCourse)
      Logic.Study.GetQuizzes({
        where: [
          {
            field: "user.id",
            value: Logic.Auth.AuthUser?.id,
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
      FormValidations,
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
