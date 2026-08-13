import type {ContextDefinition, ContextEntry, ContextResolverContext, ContextsResolver, ContextState} from './types'

const DEFAULT_STORAGE_KEY = 'sanity-context'

let _definitions: ContextDefinition[] = []
let _storageKey = DEFAULT_STORAGE_KEY
let _state: ContextState = {}
let _resolver: ContextsResolver | null = null
const _listeners = new Set<() => void>()

function defaultState(definitions: ContextDefinition[]): ContextState {
  return Object.fromEntries(definitions.map((d) => [d.id, {enabled: false, value: d.defaultValue}]))
}

/** Whatever was persisted is untrusted — every field is read defensively below. */
function isStoredState(value: unknown): value is Partial<Record<string, Partial<ContextEntry>>> {
  return typeof value === 'object' && value !== null
}

function loadFromStorage(definitions: ContextDefinition[]): ContextState {
  if (typeof window === 'undefined') return defaultState(definitions)
  try {
    const raw = localStorage.getItem(_storageKey)
    if (!raw) return defaultState(definitions)
    const parsed: unknown = JSON.parse(raw)
    const saved = isStoredState(parsed) ? parsed : {}
    return Object.fromEntries(
      definitions.map((d) => [
        d.id,
        {
          enabled: !!saved[d.id]?.enabled,
          value: d.options.find((o) => o.value === saved[d.id]?.value)?.value ?? d.defaultValue,
        },
      ]),
    )
  } catch {
    return defaultState(definitions)
  }
}

function persist(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(_storageKey, JSON.stringify(_state))
  }
}

function notify(): void {
  _listeners.forEach((fn) => fn())
}

export function initContextStore(definitions: ContextDefinition[], storageKey?: string): void {
  _definitions = definitions
  _storageKey = storageKey ?? DEFAULT_STORAGE_KEY
  _state = loadFromStorage(definitions)
  notify()
}

export function setContextsResolver(resolver: ContextsResolver, storageKey?: string): void {
  _resolver = resolver
  _storageKey = storageKey ?? DEFAULT_STORAGE_KEY
}

export function resolveContexts(ctx: ContextResolverContext): void {
  if (!_resolver) return
  initContextStore(_resolver(ctx), _storageKey)
}

export function getContextDefinitions(): ContextDefinition[] {
  return _definitions
}

/** @public */
export function getContext(): ContextState {
  return _state
}

export function setContextEntry(id: string, patch: Partial<ContextEntry>): void {
  if (!_state[id]) return
  _state = {..._state, [id]: {..._state[id], ...patch}}
  persist()
  notify()
}

/** @public */
export function subscribeToContext(listener: () => void): () => void {
  _listeners.add(listener)
  return () => {
    _listeners.delete(listener)
  }
}
