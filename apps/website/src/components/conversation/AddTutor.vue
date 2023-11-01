<template>
  <!-- add tutor -->
  <sofa-modal
    :close="
      () => {
        close ? close() : null;
      }
    "
    :can-close="false"
  >
    <div
      class="mdlg:!w-[60%] lg:!w-[50%] w-full mdlg:!h-[80%] md:!h-[70%] overflow-y-hidden md:w-[70%] h-[90%] flex flex-col items-center relative"
      @click.stop="
        () => {
          //
        }
      "
    >
      <div
        class="bg-white w-full flex flex-col h-full overflow-y-auto lg:!px-6 md:!space-y-4 relative space-y-3 lg:!py-0 mdlg:!px-6 mdlg:!py-0 md:!py-0 py-0 md:!px-4 md:!rounded-[16px] rounded-t-[16px]"
      >
        <div
          class="w-full hidden flex-col space-y-2 justify-center items-center md:flex sticky top-0 left-0 pt-4 bg-white z-50"
          v-if="Logic.Common.mediaQuery() != 'sm'"
        >
          <sofa-header-text :customClass="'text-xl'">
            Add a tutor
          </sofa-header-text>

          <div class="w-full grid grid-cols-3 gap-2 py-3">
            <div
              :class="`col-span-1 h-[8px] rounded-[99px]  ${
                index <= currentStep ? 'bg-[#141618]' : 'bg-[#E1E6EB]'
              }`"
              v-for="(step, index) in 3"
              :key="index"
            ></div>
          </div>

          <div class="w-full flex flex-col" v-if="currentStep == 2">
            <sofa-select
              placeholder="Select subject"
              :padding="'px-2 py-4'"
              :customClass="'custom-border border-[1px]'"
              :options="allTopics"
              :auto-complete="true"
              v-model="selectedTopic"
            >
            </sofa-select>
          </div>
        </div>

        <div
          class="w-full flex flex-col justify-between items-center sticky top-0 left-0 bg-white z-50 md:!hidden pt-3 border-[#F1F6FA] border-b-[1px] px-4 pb-3"
        >
          <div
            class="flex flex-row w-full items-center space-x-2 justify-between"
          >
            <sofa-header-text :customClass="'!font-bold'">
              Add a tutor
            </sofa-header-text>
            <sofa-icon
              :customClass="'h-[16px]'"
              :name="'circle-close'"
              @click="close ? close() : null"
            />
          </div>

          <div class="w-full grid grid-cols-3 gap-2 py-3">
            <div
              :class="`col-span-1 h-[8px] rounded-[99px]  ${
                index <= currentStep ? 'bg-[#141618]' : 'bg-[#E1E6EB]'
              }`"
              v-for="(step, index) in 3"
              :key="index"
            ></div>
          </div>

          <div class="w-full flex flex-col pt-3" v-if="currentStep == 2">
            <sofa-select
              placeholder="Select subject"
              :padding="'px-2 py-4'"
              :customClass="'custom-border border-[1px]'"
              :options="allTopics"
              :auto-complete="true"
              v-model="selectedTopic"
            >
            </sofa-select>
          </div>
        </div>

        <template v-if="currentStep == 0">
          <div class="w-full flex flex-col space-y-3 px-4 md:px-0">
            <div class="w-full flex flex-row items-center justify-center">
              <sofa-normal-text :custom-class="`text-center`">
                What type of help do you need?
              </sofa-normal-text>
            </div>
            <div
              class="w-full flex flex-row items-center justify-between px-4 py-4 custom-border bg-backgroundGray cursor-pointer"
              v-for="(option, index) in helpOptions"
              :key="index"
              @click="selectedhelpOption = option.key"
            >
              <sofa-normal-text
                :color="
                  selectedhelpOption == option.key
                    ? 'text-primaryPurple'
                    : 'text-[#78828C]'
                "
              >
                {{ option.title }}
              </sofa-normal-text>
              <sofa-icon
                :name="
                  selectedhelpOption == option.key ? 'selected' : 'not-selected'
                "
                :customClass="'h-[20px]'"
              >
              </sofa-icon>
            </div>
            <sofa-text-field
              :padding="'px-3 py-4'"
              :custom-class="'border-[1px] custom-border'"
              :placeholder="'Others'"
              v-model="selectedhelpOptionOthers"
            >
            </sofa-text-field>
          </div>
        </template>

        <template v-if="currentStep == 1">
          <div class="w-full flex flex-col space-y-3 px-4 md:px-0">
            <sofa-textarea
              :padding="'px-3 py-4'"
              :custom-class="'bg-backgroundGray custom-border'"
              :placeholder="'Tell the tutor why you need him/her'"
              v-model="reasonForRequest"
              :text-area-style="'!bg-backgroundGray custom-border'"
            >
            </sofa-textarea>
          </div>
        </template>

        <template v-if="currentStep == 2">
          <div class="w-full flex flex-col space-y-3 md:!px-0 px-4 flex-grow">
            <template v-if="allTutors.length">
              <div
                :class="`w-full custom-border bg-[#F1F6FA] ${
                  selectedTutorId == tutor.id
                    ? 'border-[2px] border-primaryPurple'
                    : ''
                } px-4 py-4 flex flex-row items-center space-x-3 cursor-pointer`"
                v-for="(tutor, index) in allTutors"
                :key="index"
                @click="selectedTutorId = tutor.id"
              >
                <div class="w-[60px]">
                  <sofa-avatar
                    :size="'60'"
                    :photoUrl="tutor.photo_url"
                    :bgColor="'bg-grayColor'"
                  >
                    <sofa-icon
                      v-if="!tutor.photo_url"
                      :customClass="'h-[35px]'"
                      :name="'user'"
                    />
                    <span
                      class="bg-primaryGreen h-[5px] w-[5px] absolute bottom-0 right-0 rounded-full"
                    >
                    </span>
                  </sofa-avatar>
                </div>
                <div class="w-full flex flex-col flex-grow space-y-1">
                  <div class="flex flex-row space-x-2 items-center">
                    <sofa-normal-text :customClass="'!font-bold'">{{
                      tutor.name
                    }}</sofa-normal-text>
                    <sofa-icon
                      :customClass="'h-[17px]'"
                      :name="'tutor-bagde'"
                    />
                  </div>
                  <sofa-normal-text :customClass="'!line-clamp-1 !text-left'">
                    {{ tutor.subjects }}
                  </sofa-normal-text>

                  <div class="w-full flex flex-row space-x-2 items-center">
                    <sofa-icon :name="'star-full'" :custom-class="'h-[16px]'" />

                    <div class="flex flex-row space-x-1 items-center">
                      <sofa-normal-text>
                        {{ tutor.ratings.value }}
                      </sofa-normal-text>
                      <sofa-normal-text :color="'text-grayColor'">
                        ({{ tutor.ratings.total }} rating{{
                          tutor.ratings.total > 1 ? "s" : ""
                        }})
                      </sofa-normal-text>
                    </div>
                  </div>
                </div>
              </div>
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

        <div
          class="w-full flex flex-row items-center justify-between z-[50] bg-white md:!absolute fixed bottom-0 left-0 py-4 px-4"
        >
          <sofa-button
            :padding="'px-5 py-2'"
            :bgColor="'bg-white'"
            :textColor="'text-grayColor'"
            :customClass="'border-[1px] border-gray-100 hidden md:!inline-block'"
            @click.prevent="close ? close() : null"
          >
            Exit
          </sofa-button>

          <div
            :class="`md:!w-auto w-full  ${
              currentStep == 2 && !selectedTutorId ? 'opacity-50' : ''
            } `"
          >
            <sofa-button
              :padding="'px-5 py-3 md:!py-2'"
              :customClass="`mdlg:!w-auto w-full`"
              @click="handleAddTutor()"
            >
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
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import {
  SofaModal,
  SofaHeaderText,
  SofaNormalText,
  SofaButton,
  SofaIcon,
  SofaSelect,
  SofaAvatar,
  SofaTextField,
  SofaTextarea,
} from "sofa-ui-components";

import { Logic } from "sofa-logic";
import { allTopics, getTopics } from "@/composables/course";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import { FormValidations } from "@/composables";
import { SingleUser } from "sofa-logic/src/logic/types/domains/users";
import { SingleConversation } from "@/composables/conversation";

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
    chatId: {
      type: String,
      default: "",
    },
  },
  emits: ["OnRequestSent"],
  setup(props, context) {
    const selectedTopic = ref("");

    const selectedhelpOption = ref("homework_help");

    const selectedTutorId = ref("");

    const selectedhelpOptionOthers = ref("");

    const reasonForRequest = ref("");

    const currentStep = ref(0);

    const helpOptions = reactive([
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
    ]);

    const allTutors = ref<
      {
        name: string;
        online: boolean;
        photo_url: string;
        subjects: string;
        ratings: {
          total: number;
          value: string;
        };
        id: string;
      }[]
    >([]);

    const searchTutors = () => {
      Logic.Users.GetUsers(
        {
          where: [
            {
              field: "type.type",
              value: "teacher",
              condition: Conditions.eq,
            },
            {
              field: "tutor.topics",
              value: [selectedTopic.value],
              condition: Conditions.in,
            },
          ],
        },
        false
      ).then((data: SingleUser[]) => {
        allTutors.value.length = 0;
        selectedTutorId.value = "";
        data.forEach((eachUser) => {
          allTutors.value.push({
            name: eachUser.bio.name.full,
            online: eachUser.status.connections.length > 0,
            photo_url: eachUser.bio.photo?.link || "",
            ratings: {
              total: eachUser.tutor.conversations.length,
              value: Logic.Common.convertToMoney(
                eachUser.account?.ratings.total || "0",
                false,
                ""
              ),
            },
            subjects: eachUser.tutor.topics
              .map((item) => Logic.Study.GetTagName(item))
              .join(","),
            id: eachUser.id,
          });
        });
      });
    };

    const handleAddTutor = () => {
      if (currentStep.value == 0) {
        currentStep.value = 1;
        return;
      }

      if (currentStep.value == 1) {
        if (reasonForRequest.value) {
          currentStep.value = 2;
        }
        return;
      }

      if (currentStep.value == 2) {
        if (selectedTutorId.value) {
          Logic.Conversations.CreateTutorRequestForm = {
            conversationId: SingleConversation.value?.id,
            message: reasonForRequest.value,
            tutorId: selectedTutorId.value,
          };

          Logic.Conversations.CreateTutorRequest().then((data) => {
            if (data) {
              context.emit("OnRequestSent", true);
            }
          });
        }
      }
    };

    watch(selectedTopic, () => {
      if (selectedTopic.value) {
        searchTutors();
      }
    });

    onMounted(() => {
      Logic.Conversations.watchProperty(
        "SingleConversation",
        SingleConversation
      );
      getTopics(true);
    });

    return {
      Logic,
      allTopics,
      selectedTopic,
      currentStep,
      helpOptions,
      selectedhelpOption,
      selectedhelpOptionOthers,
      reasonForRequest,
      FormValidations,
      allTutors,
      selectedTutorId,
      handleAddTutor,
    };
  },
});
</script>
