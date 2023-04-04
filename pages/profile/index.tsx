import { useContext, useState } from 'react'
import { Center, Text } from '@chakra-ui/react'
import styles from './profile.module.scss'
import { ShopifyConfigContext } from '../../utils/providers/ShopifyConfigProvider'
import EnterPhone from '../../components/EnterPhone/EnterPhone'
import EnterOTP from '../../components/EnterOTP/EnterOTP'
import { UserContext } from '../../utils/providers/UserProvider'

export default function Profile() {
  const { requireOtp } = useContext(ShopifyConfigContext)
  const { phone, isVerified } = useContext(UserContext)

  const [otpRequestId, setOtpRequestId] = useState<string>('')

  if (!requireOtp)
    return (

      <Center className={styles.container}>
        <EnterPhone setOtpRequestId={setOtpRequestId} />
      </Center>
    )

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
