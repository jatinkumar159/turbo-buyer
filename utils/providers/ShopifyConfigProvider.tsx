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
  phone: '8171505570',
  addresses: [
    {
      name: 'Raghav Kanwal',
      address_line1: '709 Shahbad, Near Koharapeer',
      address_line2: '',
      city: 'Bareilly',
      district: '',
      state: 'Uttar Pradesh',
      country: 'IN',
      pin_code: '243001',
    },
  ],
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
