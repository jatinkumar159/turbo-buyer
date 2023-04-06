import React from 'react'
import { ReactNode } from 'react'
import useShopifyConfig from '../hooks/useShopifyConfig'

export type ShopifyConfig = {
  requireOtp: boolean | null
  clientLogo: string | null
  phone: string | null
  addresses: any[]
}

export const INIT_SHOPIFY_CONFIG: ShopifyConfig = {
  requireOtp: true,
  clientLogo: null,
  phone: null,
  addresses: [],
}

export const ShopifyConfigContext =
  React.createContext<ShopifyConfig>(INIT_SHOPIFY_CONFIG)

export default function ShopifyConfigProvider({
  children,
}: {
  children: ReactNode
}) {
  const shopifyConfig = useShopifyConfig()

  return (
    <ShopifyConfigContext.Provider value={shopifyConfig}>
      {children}
    </ShopifyConfigContext.Provider>
  )
}
