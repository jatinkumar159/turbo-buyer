import { Center } from '@chakra-ui/react'
import styles from './profile.module.scss'
import EnterPhone from '../../components/EnterPhone/EnterPhone'

export default function Profile() {
  return (
    <Center className={styles.container}>
      <EnterPhone />
    </Center>
  )
}
