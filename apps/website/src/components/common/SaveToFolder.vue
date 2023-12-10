<template>
  <!-- create item action -->
  <sofa-modal :close="() => close?.()" :can-close="true">
    <div class="mdlg:!w-[60%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative">
      <div
        class="bg-white w-full flex flex-col lg:!px-6 md:!gap-4 gap-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
        <div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
          <sofa-header-text :customClass="'text-xl'" content="Save to" />
        </div>

        <div
          class="w-full flex justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-[#F1F6FA] border-b px-4">
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            Save to
          </sofa-normal-text>
          <sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="close?.()" />
        </div>

        <div class="w-full flex flex-col gap-3 px-4 py-4">
          <a class="w-full flex items-center gap-3 justify-between p-4 rounded-custom bg-[#F1F6FA]"
            v-for="item in folders" :key="item.id">
            <div class="flex items-center w-full gap-3">
              <sofa-icon :name="'folder'" :customClass="'h-[18px]'" />

              <sofa-custom-input v-if="item.id === factory.entityId" v-model="factory.title"
                :custom-class="`lg:text-sm mdlg:text-[12px] text-xs w-full  cursor-text !bg-white`" @onBlur="saveFolder"
                @onEnter="saveFolder" placeholder="Folder name" />

              <sofa-normal-text class="truncate w-full" v-else>
                {{ item.title }}
              </sofa-normal-text>
            </div>

            <div class="flex items-center flex-shrink-0">
              <SofaNormalText color="text-primaryRed" as="a" @click="handleFolderSelected(item.id, false)"
                v-if="[...item.saved.courses, ...item.saved.quizzes].includes(material.id)" content="- Remove" />
              <SofaNormalText color="text-primaryBlue" as="a" @click="handleFolderSelected(item.id)" content="+ Add"
                v-else />
            </div>
          </a>
          <a class="w-full flex items-center gap-3 p-4 rounded-custom bg-[#F1F6FA]" @click="generateNewFolder">
            <sofa-icon :customClass="'h-[18px]'" :name="'add-card'" />
            <sofa-normal-text :customClass="'text-grayColor'">
              Add new folder
            </sofa-normal-text>
          </a>
        </div>
      </div>
    </div>
  </sofa-modal>
</template>

<script lang="ts" setup>
import { addMaterialToFolder } from "@/composables/library"
import { useEditFolder, useMyFolders } from '@/composables/study/folders'
import {
  SofaCustomInput,
  SofaHeaderText,
  SofaIcon,
  SofaModal,
  SofaNormalText,
} from "sofa-ui-components"
import { defineProps } from "vue"

const props = defineProps({
  close: {
    type: Function
  },
  material: {
    type: Object,
    required: true
  }
})

const { folders } = useMyFolders()
const { factory, saveFolder, generateNewFolder } = useEditFolder()

const handleFolderSelected = (folderId: string, add = true) => {
  if (props.material) {
    addMaterialToFolder(
      folderId,
      props.material.type == "course" ? "courses" : "quizzes",
      props.material.id,
      add
    )
  }
}
</script>
