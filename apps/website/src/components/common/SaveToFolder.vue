<template>
  <!-- create item action -->
  <sofa-modal :close="() => {
    close ? close() : null
  }
    " :can-close="true">
    <div class="mdlg:!w-[60%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative"
      @click.stop="() => {
        //
      }
        ">
      <div
        class="bg-white w-full flex flex-col lg:!px-6 md:!gap-4 gap-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
        <div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
          <sofa-header-text :customClass="'text-xl'">
            Save to
          </sofa-header-text>
        </div>

        <div
          class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-[#F1F6FA] border-b-[1px] px-4">
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            Save to
          </sofa-normal-text>
          <sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="close ? close() : null" />
        </div>

        <div class="w-full flex flex-col gap-3 px-4 py-4">
          <div
            class="w-full flex flex-row items-center gap-3 justify-between px-4 py-4 custom-border bg-[#F1F6FA] cursor-pointer"
            v-for="(item, index) in folders" :key="index">
            <div class="flex flex-row items-center gap-
              <sofa-icon :name="'folder'" :customClass="'h-[18px]'" />

                  <sofa-custom-input
                    v-if="item.edit" :custom-class="` ${selectedFilter == item.id ? '!font-bold' : ''
                      } lg:text-sm mdlg:text-[12px] text-xs w-full  cursor-text !bg-white`" :updateValue="item.name"
              @blur="
                item.edit = false
              handleFolderNameBlur();
              " :placeholder="'Folder name'" @onContentChange="(content) => {
  item.name = content
  currentFolder.name = content
  currentFolder.id = item.id
}
  ">
              </sofa-custom-input>

              <sofa-normal-text v-else>
                {{ item.name }}
              </sofa-normal-text>
            </div>

            <div class="flex justify-end flex-row">
              <sofa-normal-text :color="'text-primaryRed'" :custom-class="'cursor-pointer'" @click="
                !addFolderIsActive
                  ? handleFolderSelected(item.id, false)
                  : null
                " v-if="item.items.includes(selectedFolderMaterailToAdd.id)">- Remove</sofa-normal-text>
              <sofa-normal-text :color="'text-primaryBlue'" :custom-class="'cursor-pointer'" @click="
                !addFolderIsActive ? handleFolderSelected(item.id) : null
                " v-else>+ Add</sofa-normal-text>
            </div>
          </div>
          <div class="w-full flex flex-row items-center gap--4 py-4 custom-border bg-[#F1F6FA] cursor-pointer"
            @click="addFolder()">
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
import { showAddItem } from "@/composables"
import {
  AllFolders,
  addFolder,
  addFolderIsActive,
  addMaterialToFolder,
  currentFolder,
  folders,
  handleFolderNameBlur,
  selectedFilter,
  selectedFolderMaterailToAdd,
  setFolders,
} from "@/composables/library"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic/src/logic/types/domains/common"
import {
  SofaCustomInput,
  SofaHeaderText,
  SofaIcon,
  SofaModal,
  SofaNormalText,
} from "sofa-ui-components"
import { defineComponent, onMounted, watch } from "vue"

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
  setup () {
    watch(AllFolders, () => {
      setFolders()
    })

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
        })
      }
      Logic.Study.watchProperty("AllFolders", AllFolders)
      setFolders()
    })

    const handleFolderSelected = (folderId: string, add = true) => {
      if (selectedFolderMaterailToAdd.value) {
        addMaterialToFolder(
          folderId,
          selectedFolderMaterailToAdd.value.type == "course"
            ? "course"
            : "quiz",
          selectedFolderMaterailToAdd.value.id,
          add
        )
        // if (props.close) {
        //   props.close();
        // }
      }
    }

    return {
      showAddItem,
      folders,
      currentFolder,
      selectedFilter,
      addFolderIsActive,
      selectedFolderMaterailToAdd,
      handleFolderNameBlur,
      addFolder,
      handleFolderSelected,
    }
  },
})
</script>
