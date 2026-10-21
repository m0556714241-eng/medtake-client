import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import './index.css'
import App from './App.tsx'

// Emotion cache that flips MUI styles to RTL
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

// Same values as the @theme colors in index.css
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#0E7A6F' },
    error: { main: '#B4231F' },
    warning: { main: '#8A5200' },
  },
  typography: {
    fontFamily: "'Heebo', system-ui, 'Segoe UI', Arial, sans-serif",
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>,
)
