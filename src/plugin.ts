import {definePlugin} from 'sanity'
import {initContextStore, setContextsResolver} from './store'
import {ContextNavbar} from './components/ContextNavbar'
import type {ContextPluginConfig} from './types'

/** @public */
export function contextPlugin(config: ContextPluginConfig) {
  if (typeof config.contexts === 'function') {
    setContextsResolver(config.contexts, config.storageKey)
  } else {
    initContextStore(config.contexts, config.storageKey)
  }

  return definePlugin({
    name: 'sanity-context',
    studio: {
      components: {navbar: ContextNavbar},
    },
  })()
}
