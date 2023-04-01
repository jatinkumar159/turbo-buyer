import { Provider } from 'react-redux'
import { Flex, ChakraProvider, Center, Spinner } from '@chakra-ui/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import store from '../redux/store'
import Navigation from '../components/Navigation/Navigation'
import '../styles/globals.css'
import styles from './../styles/app.module.scss'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'
import 'nprogress/nprogress.css'
import Head from 'next/head'
import useRouteChange from '../utils/hooks/useRouteChange'
import { mulish, theme } from '../utils/configurations/chakraTheme'
import useShopifyConfig from '../utils/hooks/useShopifyConfig'
import { useAppDispatch } from '../redux/hooks'
import { setBrandLogoUrl, setIsOtpRequired } from '../redux/slices/settingsSlice'
import { useEffect } from 'react'

const queryClient = new QueryClient()

function InitApp() {
  const dispatch = useAppDispatch()
  const shopifyConfig: any = useShopifyConfig()
  
  useEffect(() => {
    if(shopifyConfig?.hasOwnProperty('requireOtp')) {
      dispatch(setIsOtpRequired(shopifyConfig.requireOtp))
      dispatch(setBrandLogoUrl(shopifyConfig.brandLogoUrl));
    }
  }, [shopifyConfig]);

  return <></>
}


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  NProgress.settings.showSpinner = false

  const isRouteChanging = useRouteChange(router)

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Flex flexDir='row' className={mulish.className}>
              <Flex className={styles.container} flexDir='column' grow={1}>
                <Navigation />
                <InitApp />
                {isRouteChanging ? (
                  <Center h={`calc(100vh - 3rem)`}>
                    <Spinner />
                  </Center>
                ) : (
                  <Component {...pageProps} className={styles.pageContainer} />
                )}
              </Flex>
            </Flex>
          </QueryClientProvider>
        </ChakraProvider>
      </Provider>
    </>
  )
}
