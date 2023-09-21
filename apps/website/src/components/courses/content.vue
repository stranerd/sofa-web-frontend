<template>
  <div
    v-if="SingleCourse"
    class="w-full px-4 relative md:py-4 bg-white mdlg:!rounded-[16px] overflow-y-auto flex-grow max-h-full h-fit flex flex-col space-y-4 mdlg:min-h-[400px]"
  >
    <template v-if="PurchasedItems.includes(SingleCourse?.id)">
      <div class="w-full flex flex-col items-start justify-start">
        <sofa-header-text :customClass="'!font-bold !text-lg'">
          {{ selectedMaterial?.name }}
        </sofa-header-text>
      </div>
      <template v-if="selectedMaterial?.type == 'quiz'">
        <sofa-empty-state
          :title="'Test yourself'"
          :subTitle="'Evaluate your level of knowledge'"
          :actionLabel="'Start'"
          :action="showStudyMode"
          :icon="{
            name: 'test-white',
            size: 'h-[40px]',
          }"
          :titleStyle="'mdlg:!text-xl '"
        />
      </template>

      <template v-if="selectedMaterial?.type == 'document'">
        <div
          class="w-full mdlg:!h-full flex-grow flex flex-col"
          style="height: calc(100vh - 90px)"
        >
          <sofa-document-reader
            :documentUrl="selectedMaterial.data.documentUrl"
          />
        </div>
      </template>

      <template v-if="selectedMaterial?.type == 'image'">
        <div class="w-full flex flex-col">
          <sofa-image-loader
            :customClass="'w-full h-[400px] rounded-[12px]'"
            :photoUrl="selectedMaterial.data.imageUrl"
          />
        </div>
      </template>

      <template v-if="selectedMaterial?.type == 'video'">
        <div class="w-full flex flex-col">
          <sofa-video-player :videoUrl="selectedMaterial.data.videoUrl" />
        </div>
      </template>
    </template>
    <template v-else>
      <div class="w-full flex flex-col">
        <sofa-empty-state
          :title="'You have no access'"
          :subTitle="'Purchase this course to start learning with it'"
          :custom-class="'h-[380px]'"
          :actionLabel="`Buy ${
            SingleCourse.price.amount
              ? Logic.Common.convertToMoney(
                  SingleCourse.price.amount,
                  false,
                  'ngn'
                )
              : 'for free'
          }`"
          :action="
            () => {
              buyCourse();
            }
          "
          :icon="{
            name: 'lock-white',
            size: 'h-[28px]',
          }"
          :titleStyle="'mdlg:!text-xl '"
        />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Logic } from "sofa-logic";
import { defineComponent, onMounted, ref } from "vue";
import {
  SofaHeaderText,
  SofaEmptyState,
  SofaDocumentReader,
  SofaImageLoader,
  SofaVideoPlayer,
} from "sofa-ui-components";

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaEmptyState,
    SofaDocumentReader,
    SofaImageLoader,
    SofaVideoPlayer,
  },
  props: {
    PurchasedItems: {
      type: Array as () => any[],
      default: () => {
        [""];
      },
    },
    selectedMaterial: {
      type: Object as () => any,
    },
    buyCourse: {
      type: Function,
      default: () => {
        //
      },
    },
    showStudyMode: {
      type: Function,
      default: () => {
        //
      },
    },
  },
  setup() {
    const SingleCourse = ref(Logic.Study.SingleCourse);

    onMounted(() => {
      Logic.Study.watchProperty("SingleCourse", SingleCourse);
    });

    return {
      Logic,
      SingleCourse,
    };
  },
});
</script>
