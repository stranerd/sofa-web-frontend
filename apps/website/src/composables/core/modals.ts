import { modal } from './modal'

export const useOrganizationModal = () => modal.register('Organization', {})

export const allModals = [useOrganizationModal]

export const allPopovers = [] as typeof allModals
