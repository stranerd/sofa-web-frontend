<template>
	<div class="flex w-full flex-col relative">
		<SofaNormalText v-if="hasTitle" class="!pb-2 !font-bold">
			<slot name="title" />
		</SofaNormalText>
		<div class="w-full flex items-center group" :class="{ 'opacity-50': disabled }" :tabindex="tabIndex">
			<slot name="outer-prefix" />
			<div
				class="flew-grow w-full gap-2 flex items-center justify-between lg:text-sm mdlg:text-[12px] text-xs bg-transparent rounded-lg group-focus-within:!border-primaryBlue"
				:class="{
					'!border-red-500 !border': validationStatus == false || error,
					[`${borderColor} ${padding} ${customClass}`]: true,
				}">
				<slot name="inner-prefix" />
				<input
					v-model="content"
					:placeholder="placeholder"
					:disabled="disabled"
					type="number"
					class="flex-grow bg-transparent text-darkBody placeholder:text-grayColor w-full focus:outline-none lg:text-sm mdlg:text-[12px] text-xs"
					@blur="checkValidation()"
					@keyup="detectKey" />
				<slot name="inner-suffix" />
				<SofaIcon v-if="!validationStatus || error" name="error-state" class="md:!h-[18px] h-[15px]" />
			</div>
			<slot name="outer-suffix" />
		</div>
		<div v-if="!validationStatus" class="w-full flex pt-1 justify-start">
			<SofaNormalText class="text-left !font-normal capitalize" color="text-primaryRed" :content="errorMessage" />
		</div>
		<div v-if="error" class="w-full flex pt-1 justify-start">
			<SofaNormalText class="text-left !font-normal" :content="error" color="text-primaryRed" />
		</div>
	</div>
</template>

<script lang="ts">
import { FormRule, Logic } from 'sofa-logic'
import { computed, defineComponent, onMounted, ref, toRef, watch } from 'vue'
import SofaIcon from '../SofaIcon'
import SofaNormalText from '../SofaTypography/normalText.vue'

export default defineComponent({
	name: 'SofaTextField',
	components: {
		SofaNormalText,
		SofaIcon,
	},
	props: {
		padding: {
			type: String,
			default: 'p-3 md:p-4',
		},
		placeholder: {
			type: String,
			default: '',
		},
		customClass: {
			type: String,
			default: '',
		},
		hasTitle: {
			type: Boolean,
			default: false,
		},
		rules: {
			type: Object as () => FormRule[],
			required: false,
			default: null,
		},
		modelValue: {
			type: Number,
			default: 0,
		},
		defaultValue: {
			type: Number,
			default: 0,
		},
		type: {
			type: String,
			default: 'number',
		},
		name: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		updateValue: {
			type: Number,
			default: 0,
		},
		isFormatted: {
			type: Boolean,
			default: false,
		},
		borderColor: {
			type: String,
			default: 'border-darkLightGray',
		},
		error: {
			type: String,
			default: '',
		},
	},
	emits: ['update:modelValue', 'onEnter'],
	setup(props, context) {
		const content = computed({
			get: () => props.modelValue,
			set: (value) => {
				context.emit('update:modelValue', value)
			},
		})

		watch(content, () => {
			setTimeout(() => {
				checkValidation()
			}, 500)
		})

		const defaultValueRef = toRef(props, 'defaultValue')

		watch(defaultValueRef, () => {
			content.value = props.defaultValue
		})

		onMounted(() => {
			if (props.defaultValue) content.value = props.defaultValue

			// if (props.isFormatted) {
			// 	content.value = Logic.Common.formatNumber(parseFloat(content.value), 2)
			// }
		})
		const validationStatus = ref(true)
		const errorMessage = ref('')

		const isRequired = () => {
			if (content.value) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} is required`
			}
		}

		const isGreaterThan = (count: number) => {
			if (content.value > count) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} must be more than ${count}`
			}
		}

		const isLessThan = (count: number) => {
			if (content.value < count) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} must be less than ${count}`
			}
		}

		const isEqualsTo = (count: number) => {
			if (content.value == count) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} must be ${count} characters`
			}
		}

		const isCondition = (condition: any, errMsg: string) => {
			if (condition) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = errMsg
			}
		}

		const isGreaterThanOrEqualsTo = (count: number) => {
			if (content.value >= count) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} must be more than ${count - 1}`
			}
		}

		const isLessThanOrEqualsTo = (count: number) => {
			if (content.value <= count) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} must be less than ${count + 1}`
			}
		}

		const checkValidation = () => {
			if (props.rules) {
				for (let index = 0; index < props.rules.length; index++) {
					const rule = props.rules[index]
					if (rule.type == 'isRequired') {
						isRequired()
					}

					if (rule.type == 'isGreaterThan') {
						isGreaterThan(rule.value)
					}

					if (rule.type == 'isLessThan') {
						isLessThan(rule.value)
					}

					if (rule.type == 'isEqualsTo') {
						isEqualsTo(rule.value)
					}

					if (rule.type == 'isGreaterThanOrEqualsTo') {
						isGreaterThanOrEqualsTo(rule.value)
					}

					if (rule.type == 'isLessThanOrEqualsTo') {
						isLessThanOrEqualsTo(rule.value)
					}

					if (rule.type == 'isCondition') {
						isCondition(rule.value, rule.errorMessage)
					}
				}
			}
		}

		watch(content, () => {
			checkValidation()
			// if (props.isFormatted) {
			// 	content.value = Logic.Common.formatNumber(parseFloat(content.value), 2)
			// }
		})

		watch(props, () => {
			if (props.updateValue) {
				if (props.updateValue == 0) {
					content.value = 0
				} else {
					content.value = props.updateValue
				}
			}
		})

		const showError = (message: string) => {
			validationStatus.value = false
			errorMessage.value = message
		}

		const isFocused = ref(false)

		const tabIndex = Math.random()

		const emptyValue = () => {
			content.value = 0
		}

		const detectKey = (e: any) => {
			if (e.key === 'Enter' || e.keyCode === 13) {
				context.emit('onEnter', content.value)
			}
		}

		return {
			content,
			checkValidation,
			errorMessage,
			validationStatus,
			showError,
			isFocused,
			tabIndex,
			Logic,
			emptyValue,
			detectKey,
		}
	},
})
</script>
