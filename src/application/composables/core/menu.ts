import { ref } from 'vue'

const showMenu = ref(false)
export const useMenu = () => {
	const toggleMenu = () => {
		showMenu.value = !showMenu.value
	}
	return { toggleMenu, showMenu }
}
