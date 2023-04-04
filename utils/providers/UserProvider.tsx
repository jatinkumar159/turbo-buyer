import React, { useEffect, useState } from 'react'
import { ReactNode } from 'react'

export type User = {
  phone: string | null
  setPhone: (phone: string | null) => void
  isVerified: boolean
  setIsVerified: (isVerified: boolean) => void
  addresses: any[]
  setAddresses: (addresses: any[]) => void
}

export const INIT_USER: User = {
  phone: null,
  setPhone: () => {},
  isVerified: false,
  setIsVerified: () => {},
  addresses: [],
  setAddresses: () => {},
}

export const UserContext = React.createContext<User>(INIT_USER)

export default function UserProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(INIT_USER.phone)
  const [isVerified, setIsVerified] = useState<boolean>(INIT_USER.isVerified)
  const [addresses, setAddresses] = useState<any[]>(INIT_USER.addresses)

  return (
    <UserContext.Provider
      value={{
        phone,
        setPhone,
        isVerified,
        setIsVerified,
        addresses,
        setAddresses,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
