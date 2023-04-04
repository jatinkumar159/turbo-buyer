import { NextRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { UserContext } from '../providers/UserProvider'

export default function useAuthCookies(router: NextRouter) {
  const { setPhone, setIsVerified, setAddresses } = useContext(UserContext)

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const phone = cookies
      ?.find((cookie) => cookie?.trim()?.startsWith('phone='))
      ?.split('=')[1]
    const addresses = JSON.parse(
      decodeURIComponent(localStorage.getItem('addresses') ?? '[]')
    )

    if (phone) {
      setPhone(phone)
      setIsVerified(true)
      setAddresses(addresses)
      router.push('/addresses')
      return
    }

    router.push('/profile')
  }, [])
}
