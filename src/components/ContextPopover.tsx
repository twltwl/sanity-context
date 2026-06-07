import {useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore} from 'react'
import {Button, Card, Layer, Menu, MenuButton, MenuItem, Portal, Stack, Text, Tooltip} from '@sanity/ui'
import {CheckmarkIcon} from '@sanity/icons'
import {ContextIcon} from './ContextIcon'

import {ContextItem} from './ContextItem'
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
      if (target.closest?.('[data-context-ui]')) return
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
              <Card data-context-ui padding={3} shadow={2} style={{minWidth: 260}}>
                <Stack space={3}>
                  {definitions.map((def) => {
                    const entry = state[def.id]
                    const currentTitle =
                      def.options.find((o) => o.value === entry?.value)?.title ??
                      def.options[0]?.title

                    return (
                      <ContextItem
                        key={def.id}
                        id={`sanity-context-${def.id}`}
                        label={def.title}
                        enabled={entry?.enabled ?? false}
                        onToggle={(enabled) => setContextEntry(def.id, {enabled})}
                      >
                        <MenuButton
                          button={
                            <Button
                              text={currentTitle}
                              fontSize={1}
                              padding={2}
                              mode="ghost"
                              style={{width: '100%'}}
                            />
                          }
                          id={`sanity-context-menu-${def.id}`}
                          menu={
                            <Menu data-context-ui>
                              {def.options.map((opt) => (
                                <MenuItem
                                  key={opt.value}
                                  text={opt.title}
                                  icon={entry?.value === opt.value ? CheckmarkIcon : undefined}
                                  onClick={() => setContextEntry(def.id, {value: opt.value})}
                                />
                              ))}
                            </Menu>
                          }
                          popover={{placement: 'bottom-start'}}
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
