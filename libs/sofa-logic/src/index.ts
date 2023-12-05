import { FileData } from './logic'

// export all components as vue plugin
export * from './common'
export * from './factories'
export * from './logic'

declare module 'valleyed/lib/types' {
    interface File extends FileData {}
}