<template>
  <dashboard-layout
    :topbarOptions="{
      type: 'subpage',
      title: 'Verification application',
      actions: [
        {
          IsOutlined: true,
          name: 'Exit',
          handler: cancle,
        },
        {
          IsOutlined: false,
          name: 'Submit',
          handler: submit,
        },
      ],
    }"
  >
    <template v-slot:left-session>
      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
      >
        <div class="w-full flex flex-col">
          <sofa-header-text :customClass="'!font-bold'">
            Personal information
          </sofa-header-text>
          <sofa-normal-text> Edit or complete your profile </sofa-normal-text>
        </div>

        <div class="flex flex-row justify-start">
          <div
            class="w-[96px] h-[96px] flex flex-row items-center justify-center relative bg-opacity-90 bg-bodyBlack border-[1px] rounded-full"
          >
            <sofa-icon :customClass="'h-[57px] opacity-50'" :name="'user'" />

            <span class="absolute top-auto left-auto">
              <sofa-icon
                :name="'camera-white'"
                :customClass="'h-[26px]'"
              ></sofa-icon>
            </span>
          </div>
        </div>

        <sofa-text-field :placeholder="'Enter name'" :hasTitle="true">
          <template v-slot:title> Name </template>
        </sofa-text-field>

        <sofa-text-field :placeholder="'Enter email'" :hasTitle="true">
          <template v-slot:title> Email </template>
        </sofa-text-field>

        <sofa-text-field :placeholder="'Enter your website'" :hasTitle="true">
          <template v-slot:title> Website </template>
        </sofa-text-field>

        <sofa-textarea
          :placeholder="'Description of yourself'"
          :hasTitle="true"
          :rich-editor="false"
          :text-area-style="'border-[1px] border-[#E1E6EB] rounded-[8px] resize-none'"
        >
          <template v-slot:title> Bio </template>
        </sofa-textarea>
      </div>
    </template>

    <template v-slot:middle-session>
      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
      >
        <div class="w-full flex flex-col justify-start">
          <sofa-header-text
            :customClass="'!font-bold flex flex-row justify-start'"
          >
            Page content
          </sofa-header-text>
          <sofa-normal-text
            >Add 3 study materials you’ve created
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-col space-y-2">
          <sofa-normal-text :customClass="'!font-bold'">
            Quizzes
          </sofa-normal-text>

          <div class="w-full grid grid-cols-3 gap-4">
            <template v-for="(content, index) in quizzesContents" :key="index">
              <sofa-item-card
                v-if="content.subject"
                :content="content"
              ></sofa-item-card>

              <div
                v-else
                class="col-span-1 w-full flex flex-row space-x-3 justify-center min-h-[300px] items-center px-4 py-4 border-[2px] rounded-[16px] border-[#E1E6EB]"
              >
                <sofa-icon
                  :name="'box-plus'"
                  :customClass="'h-[18px]'"
                ></sofa-icon>
                <sofa-normal-text :color="'text-grayColor '">
                  Add quiz
                </sofa-normal-text>
              </div>
            </template>
          </div>
        </div>

        <div class="w-full flex flex-col space-y-2">
          <sofa-normal-text :customClass="'!font-bold'">
            Courses
          </sofa-normal-text>

          <div class="w-full grid grid-cols-3 gap-4">
            <template v-for="(content, index) in courseContents" :key="index">
              <sofa-item-card
                v-if="content.subject"
                :content="content"
              ></sofa-item-card>
              <div
                v-else
                class="col-span-1 w-full flex flex-row space-x-3 min-h-[300px] justify-center items-center px-4 py-4 border-[2px] rounded-[16px] border-[#E1E6EB]"
              >
                <sofa-icon
                  :name="'box-plus'"
                  :customClass="'h-[18px]'"
                ></sofa-icon>
                <sofa-normal-text :color="'text-grayColor '">
                  Add quiz
                </sofa-normal-text>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:right-session>
      <div
        class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
      >
        <div class="w-full flex flex-col justify-start">
          <sofa-header-text
            :customClass="'!font-bold flex flex-row justify-start'"
          >
            Social media
          </sofa-header-text>
          <sofa-normal-text
            >Connect your educational social media
          </sofa-normal-text>
        </div>

        <sofa-text-field :placeholder="'Add link (optional)'" :hasTitle="true">
          <template v-slot:title> YouTube </template>
        </sofa-text-field>

        <sofa-text-field :placeholder="'Add link (optional)'" :hasTitle="true">
          <template v-slot:title> Instagram </template>
        </sofa-text-field>

        <sofa-text-field :placeholder="'Add link (optional)'" :hasTitle="true">
          <template v-slot:title> Twitter </template>
        </sofa-text-field>

        <sofa-text-field :placeholder="'Add link (optional)'" :hasTitle="true">
          <template v-slot:title> TikTok </template>
        </sofa-text-field>

        <sofa-text-field :placeholder="'Add link (optional)'" :hasTitle="true">
          <template v-slot:title> Facebook </template>
        </sofa-text-field>
      </div>
    </template>
  </dashboard-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaHeaderText,
  SofaTextField,
  SofaTextarea,
  SofaItemCard,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaTextField,
    SofaTextarea,
    SofaItemCard,
  },
  middlewares: {},
  name: "VerificationIndexPage",
  setup() {
    useMeta({
      title: "Verification application",
    });

    onMounted(() => {
      scrollToTop();
    });

    const cancle = () => {
      Logic.Common.goBack();
    };

    const submit = () => {
      Logic.Common.goBack();
    };

    const quizzesContents: {
      id: string;
      subject?: string;
      title?: string;
      image?: string;
      labels?: {
        main: string;
        sub: string;
        color: string;
      };
    }[] = [
      {
        id: "1",
        subject: "Science",
        title: "Our Solar System",
        image: "/images/solar-system.png",
        labels: {
          main: "Quiz",
          sub: "20 questions",
          color: "pink",
        },
      },
      {
        id: "2",
        subject: "Science",
        title: "Our Solar System",
        image: "/images/solar-system.png",
        labels: {
          main: "Quiz",
          sub: "20 questions",
          color: "pink",
        },
      },
      {
        id: "3",
      },
    ];

    const courseContents: {
      id: string;
      subject?: string;
      title?: string;
      image?: string;
      labels?: {
        main: string;
        sub: string;
        color: string;
      };
    }[] = [
      {
        id: "1",
      },
    ];

    return {
      moment,
      cancle,
      submit,
      quizzesContents,
      courseContents,
    };
  },
});
</script>
