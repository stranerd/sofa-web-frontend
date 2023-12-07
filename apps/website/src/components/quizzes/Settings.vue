<template>
  <sofa-form-wrapper :parentRefs="{}" class="w-full h-full flex flex-col gap-4 text-grayColor !placeholder:text-grayColor">
    <div class="flex flex-col flex-grow overflow-y-auto gap-4">
      <div class="w-full md:grid md:grid-cols-2 flex flex-col-reverse gap-4">
        <div class="col-span-1 w-full flex flex-col gap-3">
          <SofaTextField custom-class="rounded-custom !bg-lightGrayVaraint" padding="md:!p-4 p-3" type="text" name="Title"
            v-model="factory.title" placeholder="Title" borderColor="border-transparent" :error="factory.errors.title"  />

          <SofaTextarea :hasTitle="false" :rows="4"
            textAreaStyle="rounded-custom !bg-lightGrayVaraint md:p-4 p-3 resize-none"
            placeholder="Description" v-model="factory.description" :error="factory.errors.description" />

          <SofaSelect customClass="rounded-custom !bg-lightGrayVaraint !placeholder:text-grayColor"
            padding="md:p-4 p-3" name="Topic" placeholder="Topic"
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
        <SofaTextField customClass="rounded-custom !bg-lightGrayVaraint"
          padding="md:p-4 p-3" name="Tags"
          placeholder="Tags (Comma separated for multiple)" borderColor="border-transparent"
          v-model="factory.tagString" />
        <div class="w-full flex flex-wrap gap-2 items-center">
          <template v-for="(item, index) in factory.tags" :key="index">
            <div class="p-2 border-2 flex items-center gap-2 rounded-custom border-[#E1E6EB]">
              <SofaNormalText color="text-[#78828C]" :content="item" />
              <SofaIcon @click="factory.removeTag(index)" name="circle-close" class="h-[17px] cursor-pointer" />
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
        <SofaButton :disabled="!factory.valid" padding="px-5 mdlg:py-2 py-3" class="mdlg:!w-auto w-full" customClass="w-full"
          @click.prevent="emits('updateQuiz')">
          Save
        </SofaButton>
        <SofaButton :disabled="!factory.valid" padding="px-5 mdlg:py-2 py-3" class="mdlg:!w-auto w-full" customClass="w-full"
          v-if="quiz.status !== 'published'" @click.prevent="emits('publishQuiz')">
          Publish
        </SofaButton>
      </div>
    </div>
  </sofa-form-wrapper>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useGenericTagsList, useTopicsList } from '@/composables/interactions/tags'
import { Quiz, QuizFactory } from "sofa-logic"
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
import { PropType, defineEmits, defineProps, ref, watch } from "vue"

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

const emits = defineEmits(["updateQuiz", "publishQuiz"])

const { isAdmin } = useAuth()
const quizImageUrl = ref(props.quiz.photo?.link ?? '')

const { topics } = useTopicsList()
const { tags } = useGenericTagsList()

const loadTopic = () => {
  if (!topics.length) return
  if (props.factory.topicId && !props.factory.topic) {
    const topic = topics.find((t) => t.id === props.factory.topicId)
    if (topic) props.factory.topic = topic.title
  }
}

const loadTags = () => {
  if (!tags.length) return
  if (props.factory.tagIds.length && !props.factory.tags.length) {
    const myTags = tags.filter((t) => props.factory.tagIds.includes(t.id))
    props.factory.tags = props.factory.tagIds
      .map((t) => myTags.find((mt) => t === mt.id)?.title)
      .filter(Boolean)
  }
}

watch(topics, loadTopic)
watch(tags, loadTags)

loadTopic()
loadTags()
</script>
