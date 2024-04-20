import Screen from './Screen'
import Utils from './Utils'

export const $utils = new Utils()
export const $screen = new Screen()

global.$utils = $utils
global.$screen = $screen

export type { Screen, Utils }
