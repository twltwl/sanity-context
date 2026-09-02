import {Box, Flex, Label, Switch, Text} from '@sanity/ui'
import {Tooltip} from '@sanity/ui/tooltip'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'

interface Props {
  id: string
  label: string
  description?: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  children: React.ReactNode
}

export function ContextItem({id, label, description, enabled, onToggle, children}: Props) {
  return (
    <Flex align="center" justify="space-between" gap={4}>
      <Tooltip
        disabled={!description}
        content={
          <Box style={{maxWidth: 240}}>
            <Text size={1}>{description}</Text>
          </Box>
        }
        placement="bottom-start"
        portal
        delay={{open: 300}}
      >
        <Flex align="center" gap={1} style={{flexShrink: 0}}>
          <Flex align="center" gap={2} as="label" htmlFor={id} style={{cursor: 'pointer'}}>
            <Switch id={id} checked={enabled} onChange={(e) => onToggle(e.currentTarget.checked)} />
            <Label size={1}>{label}</Label>
          </Flex>
          {/* outside the <label> so reaching for the hint doesn't flip the switch */}
          {description && (
            <Text size={1} muted style={{cursor: 'help'}}>
              <InfoOutlineIcon />
            </Text>
          )}
        </Flex>
      </Tooltip>
      <Box style={{width: 180, opacity: enabled ? 1 : 0.35, pointerEvents: enabled ? 'auto' : 'none'}}>
        {children}
      </Box>
    </Flex>
  )
}
