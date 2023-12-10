import { ref } from 'vue'
import { Logic } from 'sofa-logic'

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

export const FormValidations = Logic.Form
