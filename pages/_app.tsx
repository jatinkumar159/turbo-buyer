import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import Navigation from './components/Navigation/Navigation'
import Footer from './components/Footer/Footer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  )
}
