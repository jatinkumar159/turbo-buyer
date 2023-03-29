import { NextRouter } from 'next/router'
import { useEffect, useState } from 'react'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function useRouteChange(router: NextRouter) {
  const [isRouteChanging, setIsRouteChanging] = useState<boolean>(false)

  useEffect(() => {
    const handleRouteStart = () => {
      NProgress.start()
      setIsRouteChanging(true)
    }
    const handleRouteDone = () => {
      NProgress.done()
      setIsRouteChanging(false)
    }

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteDone)
    router.events.on('routeChangeError', handleRouteDone)

    return () => {
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeComplete', handleRouteDone)
      router.events.off('routeChangeError', handleRouteDone)
    }
  })

  return isRouteChanging
}
