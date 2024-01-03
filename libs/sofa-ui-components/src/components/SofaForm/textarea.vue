<template>
	<div class="flex w-full flex-col content">
		<sofa-normal-text v-if="hasTitle" customClass="!pb-4 font-bold">
			<slot name="title" />
		</sofa-normal-text>
		<VueEditor v-if="richEditor" v-model="comp" :editor-options="editorOptions" :disabled="disabled"
			:style="`min-height: ${rows}em`" @ready="(v) => quill = v"
			:class="`w-full lg:text-sm mdlg:text-[12px] text-darkBody text-xs rounded-md ${textAreaStyle} overflow-y-auto`"
			:placeholder="placeholder" :tabindex="0">
			<template v-slot:toolbar>
				<div :id="toolbarId" :class="{ '!hidden': disabled }">
					<button class="ql-bold"></button>
					<button class="ql-italic"></button>
					<button class="ql-underline"></button>
					<button class="ql-strike"></button>
					<button class="ql-script" value="sub"></button>
					<button class="ql-script" value="super"></button>
					<button class="ql-formula"></button>
					<button class="ql-code-block"></button>
				</div>
				<math-field ref="mathRef" class="w-full bg-white z-[10] px-4 !outline-primaryOrange text-darkBody absolute top-0"
					:class="{ 'hidden': !showMath || !quill }" @beforeinput="saveFormula">
					{{ mathText }}
				</math-field>
			</template>
		</VueEditor>
		<textarea v-else v-model="comp" :placeholder="placeholder" :rows="rows" :disabled="disabled" :tabindex="0"
			:class="`w-full p-3 text-darkBody placeholder:text-grayColor lg:text-sm mdlg:text-[12px] bg-white focus:outline-none text-xs rounded-md ${textAreaStyle}  overflow-y-auto`">
    </textarea>
		<div v-if="error" class="w-full flex pt-1 justify-start">
			<SofaNormalText class="text-left !font-normal" :content="error" color="text-primaryRed" />
		</div>
	</div>
</template>

<script lang="ts">
import 'mathlive'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { Quill, VueEditor } from 'vue3-editor'
import SofaNormalText from '../SofaTypography/normalText.vue'

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
			default: '',
		},
		toolsToUse: {
			type: Array as () => string[],
		},
		placeholder: {
			type: String,
			default: '',
		},
		textAreaStyle: {
			type: String,
			default: 'max-h-[400px] bg-grey100  px-3 py-3 ',
		},
		updateValue: {
			type: String,
			default: '',
		},
		richEditor: {
			type: Boolean,
			required: false,
			default: false,
		},
		error: {
			type: String,
			default: ''
		}
	},
	name: 'SofaTextarea',
	emits: ['update:modelValue'],
	setup (props, context) {
		const editorId = Math.random().toString(32).slice(2)
		const toolbarId = `toolbar-${editorId}`

		const quill = ref<Quill>()
		const mathRef = ref()
		const showMath = ref(false)
		const mathText = ref('')

		const comp = computed({
			get: () => props.modelValue,
			set: (v) => context.emit('update:modelValue', v)
		})

		const saveFormula = (e: Event) => {
			const target = e.target as HTMLInputElement
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			if (e.data === 'insertLineBreak') {
				quill.value.theme.tooltip.textbox.value = target.value.slice(2, -2)
				quill.value.theme.tooltip.root.querySelector('a.ql-action').click()

				showMath.value = false
				mathText.value = ''
			} else {
				mathText.value = target.value
			}
		}

		const editorOptions = {
			modules: {
				toolbar: {
					container: `#${toolbarId}`,
					handlers: {
						formula () {
							quill.value.theme.tooltip.edit('formula')
							quill.value.theme.tooltip.hide()

							showMath.value = !showMath.value
							if (showMath.value) setImmediate(() => {
								mathRef.value.focus()
								window.mathVirtualKeyboard.show()
							})
						}
					}
				}
			}
		}

		const leaveMathFieldFocus = () => {
			showMath.value = false
			window.mathVirtualKeyboard.hide()
		}

		onMounted(async () => {
			await window.customElements.whenDefined('math-field')
			const mf = mathRef.value
			if (!mf) return
			mf.defaultMode = 'text'
			mf.smartMode = false
			mf.mathModeSpace = '\\:'
			mf.mathVirtualKeyboardPolicy = 'manual'
			mf.addEventListener('focusout', leaveMathFieldFocus)
		})

		onBeforeUnmount(() => {
			const mf = mathRef.value
			if (!mf) return
			mf.removeEventListener('focusout', leaveMathFieldFocus)
		})

		return {
			comp,
			editorId,
			toolbarId,
			editorOptions,
			quill,
			showMath,
			mathRef,
			mathText,
			saveFormula,
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
    border: none !important;
    display: none;
    gap: 2px;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    font-family: inherit !important;
    font-size: inherit !important;
    justify-content: center;

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
    padding: 0 !important;
    background: transparent;
    // border: 1px solid $color-itemBg;
    transition: border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
    font-family: inherit !important;
    font-size: inherit !important;
    min-height: 100%;
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
    right: 0 !important;
    left: 0 !important;
  }

  .ql-tooltip.ql-editing[data-mode="formula"] {
    left: 0 !important;
    top: 0 !important;
  }
}
</style>