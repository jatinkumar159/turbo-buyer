import { useEffect, useState } from 'react'
import {
  INIT_SHOPIFY_CONFIG,
  ShopifyConfig,
} from '../providers/ShopifyConfigProvider'

export default function useShopifyConfig() {
  const [config, setConfig] = useState<ShopifyConfig>(INIT_SHOPIFY_CONFIG)

  useEffect(() => {
    const handler = (message: MessageEvent) => {
      if (
        !message.data ||
        !message.data.type ||
        message.data.type.indexOf('TURBO') === -1
      ) {
        setConfig(INIT_SHOPIFY_CONFIG)
        return
      }

      console.log('Shopify Config >> ', message.data)

      if (message.data?.hasOwnProperty('requireOtp')) {
        setConfig({
          clientLogo: message.data.brandLogoUrl,
          requireOtp: message.data.requireOtp,
          phone: INIT_SHOPIFY_CONFIG.phone,
          addresses: INIT_SHOPIFY_CONFIG.addresses,
        })
      }
    }

    window.addEventListener('message', handler)

    return () => window.removeEventListener('message', handler)
  })

  return config
}
