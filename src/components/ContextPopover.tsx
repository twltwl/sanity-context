import {useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore} from 'react'
import {Button, Card, Layer, Portal, Stack, Text, Tooltip} from '@sanity/ui'
import {ContextIcon} from './ContextIcon'

import {ContextItem} from './ContextItem'
import {ContextSelect} from './ContextSelect'
import {getContext, getContextDefinitions, setContextEntry, subscribeToContext} from '../store'

function useContextState() {
  return useSyncExternalStore(subscribeToContext, getContext, getContext)
}

export function ContextPopover() {
  const [open, setOpen] = useState(false)
  const definitions = getContextDefinitions()
  const state = useContextState()
  const triggerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({top: 0, right: 0})

  const hasActive = Object.values(state).some((e) => e.enabled)

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setCoords({top: rect.bottom + 4, right: window.innerWidth - rect.right})
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Element
      if (triggerRef.current?.contains(target)) return
      if (cardRef.current?.contains(target)) return
      // Menus and the autocomplete list render in their own portals
      if (target.closest?.('[data-context-ui], [data-ui="Popover"]')) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <>
      <div ref={triggerRef}>
        <Tooltip content={<Text size={1}>Sanity context</Text>} placement="bottom" portal>
          <Button
            mode="bleed"
            icon={ContextIcon}
            selected={open}
            tone={hasActive ? 'primary' : 'default'}
            onClick={() => setOpen((v) => !v)}
          />
        </Tooltip>
      </div>
      {open && (
        <Portal>
          <Layer>
            <div
              ref={cardRef}
              style={{position: 'fixed', top: coords.top, right: coords.right}}
            >
              <Card data-context-ui padding={3} shadow={2} style={{minWidth: 300}}>
                <Stack space={3}>
                  {definitions.map((def) => {
                    const entry = state[def.id]

                    return (
                      <ContextItem
                        key={def.id}
                        id={`sanity-context-${def.id}`}
                        label={def.title}
                        enabled={entry?.enabled ?? false}
                        onToggle={(enabled) => setContextEntry(def.id, {enabled})}
                      >
                        <ContextSelect
                          id={def.id}
                          options={def.options}
                          value={entry?.value}
                          defaultValue={def.defaultValue}
                          onChange={(value) => setContextEntry(def.id, {value})}
                        />
                      </ContextItem>
                    )
                  })}
                </Stack>
              </Card>
            </div>
          </Layer>
        </Portal>
      )}
    </>
  )
}
