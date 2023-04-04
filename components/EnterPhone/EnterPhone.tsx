import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Flex,
  FormControl,
  InputGroup,
  InputLeftAddon,
  Input,
  FormErrorMessage,
  Button,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import Link from 'next/link'
import router from 'next/router'
import { ChangeEvent, useContext, useEffect, useRef } from 'react'
import { sendOTP } from '../../apis/post'
import { showErrorToast } from '../../utils/toasts'
import PageFooter from '../PageFooter/PageFooter'
import * as Yup from 'yup'
import styles from './EnterPhone.module.scss'
import { ShopifyConfigContext } from '../../utils/providers/ShopifyConfigProvider'
import { UserContext } from '../../utils/providers/UserProvider'

export default function EnterPhone() {
  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    handleChange: Function,
    submitForm: Function
  ) => {
    handleChange(e)
  }

  const { phone, setPhone } = useContext(UserContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  return (
    <Formik
      initialValues={{
        phone: phone ?? '',
      }}
      validationSchema={Yup.object({
        phone: Yup.string()
          .length(10, 'Please enter a valid 10 digit mobile number.')
          .required('Required'),
      })}
      validateOnBlur={false}
      onSubmit={async (values) => {
        try {
          // if (!requireOtp) {
          //   fetchAddresses(values.phone)
          //   setPhone(values.phone)
          //   router.push('/addresses')
          //   return
          // }

          const res = await sendOTP(values.phone)
          const data = await res.json()

          if (!res.ok) {
            showErrorToast(toast, data)
            return
          }

          setPhone(values.phone)
          router.push(
            {
              pathname: '/verify',
              query: {
                id: data.otp_request_id,
              },
            },
            'verify'
          )
        } catch {
          showErrorToast(toast, {
            error_code: '500',
            message:
              'An Internal Server Error Occurred, Please Try Again Later',
          })
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleBlur,
        handleChange,
        submitForm,
      }) => (
        <Flex flexDir={`column`} justifyContent={`space-between`} h={`100%`}>
          <Box w={`100%`}>
            <Form>
              <FormControl
                isInvalid={touched.phone && errors.phone?.length ? true : false}
                isDisabled={isSubmitting}
              >
                <Text as='h2' mb={4} textAlign={`center`} fontSize={`20px`}>
                  Please enter your mobile number
                </Text>
                <InputGroup>
                  <InputLeftAddon
                    p={2}
                    background={`none`}
                    className={styles.profileLeftAddress}
                  >
                    +91
                  </InputLeftAddon>
                  <Input
                    className={styles.profileNumber}
                    ps={12}
                    id='phone'
                    type='number'
                    placeholder='Phone Number'
                    errorBorderColor='var(--turbo-colors-red)'
                    autoFocus
                    ref={inputRef}
                    value={values.phone}
                    onBlur={handleBlur}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleOnChange(e, handleChange, submitForm)
                    }
                  />
                </InputGroup>
                <FormErrorMessage justifyContent={`center`}>
                  {errors.phone}
                </FormErrorMessage>
              </FormControl>
              <Box mt={8}>
                <Text fontSize={`sm`} textAlign={`center`}>
                  By continuing, I agree to the{' '}
                  <Link
                    href={`https://unicommerce.com`}
                    className={styles.link}
                  >
                    Terms of Use
                  </Link>{' '}
                  &{' '}
                  <Link href={'#'} className={styles.link}>
                    Privacy Policy
                  </Link>
                </Text>
              </Box>

              <Box className={styles.footerBox}>
                <Button
                  type='submit'
                  isDisabled={String(values.phone).length !== 10}
                  w={`100%`}
                  bg={`black`}
                  color={`white`}
                  _hover={{ background: `black` }}
                  mb={2}
                >
                  <Text as='span' fontSize='sm' textTransform={`uppercase`}>
                    Continue <ChevronRightIcon ms={2} fontSize={`lg`} />
                  </Text>
                </Button>
                <PageFooter />
              </Box>
            </Form>
          </Box>
        </Flex>
      )}
    </Formik>
  )
}
