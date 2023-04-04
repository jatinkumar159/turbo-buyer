import { Center, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useAuthCookies from '../utils/hooks/useAuthCookies'

export default function Home() {
  const router = useRouter()
  useAuthCookies(router)

  return (
    <Center h={'calc(100dvh - 3rem)'}>
      <Spinner />
    </Center>
  )
}
