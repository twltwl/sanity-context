import {useEffect, useRef} from 'react'
import {type NavbarProps, useCurrentUser, useWorkspace} from 'sanity'
import {Box, Card, Flex} from '@sanity/ui'
import {resolveContexts} from '../store'
import {ContextPopover} from './ContextPopover'

export function ContextNavbar(props: NavbarProps) {
  const currentUser = useCurrentUser()
  const workspace = useWorkspace()
  const resolved = useRef(false)

  useEffect(() => {
    if (resolved.current || !currentUser) return
    resolveContexts({currentUser, workspace})
    resolved.current = true
  }, [currentUser, workspace])

  return (
    <Flex style={{width: '100%'}}>
      <Box flex={1} style={{minWidth: 0}}>
        {props.renderDefault(props)}
      </Box>
      <Card borderBottom style={{display: 'flex', alignItems: 'center', paddingRight: 8}}>
        <ContextPopover />
      </Card>
    </Flex>
  )
}
