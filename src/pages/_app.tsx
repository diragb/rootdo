// Packages:
import { Inter } from 'next/font/google'

// Typescript:
import type { AppProps } from 'next/app'

// Components:
import Navbar from '@/components/secondaries/Navbar'

// Context:
import { ThemeProvider } from '@/components/theme-provider'

// Styles:
import '@/styles/globals.css'

// Constants:
const inter = Inter({ subsets: ['latin'] })

// Functions:
const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider
    attribute='class'
    defaultTheme='system'
    enableSystem
    disableTransitionOnChange
  >
    <main className={`w-screen h-screen ${inter.className}`}>
      <Navbar />
      <Component {...pageProps} />
    </main>
  </ThemeProvider>
)

// Exports:
export default App
