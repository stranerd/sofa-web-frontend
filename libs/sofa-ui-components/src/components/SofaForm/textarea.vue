<template>
  <div class="flex w-full flex-col space-y-2 content">
    <sofa-normal-text v-if="hasTitle" customClass="!pb-2 font-bold">
      <slot name="title" />
    </sofa-normal-text>
    <div
      v-if="richEditor"
      :class="`w-full h-auto lg:text-sm mdlg:text-[12px] text-darkBody text-xs rounded-md ${textAreaStyle}  overflow-y-auto`"
      :id="`textarea${tabIndex}`"
    ></div>
    <textarea
      v-else
      v-model="valueContent"
      :placeholder="placeholder"
      :class="`w-full !min-h-[100px] px-3 py-3 text-darkBody placeholder-grayColor lg:text-sm mdlg:text-[12px]  focus:outline-none text-xs rounded-md ${textAreaStyle}  overflow-y-auto`"
    >
    </textarea>
  </div>
</template>
<script lang="ts">
import SofaNormalText from "../SofaTypography/normalText.vue";
import { defineComponent, onMounted, ref, toRef, watch } from "vue";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import SimpleImage from "@editorjs/simple-image";
import Checklist from "@editorjs/checklist";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";

export default defineComponent({
  components: {
    SofaNormalText,
  },
  props: {
    modelValue: {
      type: String,
      required: false,
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
  setup(props, context) {
    const tabIndex = Math.random();

    const editor = ref<EditorJS>();

    const contentUpdated = ref(false);

    const valueContent = ref("");

    watch(valueContent, () => {
      if (editor.value && props.richEditor) {
        editor.value?.isReady.then((value) => {
          if (valueContent.value) {
            const contentData = JSON.parse(valueContent.value);

            if (contentData.blocks.length == 0) {
              contentData.blocks[0] = {
                data: {
                  text: "",
                },
                id: "Z7IKqnnfme",
                type: "paragraph",
              };
            }
            editor.value?.render(contentData);
          } else {
            editor.value?.render({
              time: 1550476186479,
              blocks: [
                {
                  data: {
                    text: "",
                  },
                  id: "Z7IKqnnfme",
                  type: "paragraph",
                },
              ],
              version: "2.26.5",
            });
          }
        });
      }
    });

    const updateValueRef = toRef(props, "updateValue");

    watch(updateValueRef, () => {
      valueContent.value = props.updateValue;
    });

    watch(props, () => {
      if (props.richEditor) {
        valueContent.value = props.updateValue;
      } else {
        if (props.updateValue && !contentUpdated.value) {
          valueContent.value = props.updateValue;
          contentUpdated.value = true;
        }
      }
    });

    onMounted(() => {
      if (props.richEditor && editor.value == undefined) {
        let data: any = { time: 1550476186479, blocks: [], version: "2.26.5" };
        // if (props.modelValue) {
        //   valueContent.value = JSON.parse(props.modelValue);
        //   data = valueContent.value;
        // }

        let tools: any = {};

        if (props.toolsToUse) {
          const allTools = props.toolsToUse;

          if (allTools.includes("header")) {
            tools["header"] = {
              class: Header,
              inlineToolbar: true,
              config: {
                placeholder: "Header name...",
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 4,
              },
            };
          }

          if (allTools.includes("image")) {
            tools["image"] = SimpleImage;
          }

          if (allTools.includes("list")) {
            tools["list"] = {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
            };
          }

          if (allTools.includes("checklist")) {
            tools["checklist"] = {
              class: Checklist,
              inlineToolbar: true,
            };
          }

          if (allTools.includes("embed")) {
            tools["embed"] = Embed;
          }

          if (allTools.includes("quote")) {
            tools["quote"] = {
              class: Quote,
              inlineToolbar: true,
              shortcut: "CMD+SHIFT+O",
              config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote's author",
              },
            };
          }
        }

        editor.value = new EditorJS({
          holder: `textarea${tabIndex}`,
          tools,
          placeholder: props.placeholder,
          onChange: () => {
            editor.value
              ?.save()
              .then((outputData) => {
                context.emit("update:modelValue", JSON.stringify(outputData));
              })
              .catch((error) => {
                console.log("Saving failed: ", error);
              });
          },
          data,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          logLevel: "ERROR",
        });
      } else {
        if (props.modelValue) {
          valueContent.value = props.modelValue;
        }
      }
    });

    watch(valueContent, () => {
      if (!props.richEditor) {
        context.emit("update:modelValue", valueContent.value);
      }
    });

    const emptyValue = () => {
      valueContent.value = "";
    };

    return {
      valueContent,
      tabIndex,
      emptyValue,
    };
  },
});
</script>
