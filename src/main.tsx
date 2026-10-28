import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { router } from './routes/AppRoutes'


const queryClient = new QueryClient();

// Emotion cache that flips MUI styles to RTL
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

// עיצוב: ערכת הנושא לפי ההדמיה "רך ומודרני" – אותם צבעים כמו ב-@theme שב-index.css.
// ירוק sage, כתום לפספוס, אפור-כחלחל למלאי נמוך, בלי אדום.
const shadowSoft = '0 1px 2px rgba(33,78,72,.05), 0 20px 40px -26px rgba(33,78,72,.45)'
// עיצוב: סוג כפתור חדש "soft" – גלולה אפורה-בהירה בלי מסגרת, לכפתורי "ביטול" (כמו בהדמיה)
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    soft: true
  }
}

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#39796B', dark: '#214E48', light: '#DDEBE3', contrastText: '#FFFFFF' },
    success: { main: '#39796B', dark: '#214E48', light: '#DDEBE3', contrastText: '#FFFFFF' },
    warning: { main: '#C2410C', dark: '#9A3412', light: '#FFEDD5', contrastText: '#FFFFFF' },
    error: { main: '#9A3412', dark: '#7C2D12', light: '#FFEDD5', contrastText: '#FFFFFF' },
    text: { primary: '#16242A', secondary: '#5B6E70' },
    background: { default: '#F5F8F5', paper: '#FFFFFF' },
    divider: '#E3ECE7',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Heebo', system-ui, 'Segoe UI', Arial, sans-serif",
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 18, minHeight: 40 },
        contained: {
          background: 'linear-gradient(135deg, #39796B, #2C6358)',
          boxShadow: '0 10px 24px -12px rgba(57,121,107,.75)',
          '&:hover': { background: 'linear-gradient(135deg, #2C6358, #214E48)' },
        },
        outlined: { borderColor: '#CFE0D7' },
      },
      variants: [
        {
          props: { variant: 'soft' },
          style: {
            backgroundColor: '#F2F6F4',
            color: '#16242A',
            '&:hover': { backgroundColor: '#C2410C', color: '#FFFFFF' }, // עיצוב: 'ביטול' נצבע כתום במעבר עכבר, כמו ה-X
          },
        },
      ],
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { borderRadius: 24, boxShadow: shadowSoft } },
    },
    MuiPaper: {
      styleOverrides: { rounded: { borderRadius: 20 } },
    },
    MuiCardActions: {
      styleOverrides: { root: { padding: '0 16px 14px', gap: 6, flexWrap: 'wrap' } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D5E2DC' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, borderRadius: 999 },
        colorDefault: { backgroundColor: '#F2F6F4', color: '#5B6E70' },
        // עיצוב: 'מלאי נמוך' בולט יותר – רקע אפור-כחלחל, מסגרת וטקסט כהים
        outlined: { backgroundColor: '#FED7AA', color: '#9A3412', border: 0 }, // עיצוב: 'מלאי נמוך' – הכתום של 'מושהה' בגרסה בהירה
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 28 } },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontWeight: 800, fontSize: 22 } },
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 700, fontSize: 16 } },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { backgroundColor: '#E9EFED', borderRadius: 14, padding: 4, gap: 4 },
        grouped: { border: 0, borderRadius: '10px !important' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          paddingInline: 20,
          color: '#5B6E70',
          '&.Mui-selected': { backgroundColor: '#FFFFFF', color: '#16242A', boxShadow: '0 1px 2px rgba(0,0,0,.08)' },
          '&.Mui-selected:hover': { backgroundColor: '#FFFFFF' },
        },
      },
    },
    MuiMenu: {
      styleOverrides: { paper: { borderRadius: 18, boxShadow: shadowSoft } },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <QueryClientProvider client={queryClient}>

            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>

          </QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>,
)
