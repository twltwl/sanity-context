import {useRef, useState} from 'react'
import {Autocomplete, Button, Card, Flex, Menu, MenuButton, MenuItem, Text} from '@sanity/ui'
import {CheckmarkIcon} from '@sanity/icons'
import type {ContextOption} from '../types'

/** Above this many options the plain menu is replaced by a filterable search field */
const SEARCH_THRESHOLD = 8

interface Props {
  id: string
  options: ContextOption[]
  value: string | undefined
  defaultValue: string
  onChange: (value: string) => void
}

function matches(query: string, option: ContextOption) {
  const q = query.toLowerCase().trim()
  return option.title.toLowerCase().includes(q) || option.value.toLowerCase().includes(q)
}

export function ContextSelect({id, options, value, defaultValue, onChange}: Props) {
  const [resetKey, setResetKey] = useState(0)
  const clearedRef = useRef(false)
  const titleOf = (val: string | undefined) => options.find((o) => o.value === val)?.title
  const currentTitle = titleOf(value) ?? titleOf(defaultValue) ?? options[0]?.title

  if (options.length <= SEARCH_THRESHOLD) {
    return (
      <MenuButton
        id={`sanity-context-menu-${id}`}
        button={
          <Button text={currentTitle} fontSize={1} padding={2} mode="ghost" style={{width: '100%'}} />
        }
        menu={
          <Menu data-context-ui>
            {options.map((opt) => (
              <MenuItem
                key={opt.value}
                text={opt.title}
                icon={value === opt.value ? CheckmarkIcon : undefined}
                onClick={() => onChange(opt.value)}
              />
            ))}
          </Menu>
        }
        popover={{placement: 'bottom-start', constrainSize: true}}
      />
    )
  }

  return (
    <Autocomplete
      // clearing wipes the field's internal value, and Autocomplete only re-reads `value` when
      // the prop itself changes — so restoring what it displays needs a remount
      key={resetKey}
      id={`sanity-context-autocomplete-${id}`}
      options={options}
      value={value}
      fontSize={1}
      padding={2}
      openButton
      openOnFocus
      placeholder="Search…"
      filterOption={matches}
      renderValue={(val, option) => option?.title ?? currentTitle ?? val}
      renderOption={(option) => (
        <Card as="button" padding={3} radius={2} data-context-ui style={{minWidth: 180}}>
          <Flex align="center" gap={2} justify="space-between">
            <Text size={1} textOverflow="ellipsis">
              {option.title}
            </Text>
            {option.value === value && (
              <Text size={1}>
                <CheckmarkIcon />
              </Text>
            )}
          </Flex>
        </Card>
      )}
      onChange={(next) => {
        // The clear button empties the field and reports no value. Treat that as clearing the
        // search text only — the selection stands until a new option is picked.
        if (!next) {
          clearedRef.current = true
          return
        }
        clearedRef.current = false
        onChange(next)
      }}
      onBlur={() => {
        // ...but if they walk away without picking, put the selection back on screen
        if (!clearedRef.current) return
        clearedRef.current = false
        setResetKey((k) => k + 1)
      }}
      // the field is narrow; let the list size to the option titles instead of the input
      popover={{placement: 'bottom-end', constrainSize: true, matchReferenceWidth: false}}
    />
  )
}
