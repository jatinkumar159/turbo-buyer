import { NextRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { UserContext } from '../providers/UserProvider'

export default function useAuthCookies(router: NextRouter) {
  const { setPhone, setAddresses } = useContext(UserContext)

  useEffect(() => {
    const phone = localStorage?.getItem('phone')
    const isVerified = localStorage?.getItem('verified')
    const addresses = JSON.parse(
      decodeURIComponent(localStorage?.getItem('addresses') ?? '[]')
    )

    if (phone && isVerified === 'true') {
      setPhone(phone)
      setAddresses(addresses)
      router.push('/addresses')
      return
    }

    setPhone(null)
    setAddresses([])
    router.push('/profile')
  }, [])
}
