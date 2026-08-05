import {Box, Flex, Label, Switch} from '@sanity/ui'

interface Props {
  id: string
  label: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  children: React.ReactNode
}

export function ContextItem({id, label, enabled, onToggle, children}: Props) {
  return (
    <Flex align="center" justify="space-between" gap={4}>
      <Flex
        align="center"
        gap={2}
        as="label"
        htmlFor={id}
        style={{cursor: 'pointer', flexShrink: 0}}
      >
        <Switch
          id={id}
          checked={enabled}
          onChange={(e) => onToggle(e.currentTarget.checked)}
        />
        <Label size={1}>{label}</Label>
      </Flex>
      <Box style={{width: 180, opacity: enabled ? 1 : 0.35, pointerEvents: enabled ? 'auto' : 'none'}}>
        {children}
      </Box>
    </Flex>
  )
}
