<template>
  <div class="flex w-full flex-col gap-2 content">
    <sofa-normal-text v-if="hasTitle" customClass="!pb-2 font-bold">
      <slot name="title" />
    </sofa-normal-text>
    <VueEditor v-if="richEditor" v-model="comp" :editor-toolbar="toolbar" :id="`textarea${tabIndex}`" :disabled="disabled"
      :style="`min-height: calc(${rows}em)`"
      :class="`w-full lg:text-sm mdlg:text-[12px] text-darkBody text-xs rounded-md ${textAreaStyle} overflow-y-auto`"
      :placeholder="placeholder" />
    <textarea v-else v-model="comp" :placeholder="placeholder" :rows="rows" :disabled="disabled"
      :class="`w-full px-3 py-3 text-darkBody placeholder-grayColor lg:text-sm mdlg:text-[12px] bg-white  focus:outline-none text-xs rounded-md ${textAreaStyle}  overflow-y-auto`">
    </textarea>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue"
import { VueEditor } from 'vue3-editor'
import SofaNormalText from "../SofaTypography/normalText.vue"

const toolbar = [
  [{ header: [2, 3, 4, 5, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ script: 'sub' }, { script: 'super' }],
  ['code-block'],
  ['clean']
]

export default defineComponent({
  components: {
    SofaNormalText,
    VueEditor,
  },
  props: {
    modelValue: {
      type: String,
      required: false,
    },
    rows: {
      type: Number,
      required: false,
      default: 8,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasTitle: {
      type: Boolean,
      default: false,
    },
    labelStyle: {
      type: String,
      default: "",
    },
    toolsToUse: {
      type: Array as () => string[],
    },
    placeholder: {
      type: String,
      default: "",
    },
    textAreaStyle: {
      type: String,
      default: "max-h-[400px] bg-grey100  px-3 py-3 ",
    },
    updateValue: {
      type: String,
      default: "",
    },
    richEditor: {
      type: Boolean,
      default: true,
    },
  },
  name: "SofaTextarea",
  emits: ["update:modelValue"],
  setup (props, context) {
    const tabIndex = Math.random()

    const comp = computed({
      get: () => props.modelValue,
      set: (ev: string) => {
        context.emit('update:modelValue', ev)
      }
    })

    return {
      comp,
      tabIndex,
      toolbar,
    }
  },
})
</script>


<style lang="scss">
.quillWrapper {
  background: transparent;
  // min-height: 320px;
  border-radius: 0.5rem;
  color: inherit;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-family: inherit !important;
  font-size: inherit !important;

  .ql-container {
    font-family: inherit !important;
    font-size: inherit !important;
    flex: 1;
    min-height: 100%;
    display: flex;
    flex-direction: column;

    .ql-editor {
      flex: 1;
    }
  }

  .ql-editor.ql-blank::before {
    color: inherit;
  }

  .ql-toolbar {
    display: none;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    font-family: inherit !important;
    font-size: inherit !important;

    // padding: 4px 0 !important;

    .ql-formats {
      display: flex;

      // padding: 8px;
      margin: 0 !important;

      .ql-expanded {
        position: static;

        .ql-picker-options {
          min-width: 0;
          top: 0;
          left: 0;
          position: absolute;
        }
      }
    }
  }
}

.ql-container.ql-snow {
  border: 0 !important;
}

.ql-editor {
  padding: 0;
  background: transparent;
  // border: 1px solid $color-itemBg;
  border-radius: 0.5rem;
  transition: border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  font-family: inherit !important;
  font-size: inherit !important;
  min-height: unset;
}

.ql-editor:focus {
  outline: 0;

  // border: 0px solid $color-info;
  // box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.ql-editor.ql-blank::before {
  color: inherit;
  opacity: 0.35;
  font-style: normal;
}
</style>