import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import {
    Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, InputGroup, InputLeftAddon, PinInput, PinInputField, Progress, useToast, VStack, useDisclosure,
    InputLeftElement,
    Text,
    Spinner,
    Center,
    Link,
    Flex,
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { createCart, resendOTP, sendOTP, verifyBuyer, verifyOTP } from '../../apis/post'
import { profileAsyncTaskEnd, profileAsyncTaskStart, selectIsLoading, selectIsVerified, selectPhone, selectCountry, setPhone, unsetPhone, unverifyProfile, verifyProfile, selectName } from '../../redux/slices/profileSlice'
import * as Yup from 'yup'
import styles from './profile.module.scss'
import { useRouter } from 'next/router'
import { SearchCountry } from '../../components/SearchCountry/SearchCountry'
import { ArrowForwardIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { selectCart, selectCartPayload, selectOtpLength, setCart } from '../../redux/slices/settingsSlice'
import { showErrorToast } from '../../utils/toasts'
import { fetchAddresses } from '../../apis/get'
import jwtDecode from 'jwt-decode';
import { Token } from '../../utils/interfaces'
import PageFooter from '../../components/PageFooter/PageFooter'
import cleanPhoneNumber from '../../utils/cleanPhoneNumber'

export default function Profile() {
    const dispatch = useAppDispatch()
    const router = useRouter();

    const phone = useAppSelector(selectPhone);
    const cart = useAppSelector(selectCart);
    const cartPayload = useAppSelector(selectCartPayload);
    const isVerified = useAppSelector(selectIsVerified);
    const toast = useToast();
    const { query: { PHONE } } = router;

    const [otpRequestId, setOtpRequestId] = useState<string>('');

    const handleCreateCart = async (phone: string) => {
        const res = await createCart('SHOPIFY', 'mid4', phone, cartPayload, undefined);
        const data = await res.json();

        if (data.hasOwnProperty('cart')) {
            dispatch(setCart(data.cart));
        }
    }

    const handleChangePhone = () => {
        dispatch(unsetPhone());
    }

    const handleResetProfile = () => {
        dispatch(unsetPhone());
        dispatch(unverifyProfile());
    }

    function EnterPhone() {
        const handleOnChange = (e: ChangeEvent<HTMLInputElement>, handleChange: Function, submitForm: Function) => {
            handleChange(e);
            if (e.target.value.length === 10) {
                setTimeout(() => {
                    submitForm();
                }, 0);
            }
        }

        return (
            <Formik
                initialValues={{
                    phone: PHONE ? String(PHONE) : '',
                }}
                validationSchema={Yup.object({
                    phone: Yup.string().length(10, 'Please enter a valid 10 digit mobile number.').required('Required'),
                })}
                validateOnBlur={false}
                onSubmit={(values) => {
                    try {
                        // IF TOKEN ALREADY EXISTS && NUMBER IS SAME
                        // const token = localStorage.getItem('turbo');
                        // if (token) {
                        //     const decodedToken: Token = jwtDecode(token);
                        //     if ((cleanPhoneNumber(decodedToken.sub) == values.phone) && Date.now() < (decodedToken.exp * 1000)) {
                        //         dispatch(setPhone(values.phone));
                        //         if (!cart) handleCreateCart(values.phone);
                        //         dispatch(verifyProfile());
                        //         router.push('/addresses');
                        //         return;
                        //     } else localStorage.removeItem('turbo');
                        // }

                        // const res = await verifyBuyer(values.phone);
                        // const data = await res.json();

                        // if (res.status !== 200) {
                        //     showErrorToast(toast, data);
                        //     return;
                        // }

                        dispatch(setPhone(values.phone));
                        // handleCreateCart(values.phone);
                        // if (data.guest_user) {
                        //     localStorage.setItem('turbo', data.token);
                        //     dispatch(verifyProfile());
                            router.push('/addresses');
                        // }
                    //     else setOtpRequestId(data.otp_request_id);
                    } catch {
                    //     showErrorToast(toast, { error_code: '500', message: 'An Internal Server Error Occurred, Please Try Again Later' });
                    // }
                }}}
            >
                {({ values, errors, touched, isSubmitting, handleBlur, handleChange, submitForm }) => (
                    <Flex flexDir={`column`} justifyContent={`space-between`} h={`100%`}>
                        <Box w={`100%`}>
                            <Form>
                                <FormControl isInvalid={touched.phone && errors.phone?.length ? true : false} isDisabled={isSubmitting}>
                                    {/* <FormLabel htmlFor="Mobile" fontSize="sm" ps={4}>Mobile</FormLabel> */}
                                    <Text as="h2" mb={4} textAlign={`center`} fontSize={`20px`}>Please enter your mobile number</Text>
                                    <InputGroup>
                                        {/* <InputLeftElement width="3em" cursor="pointer" onClick={onToggle}>
                                            <Text as='span'>
                                                {country.flag}
                                            </Text>
                                            {isOpen ? (
                                                <ChevronUpIcon boxSize={6} color="gray.500" />
                                            ) : (
                                                <ChevronDownIcon boxSize={6} color="gray.500" />
                                            )}

                                        </InputLeftElement> */}
                                        <InputLeftAddon p={2} background={`none`} className={styles.profileLeftAddress}>
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
                                            value={values.phone}
                                            onBlur={handleBlur}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnChange(e, handleChange, submitForm)}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage justifyContent={`center`}>{errors.phone}</FormErrorMessage>
                                </FormControl>
                                <Box mt={8}>
                                    <Text fontSize={`sm`} textAlign={`center`}>By continuing, I agree to the <Link href={`https://unicommerce.com`} color={`--turbo-colors-link`} _hover={{ textDecor: 'underline' }}>Terms of Use </Link> & <Link color={`var(--turbo-colors-link)`} _hover={{ textDecor: 'underline' }}>Privacy Policy</Link></Text>
                                </Box>
                            </Form>
                            {/* {isOpen && <SearchCountry onClose={onClose} />} */}
                        </Box>
                        <Box>
                            <Button type="submit" isDisabled={String(values.phone).length !== 10} w={`100%`} bg={`black`} color={`white`} _hover={{ background: `black` }} mb={2}>
                                <Text as="span" fontSize="sm" textTransform={`uppercase`}>Continue <ChevronRightIcon ms={2} fontSize={`lg`} /></Text></Button>
                            <PageFooter />
                        </Box>
                    </Flex>
                )}
            </Formik>
        );
    }

    function EnterOTP() {
        const [timer, setTimer] = useState<number>(30);
        const [isOtpInvalid, setIsOtpInvalid] = useState<boolean | undefined>(undefined);

        useEffect(() => {
            const interval = timer > 0 ? setInterval(() => setTimer(time => time - 1), 1000) : undefined;
            return () => clearInterval(interval);
        }, [timer]);

        const digits = useAppSelector(selectOtpLength);
        const inputs: string[] = [], initialValues: any = {}, validation: any = {};
        for (let digit = 1; digit <= digits; digit++) {
            inputs.push(`digit${digit}`);
            initialValues[`digit${digit}`] = '';
            validation[`digit${digit}`] = Yup.string().length(1).required();
        }

        const handleOnChange = (e: ChangeEvent<HTMLInputElement>, values: any, handleChange: Function, submitForm: Function) => {
            handleChange(e);
            const _inputs = inputs.filter(input => input !== e.target.name);
            const otp = (e.target.value ?? '') + _inputs.reduce((acc, curr) => acc + (values[curr] ?? ''), '');
            if (otp.length === digits) {
                setTimeout(() => submitForm(), 0);
            }
        }

        const handleResendOTP = async () => {
            try {
                const res = await resendOTP(otpRequestId);
                const data = await res.json();

                if (res.status !== 200) {
                    showErrorToast(toast, data.api_error);
                    return;
                }

                setOtpRequestId(data.otp_request_id);
                setTimer(30);
            } catch {
                showErrorToast(toast, { error_code: '500', message: 'An Internal Server Error Occurred, Please Try Again Later' });
            }
        }

        return (
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object(validation)}
                validateOnMount={true}
                onSubmit={async (values) => {
                    const otp = inputs.reduce((acc, curr) => acc + values[curr] ?? '', '');
                    try {
                        const res = await verifyOTP(otpRequestId, otp);
                        const data = await res.json();

                        if (res.status !== 200) {
                            showErrorToast(toast, data.api_error);
                            setIsOtpInvalid(true);
                            return;
                        }

                        if (data.token) {
                            localStorage.setItem('turbo', data.token);
                            setIsOtpInvalid(false);
                            dispatch(verifyProfile());
                            router.push('/addresses');
                        } else {
                            setIsOtpInvalid(true);
                        }
                    } catch {
                        showErrorToast(toast, { error_code: '500', message: 'An Internal Server Error Occurred, Please Try Again Later' });
                    }
                }}
            >
                {({ values, isSubmitting, handleBlur, handleChange, submitForm }) => (
                    <Flex flexDir={`column`} justifyContent={`space-between`} h={`100%`}>
                        <Form>
                            <Text as="h2" mb={4} textAlign={`center`} fontSize={`20px`}>Verify your mobile number</Text>
                            <FormControl isInvalid={isOtpInvalid}>
                                <Text color={`gray.500`} textAlign={`center`}>Enter the OTP we just sent on <br /></Text>
                                <Flex align={`center`} justify={`center`} gap={`0.5rem`}>
                                    {phone}<Text as="span" onClick={handleChangePhone} className={styles.changeNumber} verticalAlign={`middle`}>Change</Text>
                                </Flex>
                                <HStack justifyContent={`center`} mt={4} mb={4}>
                                    <PinInput otp isDisabled={isSubmitting} placeholder=''>
                                        {inputs.map(name => {
                                            return (
                                                <PinInputField key={name} maxLength={1} name={name} autoFocus={name === 'digit1'} value={values[name]} onBlur={handleBlur} onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnChange(e, values, handleChange, submitForm)} />
                                            );
                                        })}
                                    </PinInput>
                                </HStack>
                                <FormErrorMessage><Flex mb={4} justifyContent={`center`}>Invalid OTP. Please try again.</Flex></FormErrorMessage>
                            </FormControl>

                            <Center>
                                <Text
                                    hidden={timer > 0}
                                    onClick={handleResendOTP}
                                    className={styles.resendLink}
                                >Resend OTP</Text>
                            </Center>
                            {timer > 0 && <Text as="span" color={`gray.500`}>Didn’t receive the OTP? Resend in <Text as="span" fontWeight={`bold`} color={`var(--turbo-colors-text)`}>{timer} seconds</Text></Text>}
                        </Form>
                    </Flex>
                )}
            </Formik>
        )
    }

    return (
        <>
            <Center className={styles.container}>
                {/* {(phone && !isVerified) ? <EnterOTP /> : <EnterPhone />} */}
                <EnterPhone />
            </Center>
        </>
    )
}