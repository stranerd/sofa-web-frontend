import { FileData } from './logic'

export * from 'valleyed'

// export all components as vue plugin
export * from './factories'
export * from './logic'

declare module 'valleyed/lib/types' {
    type File = FileData
}