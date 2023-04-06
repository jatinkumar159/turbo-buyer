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
  phone: '9654723413',
  addresses: [
    {
      name: 'Raghav Kanwal',
      address_line1:
        'C-1003, Tower Height Apartments, Pitampura Delhi - 110034',
      address_line2: '',
      city: 'Delhi',
      district: '',
      state: 'Delhi',
      country: 'IN',
      pin_code: '110034',
    },
  ],
  // phone: null,
  // addresses: [],
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
