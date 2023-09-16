<template>
  <div
    :class="`mdlg:!w-full ${
      isWrapped ? 'w-full' : 'w-[220px]'
    }  shadow-custom mdlg:!shadow-none flex ${
      isWrapped ? 'w-full' : 'flex-row '
    }  items-start space-x-3 px-3 py-3 justify-between rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] mdlg:!bg-ligthGray bg-white  ${customClass}`"
  >
    <div
      :class="`flex mdlg:!flex-row  ${
        isWrapped
          ? ' flex-row space-x-2'
          : ' flex-col space-y-2 mdlg:!space-y-0'
      } mdlg:space-x-3  mdlg:space-y-0 items-start w-full `"
    >
      <sofa-image-loader
        :photoUrl="activity.image"
        :customClass="`mdlg:!h-[115px]  ${
          isWrapped ? ' h-[100px] w-[150px]' : '  h-[120px] w-full'
        } mdlg:!w-[200px]  rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] relative`"
      >
        <div
          v-if="activity.progress > 0"
          :class="`absolute bottom-0 left-0 w-full px-2 rounded-b-[12px] bg-black bg-opacity-50  ${
            activity.progress < 100 ? 'py-2' : 'py-1'
          }`"
        >
          <div
            class="w-full h-[6px] rounded-[8px] bg-grayColor relative"
            v-if="activity.progress < 100"
          >
            <div
              class="h-full bg-white rounded-[8px]"
              :style="`width: ${activity.progress}%;`"
            ></div>
          </div>
          <sofa-normal-text
            v-else
            :customClass="'!text-xs !py-0 font-semibold w-full flex flex-row items-center justify-center'"
            :color="'text-white'"
            >Completed</sofa-normal-text
          >
        </div>
      </sofa-image-loader>
      <div class="grid grid-cols-10 w-full gap-2 items-center h-full relative">
        <div
          :class="`flex flex-col space-y-2 mdlg:!col-span-8 col-span-10 h-full w-full `"
        >
          <div class="w-full flex flex-row items-center justify-between">
            <sofa-normal-text
              :customClass="'!font-bold w-full text-left !line-clamp-1'"
              >{{ activity.title }}</sofa-normal-text
            >
            <div
              class="flex flex-row justify-end"
              v-if="hasEdit"
              @click.stop="editAction ? editAction() : null"
            >
              <sofa-icon :customClass="'h-[16px]'" :name="'edit-gray'" />
            </div>
          </div>
          <div class="flex flex-row space-x-2 items-center">
            <sofa-normal-text
              :color="
                activity.labels.color == 'pink'
                  ? 'text-primaryPurplePink'
                  : 'text-primaryPurple'
              "
            >
              {{ activity.labels.main }}
            </sofa-normal-text>
            <span
              :class="`h-[5px] w-[5px] rounded-full ${
                activity.labels.color == 'pink'
                  ? 'bg-primaryPurplePink'
                  : 'bg-primaryPurple'
              }`"
            >
            </span>
            <sofa-normal-text
              :color="
                activity.labels.color == 'pink'
                  ? 'text-primaryPurplePink'
                  : 'text-primaryPurple'
              "
              >{{ activity.labels.sub }}</sofa-normal-text
            >
          </div>

          <div class="w-full flex flex-row space-x-2 items-center">
            <sofa-icon :name="'star-full'" :custom-class="'h-[16px]'" />

            <div class="flex flex-row space-x-1 items-center">
              <sofa-normal-text> 4.0 </sofa-normal-text>
              <sofa-normal-text :color="'text-grayColor'">
                (24 ratings)
              </sofa-normal-text>
            </div>
          </div>

          <div
            class="flex flex-row items-center space-x-2 flex-grow justify-between w-full"
          >
            <div class="space-x-2 flex flex-row items-center">
              <div
                class="w-[20px] h-[20px] flex flex-row items-center justify-center bg-grayColor border-[1px] border-grayColor rounded-full"
              >
                <sofa-icon :customClass="'h-[13px]'" :name="'user'" />
              </div>
              <sofa-normal-text>
                {{ activity.username }}
              </sofa-normal-text>
            </div>

            <sofa-icon
              v-if="!isWrapped"
              :name="'bookmark'"
              :customClass="'h-[19px] mdlg:!hidden '"
            />
          </div>
        </div>
        <div
          :class="` flex-col ${
            centralizeExtras
              ? 'justify-center flex absolute right-[0%] z-40 top-0 h-full'
              : 'justify-between hidden'
          }  col-span-2 items-end !h-full cursor-pointer z-40 mdlg:flex`"
        >
          <slot name="extra" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SofaIcon from "../SofaIcon";
import { SofaNormalText } from "../SofaTypography";
import SofaImageLoader from "../SofaImageLoader";
import SofaBadge from "../SofaBadge";
import SofaButton from "../SofaButton";

export default defineComponent({
  components: {
    SofaIcon,
    SofaBadge,
    SofaImageLoader,
    SofaNormalText,
    SofaButton,
  },
  props: {
    customClass: {
      type: String,
      default: "bg-ligthGray",
    },
    activity: {
      type: Object as () => any,
      required: true,
    },
    isWrapped: {
      type: Boolean,
      default: false,
    },
    hasEdit: {
      type: Boolean,
      default: false,
    },
    editAction: {
      type: Function,
    },
    centralizeExtras: {
      type: Boolean,
      default: false,
    },
  },
  name: "SofaActivityCard",
});
</script>
