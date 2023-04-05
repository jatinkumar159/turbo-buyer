import React, { useEffect, useState } from 'react'
import { ReactNode } from 'react'

export type User = {
  phone: string | null
  setPhone: (phone: string | null) => void
  addresses: any[]
  setAddresses: (addresses: any[]) => void
}

export const INIT_USER: User = {
  phone: null,
  setPhone: () => {},
  addresses: [],
  setAddresses: () => {},
}

export const UserContext = React.createContext<User>(INIT_USER)

export default function UserProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(INIT_USER.phone)
  const [addresses, setAddresses] = useState<any[]>(INIT_USER.addresses)

  return (
    <UserContext.Provider
      value={{
        phone,
        setPhone,
        addresses,
        setAddresses,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
