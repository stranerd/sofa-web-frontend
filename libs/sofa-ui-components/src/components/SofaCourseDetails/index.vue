<template>
  <div class="w-full flex flex-col h-full space-y-4 relative" v-if="data">
    <div
      class="flex flex-row space-x-2 justify-between items-center px-4 py-4 mdlg:!pt-0 border-b-[1px] sticky top-0 left-0 bg-white border-[#F2F5F8]"
    >
      <sofa-normal-text :customClass="'!text-sm !font-bold'">
        Details
      </sofa-normal-text>
      <sofa-icon
        :customClass="'h-[19px] mdlg:!hidden '"
        :name="'circle-close'"
        @click="close()"
      />
    </div>
    <div class="flex flex-col space-y-3 h-full w-full px-4">
      <template v-if="type == 'quiz'">
        <sofa-image-loader
          :customClass="'w-full custom-border h-[200px]'"
          :photoUrl="data.image_url"
        />

        <sofa-normal-text :customClass="'text-left font-bold'">
          {{ data.title }}
        </sofa-normal-text>

        <div class="w-full flex items-center space-x-2 flex-row">
          <sofa-normal-text :color="'text-primaryPurple'">
            {{ data.type }}
          </sofa-normal-text>
          <span class="w-[4px] h-[4px] rounded-full bg-primaryPurple"></span>
          <sofa-normal-text :color="'text-primaryPurple'">
            {{ data.questions }}
          </sofa-normal-text>
        </div>

        <sofa-normal-text :customClass="'text-left'">
          {{ data.description }}
        </sofa-normal-text>

        <div class="w-full flex flex-col space-y-2">
          <div class="flex flex-row space-x-1 items-center">
            <sofa-ratings
              :count="data.ratings.total"
              :size="'h-[14px] mdlg:!h-[15px]'"
            />
            <sofa-normal-text> {{ data.ratings.total }}.0 </sofa-normal-text>
            <sofa-normal-text :color="'text-grayColor pl-2'">
              ({{ data.ratings.label }})
            </sofa-normal-text>
          </div>

          <div class="w-full flex flex-row items-center">
            <div class="space-x-2 flex flex-row items-center">
              <sofa-avatar :size="'20'" :photoUrl="data.user.photoUrl" />
              <sofa-normal-text>
                {{ data.user.name }}
              </sofa-normal-text>
            </div>
          </div>

          <div class="w-full flex flex-row items-center space-x-2">
            <sofa-icon :customClass="'h-[16px]'" :name="'calendar-black'" />
            <sofa-normal-text>
              Last updated {{ data.last_updated }}
            </sofa-normal-text>
          </div>
        </div>
      </template>

      <template v-if="type == 'document'">
        <sofa-text-field
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-3 md:!px-3 px-3 py-3'"
          type="text"
          :name="'Document title'"
          ref="document_title"
          v-model="dataReactive.title"
          :updateValue="dataReactive.title"
          :placeholder="'Document title'"
          :hasTitle="true"
          :rules="[Logic.Form.RequiredRule]"
          :borderColor="'border-transparent'"
        >
          <template v-slot:title> Document title </template>
        </sofa-text-field>

        <sofa-textarea
          :hasTitle="false"
          :textAreaStyle="'h-[60px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
          :placeholder="'Description'"
          :richEditor="false"
          :updateValue="dataReactive.description"
          v-model="dataReactive.description"
        />
      </template>

      <template v-if="type == 'image'">
        <sofa-text-field
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-3 md:!px-3 px-3 py-3'"
          type="text"
          :name="'Image title'"
          ref="image_title"
          v-model="dataReactive.title"
          :placeholder="'Image title'"
          :hasTitle="true"
          :rules="[Logic.Form.RequiredRule]"
          :updateValue="dataReactive.title"
          :borderColor="'border-transparent'"
        >
          <template v-slot:title> Image title </template>
        </sofa-text-field>

        <sofa-textarea
          :hasTitle="false"
          :textAreaStyle="'h-[60px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
          :placeholder="'Description'"
          :richEditor="false"
          :updateValue="dataReactive.description"
          v-model="dataReactive.description"
        />
      </template>

      <template v-if="type == 'video'">
        <sofa-text-field
          :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
          :padding="'md:!py-3 md:!px-3 px-3 py-3'"
          type="text"
          :name="'Video title'"
          ref="video_title"
          v-model="dataReactive.title"
          :placeholder="'Video title'"
          :hasTitle="true"
          :rules="[Logic.Form.RequiredRule]"
          :updateValue="dataReactive.title"
          :borderColor="'border-transparent'"
        >
          <template v-slot:title> Video title </template>
        </sofa-text-field>

        <sofa-textarea
          :hasTitle="false"
          :textAreaStyle="'h-[60px] custom-border !bg-lightGrayVaraint !placeholder:text-grayColor md:!py-4 md:!px-4 px-3 py-3 resize-none'"
          :placeholder="'Description'"
          :richEditor="false"
          v-model="dataReactive.description"
          :updateValue="dataReactive.description"
        />
      </template>
      <div
        v-if="type != 'quiz'"
        class="w-full flex flex-row items-center justify-end"
      >
        <sofa-button :padding="'px-4 py-2'" @click="updateFile()">
          Save changes
        </sofa-button>
      </div>
    </div>

    <div
      class="sticky bottom-0 left-0 bg-white rounded-b-[12px] w-full px-4 py-4 border-t-[2px] border-[#F2F5F8] z-50 flex flex-col space-y-3 scrollbar-hide"
    >
      <div
        class="w-full flex flex-row items-center justify-start space-x-3 cursor-pointer"
        @click="
          selectedMaterialId = data.id;
          showDeleteMaterial = true;
        "
      >
        <sofa-icon :name="'trash'" :customClass="'h-[16px]'" />
        <sofa-normal-text :color="'text-primaryRed'"
          >Delete {{ type }}</sofa-normal-text
        >
      </div>
    </div>
  </div>

  <sofa-delete-prompt
    v-if="showDeleteMaterial"
    :title="'Are you sure you?'"
    :subTitle="`This action is permanent. You won't be able to undo this.`"
    :close="
      () => {
        showDeleteMaterial = false;
      }
    "
    :buttons="[
      {
        label: 'No',
        isClose: true,
        action: () => {
          showDeleteMaterial = false;
        },
      },
      {
        label: 'Yes, delete',
        isClose: false,
        action: () => {
          deleteMaterial();
        },
      },
    ]"
  />
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRef, watch } from "vue";
import SofaIcon from "../SofaIcon";
import { SofaNormalText } from "../SofaTypography";
import SofaImageLoader from "../SofaImageLoader";
import SofaAvatar from "../SofaAvatar";
import SofaRatings from "../SofaRatings";
import { SofaTextField, SofaTextarea } from "../SofaForm";
import draggable from "vuedraggable";
import { Logic } from "../../composable";
import SofaDeletePrompt from "../SofaDeletePrompt";
import SofaButton from "../SofaButton";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    draggable,
    SofaImageLoader,
    SofaRatings,
    SofaAvatar,
    SofaTextField,
    SofaTextarea,
    SofaDeletePrompt,
    SofaButton,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    close: {
      type: Function,
      required: true,
    },
    type: {
      type: String,
      default: "video",
    },
    data: {
      type: Object as () => any,
    },
  },
  name: "SofaCourseDetails",
  setup(props) {
    const dataRef = toRef(props, "data");
    const showDeleteMaterial = ref(false);
    const selectedMaterialId = ref("");
    const dataReactive = reactive(dataRef.value);

    watch(dataRef, () => {
      dataReactive.title = dataRef.value.title;
      dataReactive.description = dataRef.value.description;
    });

    const updateFile = () => {
      Logic.Study.UpdateFileForm = {
        description: dataReactive.description,
        title: dataReactive.title,
        id: dataRef.value.id,
        tagIds: [],
        topicId: Logic.Study.SingleCourse.topicId,
      };

      Logic.Common.showLoader({
        loading: true,
        show: false,
      });

      Logic.Study.UpdateFile(true, dataRef.value.id)?.then(() => {
        Logic.Common.showLoader({
          show: true,
          loading: false,
          message: "All changes have been saved",
          type: "success",
        });
      });
    };

    const deleteFile = (id: string) => {
      // remove file from coursable
      // move item to course
      Logic.Study.MoveItemToCourseForm = {
        add: false,
        coursableId: id,
        type: "file",
        id: Logic.Study.SingleCourse.id,
      };
      Logic.Study.MoveItemToCourse(true).then((response) => {
        if (response) {
          Logic.Study.DeleteFile(id).then(() => {
            Logic.Study.GetCourse(Logic.Study.SingleCourse.id);
            Logic.Common.showLoader({
              show: true,
              loading: false,
              message: "Material has been deleted.",
              type: "success",
            });
          });
        } else {
          Logic.Common.showLoader({
            show: true,
            loading: false,
            message: "Unable to delete material. Please try again.",
            type: "error",
          });
        }
        showDeleteMaterial.value = false;
      });
    };

    const deleteMaterial = () => {
      deleteFile(selectedMaterialId.value);
    };
    return {
      Logic,
      dataReactive,
      showDeleteMaterial,
      selectedMaterialId,
      deleteFile,
      deleteMaterial,
      updateFile,
    };
  },
});
</script>
