import { ref } from 'vue'
import { Logic } from 'sofa-logic'

export const topBarTitle = ref('')
export const tabTitle = ref('')
export const backRoutePath = ref('')

export const showAddItem = ref(false)

export const handleShowAddItem = () => {
  showAddItem.value = true
}

export const scrollToTop = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'auto',
  })
}

export const scrollToBottom = (id = '') => {
  let height = document.body.scrollHeight

  if (id) {
    height = document.getElementById(id)?.scrollHeight

    document.getElementById(id)?.scroll({
      top: height,
      left: 0,
      behavior: 'auto',
    })
  } else {
    window.scroll({
      top: height,
      left: 0,
      behavior: 'auto',
    })
  }
}

export const FormValidations = Logic.Form

export const selectedSavingType = ref('')
export const selectedInvestmentType = ref('')
export const selectedPlanTab = ref('')
