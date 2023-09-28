<template>
  <!-- create item action -->
  <sofa-modal
    :close="
      () => {
        close ? close() : null;
      }
    "
    :can-close="true"
  >
    <div
      class="mdlg:!w-[60%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative"
      @click.stop="
        () => {
          //
        }
      "
    >
      <div
        class="bg-white w-full flex flex-col lg:!px-6 md:!space-y-4 space-y-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center"
      >
        <div
          class="w-full hidden flex-col space-y-2 justify-center items-center md:flex"
        >
          <sofa-header-text :customClass="'text-xl'">
            Save to
          </sofa-header-text>
        </div>

        <div
          class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-[#F1F6FA] border-b-[1px] px-4"
        >
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            Save to
          </sofa-normal-text>
          <sofa-icon
            :customClass="'h-[19px]'"
            :name="'circle-close'"
            @click="close ? close() : null"
          />
        </div>

        <div class="w-full flex flex-col space-y-3 px-4 py-4">
          <div
            class="w-full flex flex-row items-center space-x-3 px-4 py-4 custom-border bg-[#F1F6FA] cursor-pointer"
            @click="!addFolderIsActive ? handleFolderSelected(item.id) : null"
            v-for="(item, index) in folders"
            :key="index"
          >
            <sofa-icon :name="'folder'" :customClass="'h-[18px]'" />

            <sofa-custom-input
              v-if="item.edit"
              :custom-class="` ${
                selectedFilter == item.id ? '!font-bold' : ''
              } lg:text-sm mdlg:text-[12px] text-xs w-full  cursor-text !bg-white`"
              :updateValue="item.name"
              @blur="
                item.edit = false;
                handleFolderNameBlur();
              "
              :placeholder="'Folder name'"
              @onContentChange="
                (content) => {
                  item.name = content;
                  currentFolder.name = content;
                  currentFolder.id = item.id;
                }
              "
            >
            </sofa-custom-input>

            <sofa-normal-text v-else>
              {{ item.name }}
            </sofa-normal-text>
          </div>
          <div
            class="w-full flex flex-row items-center space-x-3 px-4 py-4 custom-border bg-[#F1F6FA] cursor-pointer"
            @click="addFolder()"
          >
            <sofa-icon :customClass="'h-[18px]'" :name="'add-card'" />
            <sofa-normal-text :customClass="'text-grayColor'">
              Add new folder
            </sofa-normal-text>
          </div>
        </div>
      </div>
    </div>
  </sofa-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, watch } from "vue";
import {
  SofaModal,
  SofaIcon,
  SofaNormalText,
  SofaHeaderText,
  SofaCustomInput,
} from "sofa-ui-components";
import { showAddItem } from "@/composables";
import { Logic } from "sofa-logic";
import {
  AllFolders,
  addFolder,
  currentFolder,
  folders,
  handleFolderNameBlur,
  selectedFilter,
  setFolders,
  selectedFolderMaterailToAdd,
  addMaterialToFolder,
  addFolderIsActive,
} from "@/composables/library";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";

export default defineComponent({
  components: {
    SofaModal,
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaCustomInput,
  },
  props: {
    close: {
      type: Function,
    },
  },
  setup(props) {
    watch(AllFolders, () => {
      setFolders();
    });

    onMounted(() => {
      if (!AllFolders.value) {
        Logic.Study.GetFolders({
          where: [
            {
              field: "user.id",
              value: Logic.Auth.AuthUser?.id,
              condition: Conditions.eq,
            },
          ],
        });
      }
      Logic.Study.watchProperty("AllFolders", AllFolders);
      setFolders();
    });

    const handleFolderSelected = (folderId: string) => {
      if (selectedFolderMaterailToAdd.value) {
        addMaterialToFolder(
          folderId,
          selectedFolderMaterailToAdd.value.type == "course"
            ? "course"
            : "quiz",
          selectedFolderMaterailToAdd.value.id
        );
        if (props.close) {
          props.close();
        }
      }
    };

    return {
      showAddItem,
      folders,
      currentFolder,
      selectedFilter,
      addFolderIsActive,
      handleFolderNameBlur,
      addFolder,
      handleFolderSelected,
    };
  },
});
</script>