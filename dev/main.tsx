/**
 * Local preview harness — `npm run dev`.
 *
 * Renders the context popover in a stand-in navbar so the UI can be checked
 * without linking the plugin into a real Studio. Note that it mounts
 * `ContextPopover` directly, so the `ContextNavbar` resolver path
 * (`useCurrentUser` / `useWorkspace`) is NOT exercised here — use
 * `npm run link-watch` against a real Studio for that.
 */
import {useEffect, useSyncExternalStore} from 'react'
import {createRoot} from 'react-dom/client'
import {Box, Card, Container, Flex, Stack, Text, ThemeProvider} from '@sanity/ui'
import {Code} from '@sanity/ui/code'
import {buildTheme} from '@sanity/ui/theme'
// v4 ships static styles as a plain stylesheet rather than injecting them at runtime. The Studio
// loads this itself; this standalone harness has to.
import '@sanity/ui/styles.css'

import {ContextPopover} from '../src/components/ContextPopover'
import {getContext, initContextStore, setContextEntry, subscribeToContext} from '../src/store'

const LOCALES = [
  'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IE', 'de-DE', 'de-AT', 'de-CH',
  'fr-FR', 'fr-BE', 'fr-CA', 'es-ES', 'es-MX', 'es-AR', 'it-IT', 'pt-PT',
  'pt-BR', 'nl-NL', 'nl-BE', 'sv-SE', 'nb-NO', 'da-DK', 'fi-FI', 'pl-PL',
  'cs-CZ', 'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW', 'ar-AE',
]

const languageNames = new Intl.DisplayNames(['en'], {type: 'language'})

initContextStore(
  [
    {
      // 3 options -> plain menu
      id: 'brand',
      title: 'Brand',
      description: 'Which brand’s content the Studio shows. Affects document lists and previews.',
      options: [
        {value: 'acme', title: 'Acme'},
        {value: 'globex', title: 'Globex'},
        {value: 'initech', title: 'Initech'},
      ],
      defaultValue: 'acme',
    },
    {
      // 8 options -> still a plain menu (the threshold boundary)
      id: 'market',
      title: 'Market',
      description: 'The regional market to scope content to — countries sharing pricing and campaigns.',
      options: [
        'Nordics', 'DACH', 'Benelux', 'UK & Ireland', 'France', 'Iberia', 'Italy', 'APAC',
      ].map((title) => ({value: title.toLowerCase().replace(/\W+/g, '-'), title})),
      defaultValue: 'nordics',
    },
    {
      // 30 options -> searchable. No description — shows an un-annotated title for comparison.
      id: 'locale',
      title: 'Locale',
      options: LOCALES.map((value) => ({value, title: `${languageNames.of(value)} (${value})`})),
      defaultValue: 'en-US',
    },
  ],
  'sanity-context-preview',
)

// start with every dimension switched on so the selects are interactive
for (const id of ['brand', 'market', 'locale']) setContextEntry(id, {enabled: true})

function StateReadout() {
  const state = useSyncExternalStore(subscribeToContext, getContext, getContext)
  return <Code size={1}>{JSON.stringify(state, null, 2)}</Code>
}

function App() {
  // ?open=1 opens the popover on load, &q=ger types into the locale search — handy for screenshots
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!params.has('open')) return
    document.querySelector<HTMLButtonElement>('#fake-navbar button')?.click()

    if (params.has('scenario-clear')) {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
      const type = (input: HTMLInputElement, text: string) => {
        input.focus()
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, text)
        input.dispatchEvent(new Event('input', {bubbles: true}))
      }
      // stages: select -> clear -> search -> blur
      const stage = params.get('scenario-clear') || 'clear'
      void (async () => {
        await sleep(150)
        const field = () =>
          document.querySelector<HTMLInputElement>('#sanity-context-autocomplete-locale')!

        // pick a non-default option
        type(field(), 'ger')
        await sleep(250)
        document
          .querySelector<HTMLElement>('#sanity-context-autocomplete-locale-listbox [data-context-ui]')
          ?.click()
        await sleep(250)
        if (stage === 'select') return

        document.querySelector<HTMLButtonElement>('[data-qa="clear-button"]')?.click()
        await sleep(250)
        if (stage === 'clear') return

        if (stage === 'search') {
          type(field(), 'fre')
          return
        }

        // walk away without picking anything
        field().blur()
        document.querySelector<HTMLElement>('#fake-navbar')?.focus()
      })()
      return
    }

    const query = params.get('q')
    if (query === null) return
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('#sanity-context-autocomplete-locale')
      if (!input) return
      input.focus()
      // React tracks the value on the DOM node, so bypass its setter to fire a real change
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, query)
      input.dispatchEvent(new Event('input', {bubbles: true}))
    }, 100)
  }, [])

  return (
    <ThemeProvider theme={buildTheme()}>
      <Card tone="transparent" style={{minHeight: '100vh'}}>
        {/* stand-in for the Studio navbar */}
        <Card id="fake-navbar" shadow={1} paddingY={2} paddingX={3}>
          <Flex align="center" justify="space-between">
            <Text weight="semibold">My Studio</Text>
            <ContextPopover />
          </Flex>
        </Card>

        <Container width={1} paddingX={4} paddingY={5}>
          <Stack gap={4}>
            <Text size={1} muted>
              Click the context icon in the top right. <b>Brand</b> (3) and <b>Market</b> (8) render a
              plain menu; <b>Locale</b> (30) renders the searchable field — type to narrow it.{' '}
              <b>Brand</b> and <b>Market</b> carry a <code>description</code>, so their titles show an
              info icon and a tooltip on hover; <b>Locale</b> has none.
            </Text>
            <Box>
              <StateReadout />
            </Box>
          </Stack>
        </Container>
      </Card>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
