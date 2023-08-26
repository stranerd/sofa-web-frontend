<template>
  <!-- add tutor -->
  <sofa-modal
    :close="
      () => {
        close ? close() : null;
      }
    "
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

          <div class="w-full flex flex-col">
            <sofa-text-field
              placeholder="Search by subject, course, or topic"
              :padding="'px-3 py-3'"
              :customClass="'custom-border '"
            >
              <template v-slot:inner-prefix>
                <sofa-icon :name="'search'" :customClass="'h-[19px] mr-2'" />
              </template>
            </sofa-text-field>
          </div>
        </div>

        <div
          class="w-full flex flex-col justify-between items-center sticky top-0 left-0 bg-white z-50 md:!hidden pt-3 border-[#F1F6FA] border-b-[1px] px-4"
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

          <div class="w-full flex flex-col pt-3">
            <sofa-text-field
              placeholder="Search by subject, course, or topic"
              :padding="'px-3 py-3'"
              :customClass="'custom-border '"
            >
              <template v-slot:inner-prefix>
                <sofa-icon :name="'search'" :customClass="'h-[19px] mr-2'" />
              </template>
            </sofa-text-field>
          </div>
        </div>

        <div class="w-full flex flex-col space-y-3 md:!px-0 px-4">
          <div
            class="w-full custom-border bg-[#F1F6FA] px-4 py-4 flex flex-row items-center space-x-3 cursor-pointer"
          >
            <div class="w-[60px]">
              <sofa-avatar
                :size="'60'"
                :photoUrl="''"
                :bgColor="'bg-grayColor'"
              >
                <sofa-icon :customClass="'h-[35px]'" :name="'user'" />
              </sofa-avatar>
            </div>
            <div class="w-full flex flex-col flex-grow space-y-1">
              <div class="flex flex-row space-x-2 items-center">
                <sofa-normal-text :customClass="'!font-bold'"
                  >Einstein Heesef</sofa-normal-text
                >
                <sofa-icon :customClass="'h-[17px]'" :name="'tutor-bagde'" />
              </div>
              <sofa-normal-text :customClass="'!line-clamp-1 !text-left'">
                Mathematics, Physics, Chemistry
              </sofa-normal-text>

              <div class="w-full flex flex-row space-x-2 items-center">
                <sofa-icon :name="'star-full'" :custom-class="'h-[16px]'" />

                <div class="flex flex-row space-x-1 items-center">
                  <sofa-normal-text> 4.0 </sofa-normal-text>
                  <sofa-normal-text :color="'text-grayColor'">
                    (24 ratings)
                  </sofa-normal-text>
                </div>
              </div>
            </div>
          </div>
        </div>

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

          <div class="md:!w-auto w-full">
            <sofa-button
              :padding="'px-5 py-3 md:!py-2'"
              :customClass="'mdlg:!w-auto w-full'"
            >
              Add
            </sofa-button>
          </div>
        </div>
      </div>
    </div>
  </sofa-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import {
  SofaModal,
  SofaHeaderText,
  SofaNormalText,
  SofaButton,
  SofaIcon,
  SofaTextField,
  SofaAvatar,
} from "sofa-ui-components";

import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaModal,
    SofaHeaderText,
    SofaNormalText,
    SofaButton,
    SofaIcon,
    SofaTextField,
    SofaAvatar,
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
  setup() {
    onMounted(() => {
      //
    });

    return {
      Logic,
    };
  },
});
</script>
