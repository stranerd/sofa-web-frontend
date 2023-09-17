<template>
  <sofa-form-wrapper
    :parentRefs="parentRefs"
    ref="formComp"
    class="w-full flex flex-col space-y-4"
  >
    <div
      class="w-full md:!grid md:!grid-cols-2 flex flex-col-reverse space-y-4 md:!space-y-0 md:!gap-4 gap-0"
    >
      <div class="col-span-1 w-full flex flex-col space-y-3">
        <sofa-text-field
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'"
          type="text"
          :name="'Title'"
          ref="title"
          v-model="quizSettingsForm.title"
          :placeholder="'Title'"
          :borderColor="'border-transparent'"
          :updateValue="quizSettingsForm.title"
          :rules="[Logic.Form.RequiredRule]"
        />

        <sofa-textarea
          :hasTitle="false"
          :textAreaStyle="'h-[60px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
          :placeholder="'Description'"
          :richEditor="false"
          ref="description"
          v-model="quizSettingsForm.description"
          :updateValue="quizSettingsForm.description"
        />

        <sofa-select
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'"
          :name="'Topic'"
          ref="topic"
          :placeholder="'Topic'"
          :rules="[FormValidations.RequiredRule]"
          :autoComplete="true"
          :borderColor="'border-transparent'"
          :options="allTopics"
          v-model="quizSettingsForm.topic"
        />

        <sofa-select
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-4 md:!px-4 px-3 py-3'"
          :name="'Visibiliy'"
          ref="Visibility"
          :placeholder="'Visibility'"
          :rules="[FormValidations.RequiredRule]"
          :borderColor="'border-transparent'"
          :options="visibilityOptions"
          v-if="false"
          v-model="quizSettingsForm.visibility"
        />
      </div>
      <div class="col-span-1 flex flex-col w-full pb-4 md:!pb-0">
        <sofa-image-loader
          :customClass="'w-full md:!h-full h-[220px] custom-border relative'"
          :photoUrl="quizImageUrl ? quizImageUrl : '/images/default.png'"
        >
          <div
            class="absolute bottom-0 left-0 pb-3 flex w-full flex-row items-center justify-center"
          >
            <sofa-file-attachment
              :isWrapper="true"
              v-model="quizSettingsForm.photo"
              :accept="'image/png, image/gif, image/jpeg'"
              v-model:localFileUrl="quizImageUrl"
            >
              <template v-slot:content>
                <div
                  class="px-4 py-3 flex flex-row items-center justify-center space-x-2 custom-border bg-deepGray bg-opacity-50"
                >
                  <sofa-icon :customClass="'h-[18px]'" :name="'camera-white'" />
                  <sofa-normal-text :color="'text-white'"
                    >Add cover photo</sofa-normal-text
                  >
                </div>
              </template>
            </sofa-file-attachment>
          </div>
        </sofa-image-loader>
      </div>
    </div>

    <div class="w-full flex flex-col space-y-2">
      <sofa-select
        :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
        :padding="'md:!py-4 md:!px-4 px-3 py-4'"
        :name="'Tags'"
        ref="tags"
        :placeholder="'Tags'"
        :rules="[FormValidations.RequiredRule]"
        :autoComplete="true"
        :borderColor="'border-transparent'"
        :options="allGenericTags"
        :default-options="defaultTags"
        v-model="quizSettingsForm.tags"
        :isMultiple="true"
      />
    </div>

    <div
      class="w-full flex flex-row items-center justify-between mdlg:!relative fixed z-[50] bottom-0 left-0 mdlg:!bottom-auto mdlg:!left-auto bg-white mdlg:!py-0 mdlg:!px-0 py-4 px-4"
    >
      <sofa-button
        :padding="'px-5 py-2'"
        :bgColor="'bg-white'"
        :textColor="'text-grayColor'"
        :customClass="'border-[1px] border-gray-100 hidden mdlg:inline-block'"
        @click.prevent="quiz ? close() : Logic.Common.goBack()"
      >
        Exit
      </sofa-button>

      <div
        class="mdlg:!w-auto w-full mdlg:!flex mdlg:!flex-row mdlg:!space-x-3 grid grid-cols-2 gap-2 mdlg:!gap-0 items-center"
      >
        <div
          :class="`mdlg:!w-auto  flex flex-col ${
            quiz && quiz.status != 'published' ? 'col-span-1' : 'col-span-full'
          }`"
        >
          <sofa-button
            :padding="'px-5 mdlg:!py-2 py-3'"
            :customClass="'mdlg:!w-auto w-full'"
            @click.prevent="quiz ? updateQuiz(formComp) : createQuiz(formComp)"
          >
            {{ quiz ? "Save" : "Create" }}
          </sofa-button>
        </div>
        <div class="mdlg:!w-auto col-span-1 flex flex-col">
          <sofa-button
            :padding="'px-5 mdlg:!py-2 py-3'"
            :customClass="'mdlg:!w-auto w-full'"
            v-if="quiz && quiz.status != 'published'"
            @click.prevent="Logic.Study.PublishQuiz(quiz.id)"
          >
            Publish
          </sofa-button>
        </div>
      </div>
    </div>
  </sofa-form-wrapper>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import {
  SofaIcon,
  SofaTextField,
  SofaTextarea,
  SofaSelect,
  SofaImageLoader,
  SofaNormalText,
  SofaFileAttachment,
  SofaButton,
  SofaFormWrapper,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { FormValidations } from "@/composables";
import {
  allGenericTags,
  allTopics,
  getGenericTags,
  getTopics,
} from "@/composables/course";
import {
  createQuiz,
  quizSettingSaved,
  quizSettingsForm,
  updateQuiz,
} from "@/composables/quiz";
import { Quiz } from "sofa-logic/src/logic/types/domains/study";

export default defineComponent({
  components: {
    SofaIcon,
    SofaTextField,
    SofaTextarea,
    SofaSelect,
    SofaImageLoader,
    SofaNormalText,
    SofaFileAttachment,
    SofaButton,
    SofaFormWrapper,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    quiz: {
      type: Object as () => Quiz,
    },
    close: {
      type: Function,
    },
  },
  name: "QuizSettings",
  emits: ["OnQuizUpdated"],
  setup(props, context) {
    const visibilityOptions = [
      {
        key: "active",
        value: "Active",
      },
      {
        key: "inactive",
        value: "Inactive",
      },
    ];

    const formComp = ref<any>();

    const defaultTags = ref([]);

    const preventUpdate = ref(true);

    const quizImageUrl = ref("");

    watch(quizSettingSaved, () => {
      if (!preventUpdate.value) {
        context.emit("OnQuizUpdated", quizSettingSaved);
      }
    });

    const setDefaultValues = () => {
      if (props.quiz) {
        const quiz = props.quiz;
        quizSettingsForm.title = quiz.title;
        quizSettingsForm.description = quiz.description;
        quizSettingsForm.tags = quiz.tagIds.map((id) =>
          Logic.Study.GetTagName(id)
        );
        defaultTags.value = quiz.tagIds.map((id) => Logic.Study.GetTagName(id));
        quizSettingsForm.topic = Logic.Study.GetTagName(quiz.topicId);
        quizSettingsForm.visibility = "active";
        quizImageUrl.value = quiz.photo?.link || "";
      } else {
        quizSettingsForm.title = "";
        quizSettingsForm.description = "";
        quizSettingsForm.tags = [];
        quizSettingsForm.topic = "";
        quizSettingsForm.visibility = "";
        quizImageUrl.value = "";

        setTimeout(() => {
          formComp.value.fieldsToValidate?.Visibility.emptyValue();
          formComp.value.fieldsToValidate?.title.emptyValue();
          formComp.value.fieldsToValidate?.topic.emptyValue();
          formComp.value.fieldsToValidate?.description.emptyValue();
        }, 500);
      }
    };

    watch(allTopics, () => {
      setDefaultValues();
    });

    watch(allGenericTags, () => {
      setDefaultValues();
    });

    onMounted(() => {
      getTopics();
      getGenericTags();
      setDefaultValues();
      setTimeout(() => {
        preventUpdate.value = false;
      }, 3000);
    });

    return {
      quizSettingsForm,
      Logic,
      FormValidations,
      visibilityOptions,
      formComp,
      quizImageUrl,
      createQuiz,
      allTopics,
      updateQuiz,
      allGenericTags,
      defaultTags,
    };
  },
  data() {
    return {
      parentRefs: null,
    };
  },
  mounted() {
    const parentRefs: any = this.$refs;
    this.parentRefs = parentRefs;
  },
});
</script>