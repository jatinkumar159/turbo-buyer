import React, { useEffect, useState } from 'react'
import { ReactNode } from 'react'

export type User = {
  phone: string | null
  setPhone: (phone: string | null) => void
  isVerified: boolean
  setIsVerified: (isVerified: boolean) => void
  addresses: any[]
}

export const INIT_USER: User = {
  phone: null,
  setPhone: () => {},
  isVerified: false,
  setIsVerified: () => {},
  addresses: [],
}

export const UserContext = React.createContext<User>(INIT_USER)

export default function UserProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(INIT_USER.phone)
  const [isVerified, setIsVerified] = useState<boolean>(INIT_USER.isVerified)
  const [addresses, setAddresses] = useState<any[]>(INIT_USER.addresses)

  useEffect(() => {
    // TODO: API STUFF HERE
    const handler = (message: MessageEvent) => {
      if (
        !message.data ||
        !message.data.type ||
        message.data.type.indexOf('TURBO_CALL') === -1
      )
        return

      console.log('Shopify CALL >> ', message.data)

      setAddresses(message.data.addresses)
    }

    window.addEventListener('message', handler)

    return () => window.removeEventListener('message', handler)
  })

  return (
    <UserContext.Provider
      value={{
        phone,
        setPhone,
        isVerified,
        setIsVerified,
        addresses,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
