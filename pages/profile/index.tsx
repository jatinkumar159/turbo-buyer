import { useContext, useState } from 'react'
import { Center } from '@chakra-ui/react'
import styles from './profile.module.scss'
import EnterPhone from '../../components/EnterPhone/EnterPhone'
import EnterOTP from '../../components/EnterOTP/EnterOTP'
import { UserContext } from '../../utils/providers/UserProvider'

export default function Profile() {
  const { phone, isVerified } = useContext(UserContext)

  const [otpRequestId, setOtpRequestId] = useState<string>('')

  if (phone && isVerified) return <></>

  return (
    <Center className={styles.container}>
      {phone && !isVerified ? (
        <EnterOTP
          otpRequestId={otpRequestId}
          setOtpRequestId={setOtpRequestId}
        />
      ) : (
        <EnterPhone setOtpRequestId={setOtpRequestId} />
      )}
    </Center>
  )
}
