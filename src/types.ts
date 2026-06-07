import type {CurrentUser, Workspace} from 'sanity'

/** @public */
export interface ContextOption {
  value: string
  title: string
}

/** @public */
export interface ContextDefinition {
  id: string
  title: string
  options: ContextOption[]
  defaultValue: string
}

/** @public */
export interface ContextEntry {
  enabled: boolean
  value: string
}

/** @public */
export type ContextState = Record<string, ContextEntry>

/** @public */
export interface ContextResolverContext {
  currentUser: CurrentUser | null
  workspace: Workspace
}

/** @public */
export type ContextsResolver = (ctx: ContextResolverContext) => ContextDefinition[]

/** @public */
export interface ContextPluginConfig {
  contexts: ContextDefinition[] | ContextsResolver
  storageKey?: string
}
