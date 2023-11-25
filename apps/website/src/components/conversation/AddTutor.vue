<template>
  <!-- add tutor -->
  <sofa-modal :close="() => close?.()" :can-close="false">
    <div
      class="mdlg:!w-[60%] lg:!w-[50%] w-full mdlg:!h-[80%] md:!h-[70%] overflow-y-hidden md:w-[70%] h-[90%] flex flex-col items-center relative"
      @click.stop="() => { }">
      <div class="bg-white w-full flex flex-col h-full gap-3 mdlg:!px-6 md:!px-4 md:!rounded-[16px] rounded-t-[16px]">
        <div class="flex flex-col gap-3 md:gap-4 flex-grow overflow-y-auto">
          <div
            class="w-full hidden flex-col gap-2 justify-center items-center md:flex sticky top-0 left-0 pt-4 bg-white z-50"
            v-if="!Logic.Common.isOnlyMobile">
            <sofa-header-text :customClass="'text-xl'" content="Add a tutor" />

            <div class="w-full grid grid-cols-3 gap-2 py-3">
              <div :class="`col-span-1 h-[8px] rounded-[99px] ${index <= currentStep ? 'bg-[#141618]' : 'bg-[#E1E6EB]'
                }`" v-for="(step, index) in 3" :key="index"></div>
            </div>

            <div class="w-full flex flex-col" v-if="currentStep == 2">
              <sofa-select placeholder="Select subject" :padding="'px-2 py-4'" :customClass="'custom-border border-[1px]'"
                :options="allTopics" :auto-complete="true" v-model="selectedTopic">
              </sofa-select>
            </div>
          </div>

          <div
            class="w-full flex flex-col justify-between items-center sticky top-0 left-0 bg-white z-50 md:!hidden pt-3 border-[#F1F6FA] border-b-[1px] px-4 pb-3">
            <div class="flex flex-row w-full items-center gap-2 justify-between">
              <sofa-header-text :customClass="'!font-bold'" content="Add a tutor" />
              <sofa-icon :customClass="'h-[16px]'" :name="'circle-close'" @click="close ? close() : null" />
            </div>

            <div class="w-full grid grid-cols-3 gap-2 py-3">
              <div :class="`col-span-1 h-[8px] rounded-[99px]  ${index <= currentStep ? 'bg-[#141618]' : 'bg-[#E1E6EB]'
                }`" v-for="(step, index) in 3" :key="index"></div>
            </div>

            <div class="w-full flex flex-col pt-3" v-if="currentStep === 2">
              <sofa-select placeholder="Select subject" :padding="'px-2 py-4'" :customClass="'custom-border border-[1px]'"
                :options="allTopics" :auto-complete="true" v-model="selectedTopic">
              </sofa-select>
            </div>
          </div>

          <template v-if="currentStep == 0">
            <div class="w-full flex flex-col gap-3 px-4 md:px-0">
              <div class="w-full flex flex-row items-center justify-center">
                <sofa-normal-text :custom-class="`text-center`">
                  What type of help do you need?
                </sofa-normal-text>
              </div>
              <a
                class="w-full flex  items-center justify-between p-4 custom-border bg-backgroundGray"
                v-for="(option, index) in helpOptions" :key="index" @click="selectedhelpOption = option.key">
                <sofa-normal-text :color="selectedhelpOption == option.key ? 'text-primaryPurple' : 'text-[#78828C]'">
                  {{ option.title }}
                </sofa-normal-text>
                <sofa-icon :name="selectedhelpOption == option.key ? 'selected' : 'not-selected'" :customClass="'h-[20px]'" />
              </a>
              <sofa-text-field :padding="'px-3 py-4'" :custom-class="'border-[1px] custom-border'" :placeholder="'Others'"
                v-model="selectedhelpOptionOthers" />
            </div>
          </template>

          <template v-if="currentStep == 1">
            <div class="w-full flex flex-col gap-3 px-4 md:px-0">
              <sofa-textarea :padding="'px-3 py-4'" :custom-class="'bg-backgroundGray custom-border'"
                :placeholder="'Tell the tutor why you need him/her'" v-model="reasonForRequest"
                :text-area-style="'!bg-backgroundGray custom-border'">
              </sofa-textarea>
            </div>
          </template>

          <template v-if="currentStep == 2">
            <div class="w-full flex flex-col gap-3 md:!px-0 px-4 flex-grow">
              <template v-if="filteredTutors.length">
                <a :class="`w-full custom-border bg-[#F1F6FA] ${selectedTutorId == tutor.id ? 'border-[2px] border-primaryPurple' : ''} p-4 flex items-center gap-3`"
                  v-for="(tutor, index) in filteredTutors" :key="index" @click="selectedTutorId = tutor.id">
                  <div class="w-[60px]">
                    <sofa-avatar :size="'60'" :photoUrl="tutor.photo_url" :bgColor="'bg-grayColor'">
                      <sofa-icon v-if="!tutor.photo_url" :customClass="'h-[35px]'" :name="'user'" />
                      <span class="bg-primaryGreen h-[5px] w-[5px] absolute bottom-0 right-0 rounded-full">
                      </span>
                    </sofa-avatar>
                  </div>
                  <div class="w-full flex flex-col flex-grow gap-1">
                    <div class="flex flex-row gap-2 items-center">
                      <sofa-normal-text :customClass="'!font-bold'">{{ tutor.name }}</sofa-normal-text>
                      <sofa-icon :customClass="'h-[17px]'" :name="'tutor-bagde'" />
                    </div>
                    <sofa-normal-text :customClass="'!line-clamp-1 !text-left'">
                      {{ tutor.subjects }}
                    </sofa-normal-text>

                    <div class="w-full flex flex-row gap-2 items-center">
                      <sofa-icon :name="'star-full'" :custom-class="'h-[16px]'" />

                      <div class="flex flex-row gap-1 items-center">
                        <sofa-normal-text>
                          {{ tutor.ratings.value }}
                        </sofa-normal-text>
                        <sofa-normal-text :color="'text-grayColor'">
                          ({{ tutor.ratings.total }} rating{{ tutor.ratings.total > 1 ? "s" : "" }})
                        </sofa-normal-text>
                      </div>
                    </div>
                  </div>
                </a>
              </template>
              <template v-else>
                <div class="flex flex-col items-center justify-center pt-3">
                  <sofa-normal-text :color="'text-[#78828C]'">
                    No tutor found for selected subject
                  </sofa-normal-text>
                </div>
              </template>
            </div>
          </template>
        </div>

        <div
          class="w-full flex items-center justify-between bg-white p-4">
          <sofa-button :padding="'px-5 py-2'" :bgColor="'bg-white'" :textColor="'text-grayColor'"
            :customClass="'border border-gray-100 hidden md:!inline-block'" @click.prevent="close?.()">
            Exit
          </sofa-button>

          <div :class="`md:!w-auto w-full ${currentStep == 2 && !selectedTutorId ? 'opacity-50' : ''}`">
            <sofa-button :padding="'px-5 py-3 md:!py-2'" :customClass="`mdlg:!w-auto w-full`" @click="handleAddTutor">
              {{ currentStep == 0 ? "Next" : "" }}
              {{ currentStep == 1 ? "Next" : "" }}
              {{ currentStep == 2 ? "Send request" : "" }}
            </sofa-button>
          </div>
        </div>
      </div>
    </div>
  </sofa-modal>
</template>

<script lang="ts">
import { FormValidations } from "@/composables"
import { useTopicsList } from '@/composables/interactions/tags'
import { useTutorsList } from '@/composables/users/tutors'
import { Logic } from "sofa-logic"
import {
  SofaAvatar,
  SofaButton,
  SofaHeaderText,
  SofaIcon,
  SofaModal,
  SofaNormalText,
  SofaSelect,
  SofaTextField,
  SofaTextarea,
} from "sofa-ui-components"
import { computed, defineComponent, ref } from "vue"

const helpOptions = [
  {
    title: "Homework help",
    key: "homework_help",
  },
  {
    title: "Explanation",
    key: "explanation",
  },
  {
    title: "Project help",
    key: "project_help",
  },
  {
    title: "Essay",
    key: "essay",
  },
]

export default defineComponent({
  components: {
    SofaModal,
    SofaHeaderText,
    SofaNormalText,
    SofaButton,
    SofaIcon,
    SofaSelect,
    SofaAvatar,
    SofaTextField,
    SofaTextarea,
  },
  props: {
    close: {
      type: Function,
    },
    conversationId: {
      type: String,
      required: true,
    },
  },
  emits: ["onSelected"],
  setup (props, context) {
    const selectedTopic = ref('')
    const selectedhelpOption = ref(helpOptions[0].key)
    const selectedTutorId = ref("")
    const selectedhelpOptionOthers = ref("")
    const reasonForRequest = ref("")
    const currentStep = ref(0)

    const { tutors } = useTutorsList()
    const { topics } = useTopicsList()

    const allTopics = computed(() => topics.value.map((t) => ({
      key: t.id,
      value: t.title
    })))

    const filteredTutors = computed(() => tutors.value
      .filter((t) => t.tutor.topics.includes(selectedTopic.value))
      .map((t) => ({
        id: t.id,
        name: t.bio.name.full,
        online: t.status.connections.length > 0,
        photo_url: t.bio.photo?.link || "",
        ratings: {
          total: t.account.ratings.total,
          value: Logic.Common.convertToMoney(t.account.ratings.avg, false, ""),
        },
        subjects: t.tutor.topics
          .map((item) => topics.value.find((t) => t.id === item)?.title)
          .filter(Boolean)
          .join(", "),
      }))
    )

    const handleAddTutor = () => {
      if (currentStep.value == 0) {
        currentStep.value = 1
        return
      }

      if (currentStep.value == 1) {
        if (reasonForRequest.value) currentStep.value = 2
        return
      }

      if (currentStep.value == 2) {
        if (selectedTutorId.value) {
          context.emit("onSelected", {
            message: reasonForRequest.value,
            tutorId: selectedTutorId.value
          })
        }
      }
    }

    return {
      Logic,
      topics,
      allTopics,
      selectedTopic,
      currentStep,
      helpOptions,
      selectedhelpOption,
      selectedhelpOptionOthers,
      reasonForRequest,
      FormValidations,
      filteredTutors,
      selectedTutorId,
      handleAddTutor,
    }
  },
})
</script>
