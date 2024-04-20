import Screen from './Screen'
import Utils from './Utils'

export const $utils = new Utils()
export const $screen = new Screen()

globalThis.$utils = $utils
globalThis.$screen = $screen

export type { Screen, Utils }
