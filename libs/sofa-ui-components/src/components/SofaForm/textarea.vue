<template>
  <div class="flex w-full flex-col gap-2 content">
    <sofa-normal-text v-if="hasTitle" customClass="!pb-2 font-bold">
      <slot name="title" />
    </sofa-normal-text>
    <math-field v-if="math" :id="tabIndex.toString()" ref="mathDisplay" :style="`min-height: max(${rows}em, 40px)`"
      :class="`w-full bg-transparent outline-none lg:text-sm mdlg:text-[12px] p-0 text-darkBody text-xs rounded-md ${textAreaStyle} overflow-y-auto`"
      @input="(e) => !disabled && (comp = e.target.value)">
      {{ comp }}
    </math-field>
    <textarea v-else v-model="comp" :placeholder="placeholder" :rows="rows" :disabled="disabled" :tabindex="0"
      :class="`w-full px-3 py-3 text-darkBody placeholder-grayColor lg:text-sm mdlg:text-[12px] bg-white  focus:outline-none text-xs rounded-md ${textAreaStyle}  overflow-y-auto`">
    </textarea>
    <p>{{ comp }}</p>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue"
import { VueEditor } from 'vue3-editor'
import SofaNormalText from "../SofaTypography/normalText.vue"

const toolbar = [
  [{ header: [2, 3, 4, 5, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ script: 'sub' }, { script: 'super' }, 'formula'],
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
    math: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  name: "SofaTextarea",
  emits: ["update:modelValue"],
  setup (props, context) {
    const tabIndex = Math.random()

    const mathDisplay = ref()

    const comp = computed({
      get: () => props.modelValue,
      set: (ev: string) => {
        context.emit('update:modelValue', ev)
      }
    })

    onMounted(async () => {
      await window.customElements.whenDefined('math-field')
      mathDisplay.value.setOptions({
        defaultMode: 'text',
        smartMode: false,
        mathModeSpace: '\\:',
        virtualKeyboardMode: 'manual'
      })
    })

    return {
      comp,
      tabIndex,
      toolbar,
      mathDisplay,
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

  input,
  textarea {
    color: inherit;
    background-color: white;
  }

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

  .ql-snow .ql-picker-label {
    padding-left: 2px;
  }

  .ql-editor.ql-blank::before {
    color: inherit;
  }

  &:focus-within .ql-toolbar {
    display: flex;
  }

  .ql-toolbar {
    border: none;
    display: none;
    gap: 2px;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    font-family: inherit !important;
    font-size: inherit !important;

    padding: 4px !important;

    .ql-formats {
      display: flex;
      gap: 1px;

      margin: 0 !important;

      .ql-expanded {
        position: static;

        .ql-picker-options {
          min-width: 0;
          top: 0;
          left: 0;
          // position: absolute;
        }
      }
    }
  }

  .ql-container.ql-snow {
    border: 0 !important;
  }

  .ql-editor {
    padding: auto 0;
    background: transparent;
    // border: 1px solid $color-itemBg;
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

  .ql-tooltip.ql-editing[data-mode="formula"] {
    left: 0 !important;
    top: 0 !important;
  }
}
</style>