<template>
  <div class="w-full flex flex-col gap-6">
    <div class="w-full flex flex-col gap-3 px-4" v-if="selectedOptions.length">
      <div class="w-full flex flex-row items-center gap-2 justify-between">
        <sofa-normal-text :customClass="'!font-bold'">Applied filters</sofa-normal-text>

        <sofa-normal-text :color="'text-primaryPink'" :customClass="'cursor-pointer'"
          @click="selectedOptions.length = 0">Clear all</sofa-normal-text>
      </div>

      <div class="flex flex-row gap-3 flex-wrap items-center">
        <div v-for="(option, index) in selectedOptions" :key="index" class="w-auto pb-2">
          <span class="px-4 py-2 bg-primaryPurple custom-border flex flex-row items-center justify-center gap-1">
            <sofa-normal-text :color="'text-white'">{{
              option.name
            }}</sofa-normal-text>
            <sofa-icon :customClass="'h-[18px] cursor-pointer'" @click="toggelOption(option)" :name="'close-white'" />
          </span>
        </div>
      </div>
    </div>

    <div class="w-full flex flex-col gap-3 px-4" v-for="(option, index) in searchOptions" :key="index">
      <div class="w-full flex flex-row items-center justify-between cursor-pointer" @click="
        option.opened ? (option.opened = false) : (option.opened = true)
        ">
        <div class="flex flex-row items-center gap-2">
          <sofa-icon :customClass="'h-[16px]'" :name="option.icon" />

          <sofa-normal-text :customClass="'!font-bold'">{{
            option.name
          }}</sofa-normal-text>
        </div>
        <sofa-icon :customClass="'h-[7px]'" :name="option.opened ? 'chevron-up' : 'chevron-down'" />
      </div>

      <div class="w-full flex flex-row flex-wrap gap-3" v-if="option.opened">
        <span :class="`px-4 py-2  ${optionIsSelected(item.id) ? 'bg-primaryPurple' : 'bg-[#EFF2F5]'
          } custom-border flex flex-row items-center justify-center gap-1  cursor-pointer`"
          v-for="(item, index) in option.options" :key="index" @click="toggelOption(item)">
          <sofa-normal-text :color="`${optionIsSelected(item.id) ? 'text-white' : 'text-deepGray'
            } `">{{ item.name }}</sofa-normal-text>
        </span>
      </div>
    </div>
    <div class="h-[60px]"></div>
  </div>
  <div class="w-full flex flex-col bg-white mdlg:!hidden px-4 py-4 bottom-0 fixed left-0"
    @click.prevent="close ? close() : null">
    <sofa-button :customClass="'w-full'" :padding="'py-3'">
      Show results
    </sofa-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue"
import { SofaNormalText, SofaIcon, SofaButton } from "sofa-ui-components"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic/src/logic/types/domains/common"
import { search } from "@/composables/marketplace"

export default defineComponent({
  props: {
    close: {
      type: Function,
    },
    updateValue: {
      type: Array as () => any[],
      default: () => {
        return []
      },
    },
    searchQuery: {
      type: String,
      default: "",
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

    const selectedOptions = reactive<
      {
        name: string
        active: boolean
        id: string
        type: string
        query?: {
          field: string
          value: any
          condition: string
        }
      }[]
    >([])

    const optionIsSelected = (id: string) => {
      return selectedOptions.filter((item) => item.id == id).length
    }

    const typeExist = (type: string) => {
      return selectedOptions.filter((item) => item.type == type).length
    }

    const toggelOption = (option: any) => {
      if (optionIsSelected(option.id)) {
        const itemIndex = selectedOptions.indexOf(option)

        if (itemIndex > -1) {
          selectedOptions.splice(itemIndex, 1)
        }
      } else {
        // check it filter item of similar type exists, it yes remove before appending
        if (typeExist(option.type)) {
          let currentOptions = JSON.parse(JSON.stringify(selectedOptions))
          currentOptions = currentOptions.filter(
            (item) => item.type != option.type
          )
          selectedOptions.length = 0
          selectedOptions.push(...currentOptions)
          selectedOptions.push(option)
        } else {
          selectedOptions.push(option)
        }
      }
    }

    const searchOptions = reactive([
      {
        name: "Price",
        options: [
          {
            name: "Free",
            active: false,
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
            active: false,
            id: "paid",
            type: "price",
            query: {
              field: "price.amount",
              value: 0,
              condition: Conditions.gt,
            },
          },
        ],
        opened: true,
        icon: "price-filter",
      },
      {
        name: "Subject",
        options: [],
        opened: true,
        icon: "subject-filter",
      },
      {
        name: "Popular tags",
        options: [],
        opened: false,
        icon: "tag-filter",
      },
      {
        name: "Rating",
        options: [
          {
            name: "4 stars and higher ",
            active: false,
            type: "ratings",
            id: "4",
          },
          {
            name: "3 stars and higher",
            active: false,
            type: "ratings",
            id: "3",
          },
          {
            name: "2 stars and higher",
            active: false,
            type: "ratings",
            id: "2",
          },
          {
            name: "1 star and higher ",
            active: false,
            type: "ratings",
            id: "1",
          },
        ],
        opened: false,
        icon: "rating-filter",
      },
      {
        name: "Author",
        options: [
          {
            name: "Student",
            active: false,
            type: "author",
            id: "student",
          },
          {
            name: "Teacher",
            active: false,
            type: "author",
            id: "teacher",
          },
        ],
        opened: false,
        icon: "author-filter",
      },
    ])

    const setSearchOption = () => {
      const allSubjects = AllTopics.value.results.map((tag) => {
        return {
          name: tag.title,
          active: false,
          id: tag.id,
          type: "subject",
          query: {
            field: "topicId",
            value: tag.id,
            condition: Conditions.eq,
          },
        }
      })

      const allOtherTags = AllOtherTags.value.results.map((tag) => {
        return {
          name: tag.title,
          active: false,
          id: tag.id,
          type: "tags",
          query: {
            field: "tagIds",
            value: tag.id,
            condition: Conditions.in,
          },
        }
      })

      searchOptions.forEach((item) => {
        if (item.name == "Subject") {
          item.options = allSubjects
        }

        if (item.name == "Popular tags") {
          item.options = allOtherTags
        }
      })
    }

    const setQueryConditions = () => {
      const allQueries = {
        where: [],
      }

      selectedOptions.forEach((item) => {
        if (item.query) {
          allQueries.where.push(JSON.parse(JSON.stringify(item.query)))
        }
      })

      Logic.Common.debounce(() => {
        search(allQueries)
      }, 500)
    }

    watch(selectedOptions, () => {
      const userFilter = selectedOptions.filter((item) => item.type == "user")

      if (userFilter.length == 0) {
        setQueryConditions()
        context.emit("update:modelValue", selectedOptions)
      }
    })

    onMounted(() => {
      setSearchOption()
      if (props.updateValue) {
        setTimeout(() => {
          console.log(props.updateValue)
          selectedOptions.push(...props.updateValue)
        }, 300)
      }
    })

    return {
      searchOptions,
      selectedOptions,
      optionIsSelected,
      toggelOption,
    }
  },
})
</script>
