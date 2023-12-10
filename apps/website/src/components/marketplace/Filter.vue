<template>
  <div class="w-full flex flex-col gap-6">
    <div class="w-full flex flex-col gap-3 px-4" v-if="selectedOptions.length">
      <div class="w-full flex items-center gap-2 justify-between">
        <sofa-normal-text :customClass="'!font-bold'">Applied filters</sofa-normal-text>
        <sofa-normal-text :color="'text-primaryPink'" :customClass="'cursor-pointer'"
          @click="selectedOptions.length = 0">Clear all</sofa-normal-text>
      </div>

      <div class="flex gap-3 flex-wrap items-center">
        <div v-for="(option, index) in selectedOptions" :key="index" class="w-auto pb-2">
          <span class="px-4 py-2 bg-primaryPurple rounded-custom flex flex-row items-center justify-center gap-1">
            <sofa-normal-text :color="'text-white'" :content="option.name" />
            <sofa-icon :customClass="'h-[18px] cursor-pointer'" @click="toggleOption(option)" :name="'close-white'" />
          </span>
        </div>
      </div>
    </div>

    <div class="w-full flex flex-col gap-3 px-4" v-for="(option, index) in searchOptions" :key="index">
      <a class="w-full flex items-center justify-between"
        @click="openOption = option.name === openOption ? '' : option.name">
        <div class="flex items-center gap-2">
          <sofa-icon :customClass="'h-[16px]'" :name="option.icon" />
          <sofa-normal-text :customClass="'!font-bold'" :content="option.name" />
        </div>
        <sofa-icon :customClass="'h-[7px]'" :name="option.name === openOption ? 'chevron-up' : 'chevron-down'" />
      </a>

      <div class="w-full flex flex-wrap gap-3" v-if="option.name === openOption">
        <a :class="`px-4 py-2 ${optionIsSelected(item.id) ? 'bg-primaryPurple' : 'bg-[#EFF2F5]'} rounded-custom flex items-center justify-center gap-1`"
          v-for="(item, index) in option.options" :key="index" @click="toggleOption(item)">
          <sofa-normal-text :color="`${optionIsSelected(item.id) ? 'text-white' : 'text-deepGray'}`"
            :content="item.name" />
        </a>
      </div>
    </div>

    <div class="h-[60px]"></div>
  </div>
  <div class="w-full flex flex-col bg-white mdlg:!hidden p-4 bottom-0 fixed left-0" @click.prevent="close?.()">
    <sofa-button :customClass="'w-full'" :padding="'py-3'">Show results</sofa-button>
  </div>
</template>

<script lang="ts">
import { Conditions, Logic } from "sofa-logic"
import { SofaButton, SofaIcon, SofaNormalText } from "sofa-ui-components"
import { computed, defineComponent, reactive, ref, watch } from "vue"

export type SelectedOption = {
  name: string
  id: string
  type: string
  query: {
    field: string
    value: any
    condition: Conditions
  }
}

export default defineComponent({
  props: {
    close: {
      type: Function,
    },
    modelValue: {
      type: Array as () => SelectedOption[],
      default: () => []
    },
  },
  components: {
    SofaNormalText,
    SofaIcon,
    SofaButton,
  },
  emits: ["update:modelValue"],
  setup (props, context) {
    const AllTopics = ref(Logic.Study.AllTopics)
    const AllOtherTags = ref(Logic.Study.AllOtherTags)

    const selectedOptions = reactive(props.modelValue)

    watch(selectedOptions, (value) => {
      context.emit('update:modelValue', value)
    }, { immediate: true })

    const searchOptions = computed(() => [
      {
        name: "Price",
        options: [
          {
            name: "Free",
            type: "price",
            id: "free",
            query: {
              field: "price.amount",
              value: 0,
              condition: Conditions.eq,
            },
          },
          {
            name: "Paid",
            type: "price",
            id: "paid",
            query: {
              field: "price.amount",
              value: 0,
              condition: Conditions.gt,
            },
          },
        ],
        icon: "price-filter",
      },
      {
        name: "Ratings",
        options: [4, 3, 2, 1].map((option) => ({
          name: `${option} stars and higher`,
          type: "ratings",
          id: option.toString(),
          query: {
            field: "ratings.avg",
            value: option,
            condition: Conditions.gte,
          },
        })),
        icon: "rating-filter",
      },
      {
        name: "Author",
        options: ['Student', 'Teacher', 'Organization'].map((option) => ({
          name: option,
          type: "author",
          id: option,
          query: {
            field: "user.type.type",
            value: option.toLowerCase(),
            condition: Conditions.eq,
          },
        })),
        icon: "author-filter",
      },
      {
        name: "Subject",
        options: AllTopics.value.results.map((tag) => ({
          name: tag.title,
          id: tag.id,
          type: "subject",
          query: {
            field: "topicId",
            value: tag.id,
            condition: Conditions.eq,
          },
        })),
        icon: "subject-filter",
      },
      {
        name: "Popular tags",
        options: AllOtherTags.value.results.map((tag) => ({
          name: tag.title,
          id: tag.id,
          type: "tags",
          query: {
            field: "tagIds",
            value: tag.id,
            condition: Conditions.in,
          },
        })),
        icon: "tag-filter",
      },
    ])

    const openOption = ref(searchOptions.value[0]?.name)

    const optionIsSelected = (id: string) => !!selectedOptions.find((item) => item.id == id)

    const toggleOption = (option: SelectedOption) => {
      if (optionIsSelected(option.id)) {
        const itemIndex = selectedOptions.indexOf(option)
        if (itemIndex > -1) selectedOptions.splice(itemIndex, 1)
      } else {
        // check it filter item of similar type exists, it yes remove before appending
        const typeIndex = selectedOptions.findIndex((o) => o.type === option.type)
        if (typeIndex > -1) selectedOptions.splice(typeIndex, 1, option)
        else selectedOptions.push(option)
      }
    }

    return {
      openOption,
      searchOptions,
      selectedOptions,
      optionIsSelected,
      toggleOption,
    }
  },
})
</script>
