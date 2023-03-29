import { useEffect, useState } from 'react'

export default function useShopifyConfig() {
  const [config, setConfig] = useState({})

  useEffect(() => {
    const handler = (message: MessageEvent) => {
      if (
        !message.data ||
        !message.data.type ||
        message.data.type.indexOf('TURBO') === -1
      ) {
        setConfig({})
        return
      }

      console.log('Shopify Config >> ', message.data)

      setConfig(message.data)
    }

    window.addEventListener('message', handler)

    return () => window.removeEventListener('message', handler)
  })

  return config
}
