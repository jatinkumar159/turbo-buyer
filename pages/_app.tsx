import { Provider } from 'react-redux';
import { Flex, ChakraProvider, Center, Spinner, extendTheme} from '@chakra-ui/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import store from '../redux/store'
import Navigation from '../components/Navigation/Navigation';
import '../styles/globals.css'
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import styles from './../styles/app.module.scss';
import Sidebar from '../components/Sidebar/Sidebar';
import { setCartPayload } from '../redux/slices/settingsSlice';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import 'nprogress/nprogress.css';
import PromoBar from '../components/PromoBar/PromoBar';
import { Mulish } from '@next/font/google';
import Head from 'next/head';
import { ActionModalTheme } from '../components/theme/action-modal/actionModal';

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
}

export const theme = extendTheme({
  components: {
    Modal: ActionModalTheme,
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label':
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              pointerEvents: 'none',
              lineHeight: 1.7,
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top'
            },
          },
        },
      },
    },
    Radio: {
      parts: ["label"],
      baseStyle: {
        label: {
          display: `inline-flex`,
          width: `100%`
        }
      }
    },
  },
})

const mulish = Mulish({
  subsets: ["latin"]
})

const queryClient = new QueryClient()

// const mulish = Mulish({ weight: '400', style: ['normal'], subsets: ['latin']})

const InitialiseMessaging = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = (message: MessageEvent) => {
      if (!message.data || !message.data.type || message.data.type.indexOf('TURBO') === -1) return;
      console.log("Received cart payload from parent.", message.data.cartPayload);
      dispatch(setCartPayload(message.data.cartPayload));
    }

    window.addEventListener("message", handler);

    return () => window.removeEventListener('message', handler);
  });
  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isPageTransitionActive, setIsPageTransitionActive] = useState<boolean>(false);
  NProgress.settings.showSpinner = false;
  useEffect(() => {
    const handleRouteStart = () => {
      NProgress.start();
      setIsPageTransitionActive(true);
    }
    const handleRouteDone = () => {
      NProgress.done();
      setIsPageTransitionActive(false);
    };

    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteDone);
    router.events.on('routeChangeError', handleRouteDone);

    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteDone);
      router.events.off('routeChangeError', handleRouteDone);
    }
  })

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <InitialiseMessaging />
            <Flex flexDir="row" className={mulish.className}>
              <Flex className={styles.container} flexDir="column" grow={1}>
                <Navigation />
                {/* <PromoBar /> */}
                {isPageTransitionActive ?
                  <Center h={`calc(100vh - 3rem)`}><Spinner /></Center> :
                  <Component {...pageProps} className={styles.pageContainer} />
                }
              </Flex>
              {/* <Flex className={styles.sidebar} bg={`gray.50`} p={4} pt={4}>
                <Sidebar />
              </Flex> */}
            </Flex>
          </QueryClientProvider>
        </ChakraProvider>
      </Provider>
    </>
  )
}
