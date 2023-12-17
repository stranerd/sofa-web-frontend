<template>
	<div class="flex w-full flex-col relative">
		<SofaNormalText v-if="hasTitle" class="!pb-2 !font-bold">
			<slot name="title" />
		</SofaNormalText>
		<div class="w-full flex items-center group" :class="{ 'opacity-50': disabled }" :tabindex="tabIndex">
			<slot name="outer-prefix" />
			<div class="flew-grow w-full gap-1 flex items-center justify-between lg:text-sm mdlg:text-[12px] text-xs bg-transparent rounded-lg group-focus-within:!border-primaryBlue"
				:class="{ '!border-red-500 !border': validationStatus == false || error, [`${borderColor} ${padding} ${customClass}`]: true }">
				<span>
					<slot name="inner-prefix" />
				</span>
				<input v-model="content" :placeholder="placeholder" @blur="checkValidation()" @keypress="isNumber" :disabled="disabled" :type="fieldType" @keyup="detectKey"
					class="flex-grow bg-transparent text-darkBody placeholder-grayColor input w-full focus:outline-none lg:text-sm mdlg:text-[12px] text-xs" />
				<slot name="inner-suffix" />
				<span class="flex gap-2 items-center">
					<SofaIcon :name="fieldType == 'password' ? 'show' : 'hide'" :customClass="fieldType == 'password' ? 'md:!h-[18px] h-[14px]' : 'md:!h-[13px] h-[10px]'" v-if="type == 'password'"
						@click.stop="fieldType = fieldType == 'password' ? 'text' : 'password'" />
					<SofaIcon v-if="!validationStatus || error" name="error-state" class="md:!h-[18px] h-[15px]" />
				</span>
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
	components: {
		SofaNormalText,
		SofaIcon,
	},
	props: {
		padding: {
			type: String,
			default: 'p-3',
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
		},
		modelValue: {
			default: '',
		},
		defaultValue: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			default: 'text',
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
			type: String,
			default: '',
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
			default: ''
		}
	},
	name: 'SofaTextField',
	emits: ['update:modelValue', 'onEnter'],
	setup (props, context) {
		const content = computed({
			get: () => props.modelValue,
			set: (value) => {
				context.emit('update:modelValue', value)
			}
		})

		const fieldType = ref('text')

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
			if (props.defaultValue)  content.value = props.defaultValue
			if (props.type) fieldType.value = props.type

			if (props.isFormatted) {
				content.value = Logic.Common.convertToMoney(
					content.value ? content.value.toString().replace(/,/g, '') : 0,
					false,
					'',
					false
				)
			}
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
			if (content.value.length > count) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} must be more than ${count} characters`
			}
		}

		const isLessThan = (count: number) => {
			if (content.value.length < count) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} must be less than ${count} characters`
			}
		}

		const isEqualsTo = (count: number) => {
			if (content.value.length == count) {
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
			if (content.value.length >= count) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} must be more than ${count - 1
				} characters`
			}
		}

		const isLessThanOrEqualsTo = (count: number) => {
			if (content.value.length <= count) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = `${props.name} must be less than ${count + 1
				} characters`
			}
		}

		const isRegex = (regex: any, errMsg: string) => {
			if (content.value.match(regex)) {
				validationStatus.value = true
			} else {
				validationStatus.value = false
				errorMessage.value = errMsg
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

					if (rule.type == 'isRegex') {
						isRegex(rule.value, rule.errorMessage)
					}

					if (rule.type == 'isCondition') {
						isCondition(rule.value, rule.errorMessage)
					}
				}
			}
		}

		watch(content, () => {
			checkValidation()
			if (props.isFormatted) {
				content.value = Logic.Common.convertToMoney(
					content.value ? content.value.toString().replace(/,/g, '') : 0,
					false,
					'',
					false
				)
			}
		})

		watch(props, () => {
			if (props.updateValue) {
				if (props.updateValue == 'empty') {
					content.value = ''
				} else {
					content.value = props.updateValue
				}
			}
		})

		const isNumber = (evt: any) => {
			if (props.type != 'tel') return true

			evt = evt ? evt : window.event
			const charCode = evt.which ? evt.which : evt.keyCode
			if (
				charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
			) {
				evt.preventDefault()
			} else {
				return true
			}
		}

		const showError = (message: string) => {
			validationStatus.value = false
			errorMessage.value = message
		}

		const isFocused = ref(false)

		const tabIndex = Math.random()

		const emptyValue = () => {
			content.value = ''
		}

		const detectKey = (e: any) => {
			if (e.key === 'Enter' || e.keyCode === 13) {
				context.emit('onEnter', content.value)
			}
		}

		return {
			content,
			checkValidation,
			isNumber,
			errorMessage,
			validationStatus,
			showError,
			isFocused,
			tabIndex,
			fieldType,
			Logic,
			emptyValue,
			detectKey,
		}
	},
})
</script>
