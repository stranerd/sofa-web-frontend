<template>
  <sofa-form-wrapper :parentRefs="{}" ref="formComp" class="w-full h-full flex flex-col gap-4 text-grayColor">
    <div class="flex flex-col flex-grow overflow-y-auto gap-4">
      <div class="w-full md:grid md:grid-cols-2 flex flex-col-reverse gap-4">
        <div class="col-span-1 w-full flex flex-col gap-3">
          <SofaTextField custom-class="rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor" padding="md:!p-4 p-3" type="text" name="Title"
            v-model="factory.title" placeholder="Title" borderColor="border-transparent" :error="factory.errors.title"  />

          <SofaTextarea :hasTitle="false"
            :textAreaStyle="'h-[60px] rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
            placeholder="Description" v-model="factory.description" :error="factory.errors.description" />

          <SofaSelect custom-class="rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor"
            :padding="'md:p-4 p-3'" name="Topic" placeholder="Topic"
            :autoComplete="true" borderColor="border-transparent" :error="factory.errors.topic"
            :options="topics.map((t) => ({ key: t.title, value: t.title }))" :canUseCustom="true" v-model="factory.topic" />
        </div>

        <div class="col-span-1 flex flex-col w-full pb-4 md:!pb-0">
          <SofaImageLoader customClass="w-full md:!h-full h-[220px] rounded-custom relative" :photoUrl="quizImageUrl ? quizImageUrl : '/images/default.png'">
            <div class="absolute bottom-0 left-0 pb-3 flex w-full items-center justify-center">
              <SofaFileAttachment :isWrapper="true" v-model="factory.photo" accept="image/png, image/gif, image/jpeg" v-model:localFileUrl="quizImageUrl">
                <template v-slot:content>
                  <div class="p-3 flex items-center justify-center gap-2 rounded-custom bg-deepGray bg-opacity-50">
                    <SofaIcon class="h-[18px]" name="camera-white" />
                    <SofaNormalText color="text-white" content="Add cover photo" />
                  </div>
                </template>
              </SofaFileAttachment>
            </div>
          </SofaImageLoader>
        </div>
      </div>

      <div class="w-full flex flex-col gap-2">
        <sofa-text-field :custom-class="'rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-4'" :name="'Tags'" ref="tags"
          :placeholder="'Tags (Comma separated for multiple)'" :borderColor="'border-transparent'"
          v-model="quizSettingsForm.tagString" />
        <div class="w-full flex flex-row flex-wrap items-center">
          <template v-for="(item, index) in quizSettingsForm.tags" :key="index">
            <div class="py-2 pr-2" v-if="item != 'Not set'">
              <div class="py-2 px-3 border-2 flex flex-row items-center gap-2 rounded-custom border-[#E1E6EB]">
                <sofa-normal-text :color="'text-[#78828C]'">
                  {{ item }}
                </sofa-normal-text>
                <sofa-icon @click="
                  quizSettingsForm.tags = quizSettingsForm.tags.filter(
                    (tag) => item != tag
                  )
                  " :name="'circle-close'" :customClass="'h-[17px] cursor-pointer'"></sofa-icon>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div v-if="isAdmin" class="flex gap-2 items-center">
        <span class="whitespace-nowrap">Is tutor assessments?</span>
        <SofaCheckbox v-model="factory.isForTutors" />
      </div>
    </div>

    <div class="w-full flex items-center justify-between bg-white mdlg:p-0 py-4">
      <SofaButton padding="px-5 py-2" bgColor="bg-white" textColor="text-grayColor" customClass="border border-gray-100 hidden mdlg:inline-block"
        @click.prevent="close">
        Exit
      </SofaButton>

      <div class="mdlg:w-auto w-full flex gap-3 items-center">
        <div class="mdlg:!w-auto w-full flex flex-col">
          <SofaButton :disabled="!factory.valid" padding="px-5 mdlg:py-2 py-3" customClass="mdlg:!w-auto w-full"
            @click.prevent="emits('updateQuiz')">
            Save
          </SofaButton>
        </div>
        <div class="mdlg:!w-auto w-full flex flex-col">
          <SofaButton :disabled="!factory.valid" padding="px-5 mdlg:py-2 py-3" customClass="mdlg:!w-auto w-full"
            v-if="quiz.status !== 'published'" @click.prevent="emits('publishQuiz')">
            Publish
          </SofaButton>
        </div>
      </div>
    </div>
  </sofa-form-wrapper>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import {
  allGenericTags,
  getGenericTags,
} from "@/composables/course"
import { useTopicsList } from '@/composables/interactions/tags'
import {
  quizSettingSaved,
  quizSettingsForm,
} from "@/composables/quiz"
import { Logic, Quiz, QuizFactory } from "sofa-logic"
import {
  SofaButton,
  SofaCheckbox,
  SofaFileAttachment,
  SofaFormWrapper,
  SofaIcon,
  SofaImageLoader,
  SofaNormalText,
  SofaSelect,
  SofaTextField,
  SofaTextarea,
} from "sofa-ui-components"
import { PropType, defineEmits, defineProps, onMounted, ref, watch } from "vue"

const props = defineProps({
  quiz: {
    type: Object as PropType<Quiz>,
    required: true
  },
  factory: {
    type: Object as PropType<QuizFactory>,
    required: true
  },
  close: {
    type: Function as PropType<() => void>,
    required: true
  },
})

const emits = defineEmits(["OnQuizUpdated", "updateQuiz", "publishQuiz"])

const { isAdmin } = useAuth()
const quizImageUrl = ref(props.quiz.photo?.link ?? '')

const { topics } = useTopicsList()

watch(topics, () => {
  console.log(topics.value)
  console.log(props.factory.topicId, props.factory.topic)
  if (!topics.value.length) return
  if (props.factory.topicId && !props.factory.topic) {
    const topic = topics.value.find((t) => t.id === props.factory.topicId)
    console.log(topic)
    if (topic) props.factory.topic = topic.title
  }
})

const formComp = ref<any>()

const defaultTags = ref([])

const preventUpdate = ref(true)


watch(quizSettingSaved, () => {
  if (!preventUpdate.value) {
    emits("OnQuizUpdated", quizSettingSaved)
  }
})

const setDefaultValues = () => {
  if (props.quiz) {
    const quiz = props.quiz
    quizSettingsForm.title = quiz.title
    quizSettingsForm.description = quiz.description
    quizSettingsForm.isForTutors = quiz.isForTutors
    quizSettingsForm.tags = quiz.tagIds.map((id) =>
      Logic.Study.GetTagName(id)
    )
    defaultTags.value = quiz.tagIds.map((id) => Logic.Study.GetTagName(id))
    quizSettingsForm.topic = Logic.Study.GetTagName(quiz.topicId)
    quizImageUrl.value = quiz.photo?.link || ""
    setTimeout(() => {
      formComp.value.fieldsToValidate?.tags.emptyValue()
      quizSettingsForm.tagString = ""
    }, 300)
  } else {
    quizSettingsForm.title = ""
    quizSettingsForm.description = ""
    quizSettingsForm.isForTutors = false
    quizSettingsForm.tags = []
    quizSettingsForm.topic = ""
    quizImageUrl.value = ""

    setTimeout(() => {
      formComp.value.fieldsToValidate?.Visibility.emptyValue()
      formComp.value.fieldsToValidate?.title.emptyValue()
      formComp.value.fieldsToValidate?.topic.emptyValue()
      formComp.value.fieldsToValidate?.description.emptyValue()
    }, 500)
  }
}

watch(allGenericTags, () => {
  setDefaultValues()
})

onMounted(() => {
  getGenericTags()
  setDefaultValues()
  setTimeout(() => {
    preventUpdate.value = false
  }, 3000)
})
</script>
