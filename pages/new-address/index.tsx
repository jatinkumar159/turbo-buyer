import { Box, Button, Center, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Input, InputGroup, InputLeftAddon, InputRightAddon, Link, Radio, RadioGroup, Spinner, Text, useRadio, useRadioGroup, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import styles from './new-address.module.scss';
import * as Yup from 'yup';
import { getPostalAddress } from "../../apis/get";
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSelectedAddress } from "../../redux/slices/addressSlice";
import { selectName, selectPhone, unsetPhone, unverifyProfile } from "../../redux/slices/profileSlice";
import { addNewAddress } from "../../apis/post";
import { showErrorToast } from "../../utils/toasts";
import { Address } from "./../../utils/interfaces";
import { FaChevronRight } from "react-icons/fa";
import { ChevronRightIcon } from "@chakra-ui/icons";
import PageFooter from "../../components/PageFooter/PageFooter";

function RadioCard(props: any) {
    const { getInputProps, getCheckboxProps } = useRadio(props)
    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                textTransform={`uppercase`}
                borderWidth='1px'
                borderColor={`var(--turbo-colors-gray)`}
                borderRadius='lg'
                px={2} py={1}
                fontSize={`xs`}
                boxShadow='none'
                _checked={{
                    bg: '#F1F8E9',
                    color: 'var(--turbo-colors-green)',
                    borderColor: 'transparent',
                    borderWidth: '1px'
                }}
                _focus={{
                    boxShadow: 'none',
                }}
            >
                {props.children}
            </Box>
        </Box>
    )
}


export default function NewAddress() {
    const router = useRouter();
    const name = useAppSelector(selectName);
    const toast = useToast();
    const phone = useAppSelector(selectPhone);
    const dispatch = useAppDispatch();
    const [loadingPincode, setLoadingPincode] = useState(false);
    const options = ['HOME', 'WORK', 'OTHER']

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'HOME',
        defaultValue: 'HOME',
        onChange: (e) => {
            formik.setValues({ ...formik.values, ['address_type']: e })
        },
    })

    const group = getRootProps();

    const formik = useFormik({
        initialValues: {
            mobile: phone,
            name: name ?? '',
            email: '',
            pincode: '',
            city: '',
            state: '',
            address_line1: '',
            address_line2: '',
            country: '',
            address_type: 'HOME',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('This is a mandatory field.'),
            address_line1: Yup.string().required('This is a mandatory field.'),
            city: Yup.string().required('This is a mandatory field.'),
            state: Yup.string().required('This is a mandatory field.'),
            country: Yup.string().required('This is a mandatory field.'),
            pincode: Yup.string().required('This is a mandatory field.').length(6, 'Invalid Pincode').test('invalid-pincode', 'Invalid Pincode', function (value) {
                const { city, state } = this.parent;
                if (city && state) return true;
                else return false;
            }),
            address_type: Yup.string().required('This is a mandatory field.'),
            mobile: Yup.string().length(10, 'Invalid Mobile Number').required('This is a mandatory field.'),
            email: Yup.string().email('Invalid Email Format'),
        }),
        onSubmit: async (values) => {
            try {
                const res = await addNewAddress({ ...values, district: 'Gurgaon' });
                const data = await res.json();

                if (res.status !== 201) {
                    showErrorToast(toast, data.api_error);
                    return;
                }

                dispatch(setSelectedAddress({ ...values, district: 'Gurgaon', address_type: 'Home', selected: true, address_id: data.address_id }));
                router.replace('/confirmation');
            } catch {
                showErrorToast(toast, { error_code: '500', message: 'An Internal Server Error Occurred, Please Try Again Later' });
            }
        }
    });

    const fillPostalData = async (pincode: string) => {
        setLoadingPincode(true);
        const data: any = await getPostalAddress(pincode);
        if (data.hasOwnProperty('api_error') || data.city === null || data.state === null) {
            setLoadingPincode(false);
            return;
        }
        await formik.setValues({ ...formik.values, city: data['city'], state: data['state'], country: data['country'] });
        setLoadingPincode(false);
    }

    useEffect(() => {
        if (formik.values.pincode?.length === 6) {
            fillPostalData(formik.values.pincode);
        } else {
            formik.setValues({ ...formik.values, city: '', state: '', country: '' });
        }
    }, [formik.values.pincode])

    const handleChangeNumber = () => {
        dispatch(unsetPhone());
        dispatch(unverifyProfile());
        router.push("/profile");
    }

    return (
        <>
            <Flex className={styles.container} flexDir={`column`}>

                <Box onClick={handleChangeNumber}>
                    <Flex className={styles.section} ps={4} pe={4} pt={2} pb={2} align={`center`} mb={2}>
                        <Box className={`${styles.sectionContent}`} flexGrow={1}>
                            <Text fontWeight={`bold`}>Your number <Text as="span" ms={4} fontWeight={`bold`}>{phone}</Text></Text>
                        </Box>
                        <Box>
                            <Text><FaChevronRight /></Text>
                        </Box>
                    </Flex>
                </Box>

                <Flex className={styles.pageTitle} mb={2} ps={4} pe={4}>
                    <Text fontWeight={`bold`}>Deliver to</Text>
                </Flex>

                <Box className={styles.formContainer} p={4} flexGrow={1}>
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl className={`${formik.touched.state ? styles.touched : null} ${styles.leftAddonGroup}`} variant={`floating`} mb={4} isInvalid={formik.touched.mobile && formik.errors.mobile ? true : false}>
                            <InputGroup>
                                <InputLeftAddon p={2} fontSize="sm" background={`none`} className={styles.inputLeftAddon}>+91</InputLeftAddon>
                                <Input borderLeft={0} type="number" placeholder={`Mobile`} {...formik.getFieldProps('mobile')}></Input>
                                <FormLabel ps={4} htmlFor="mobile" className={styles.leftAddonLabel}>Mobile</FormLabel>
                            </InputGroup>
                            <FormErrorMessage fontSize={`xs`}>{formik.errors.mobile}</FormErrorMessage>
                        </FormControl>
                        <FormControl variant="floating" mb={4} isInvalid={formik.touched.name && formik.errors.name ? true : false}>
                            <Input type="text" placeholder="Name" aria-placeholder="Name" {...formik.getFieldProps('name')}></Input>
                            <FormLabel ps={4} htmlFor="name">Name</FormLabel>
                            <FormErrorMessage fontSize={`xs`}>{formik.errors.name}</FormErrorMessage>
                        </FormControl>
                        <FormControl variant="floating" mb={4} isInvalid={formik.touched.email && formik.errors.email ? true : false}>
                            <Input type="text" placeholder="Email" aria-placeholder="Email" {...formik.getFieldProps('email')}></Input>
                            <FormLabel ps={4} htmlFor="email">Email</FormLabel>
                            <FormErrorMessage fontSize={`xs`}>{formik.errors.email}</FormErrorMessage>
                        </FormControl>
                        <FormControl variant="floating" mb={4} isInvalid={formik.touched.pincode && formik.errors.pincode ? true : false}>
                            <Input type="text" placeholder="Pincode" aria-placeholder="Pincode" {...formik.getFieldProps('pincode')}></Input>
                            <FormLabel ps={4} htmlFor="name">Pincode</FormLabel>
                            <FormErrorMessage fontSize={`xs`}>{formik.errors.pincode}</FormErrorMessage>
                        </FormControl>
                        <Flex flexDir="row" justifyContent={`space-between`} gap={4} mb={4}>
                            <FormControl variant="floating" isInvalid={formik.touched.city && formik.errors.city ? true : false}>
                                <InputGroup>
                                    <Input className={styles.rightAddonInput} type="text" placeholder="City" aria-placeholder="City" {...formik.getFieldProps('city')}></Input>
                                    <FormLabel ps={4} htmlFor="state">City</FormLabel>
                                    {loadingPincode ? <InputRightAddon p={2} fontSize="sm" background={`none`} className={styles.rightAddon}><Spinner size="xs" /></InputRightAddon> : null}
                                </InputGroup>
                                <FormErrorMessage fontSize={`xs`}>{formik.errors.city}</FormErrorMessage>
                            </FormControl>
                            <FormControl className={`${styles.disabledFormField}`} variant="floating" isInvalid={formik.touched.state && formik.errors.state ? true : false}>
                                <InputGroup>
                                    <Input className={styles.rightAddonInput} disabled type="text" placeholder="State" aria-placeholder="State" {...formik.getFieldProps('state')}></Input>
                                    <FormLabel ps={4} htmlFor="state">State</FormLabel>
                                    {loadingPincode ? <InputRightAddon p={2} fontSize="sm" background={`none`} className={styles.rightAddon}><Spinner size="xs" /></InputRightAddon> : null}
                                </InputGroup>
                                <FormErrorMessage fontSize={`xs`}>{formik.errors.state}</FormErrorMessage>
                            </FormControl>
                        </Flex>
                        <FormControl variant="floating" mb={4} isInvalid={formik.touched.address_line1 && formik.errors.address_line1 ? true : false}>
                            <Input type="text" placeholder="House no." aria-placeholder="house, road" {...formik.getFieldProps('address_line1')}></Input>
                            <FormLabel ps={4} htmlFor="address_line1">Address Line 1</FormLabel>
                            <FormErrorMessage fontSize={`xs`}>{formik.errors.address_line1}</FormErrorMessage>
                        </FormControl>
                        <FormControl variant="floating" mb={4} isInvalid={formik.touched.address_line2 && formik.errors.address_line2 ? true : false}>
                            <Input type="text" placeholder="Locality" aria-placeholder="Locality, Landmark" {...formik.getFieldProps('address_line2')}></Input>
                            <FormLabel ps={4} htmlFor="address_line2">Address Line 2</FormLabel>
                        </FormControl>
                        <FormControl mb={4} isInvalid={formik.touched.address_type && formik.errors.address_type ? true : false}>
                            <FormLabel htmlFor="address_type" className={styles.inlineLabel} display="inline" fontWeight="normal">Save address as </FormLabel>
                            <Flex {...group} flexDir={`row`} display={`inline-flex`} gap={4}>
                                {options.map((value) => {
                                    const radio = getRadioProps({ value })
                                    return (
                                        <RadioCard key={value} {...radio}>
                                            {value}
                                        </RadioCard>
                                    )
                                })}
                            </Flex>
                        </FormControl>
                        <FormControl mb={4} isInvalid={formik.touched.address_type && formik.errors.address_type ? true : false}>
                            <Checkbox spacing="0.5rem"><Text fontSize="xs">Make this the default shipping address</Text></Checkbox>
                        </FormControl>
                        {/* <Button type='submit'>Submit</Button> */}
                    </form>
                </Box>
                <Box p={4}>
                    <Button type="submit" isDisabled={!formik.isValid} w={`100%`} bg={`black`} color={`white`} _hover={{ background: `black` }} mb={2} onClick={formik.submitForm}>
                        <Text as="span" fontSize="sm" textTransform={`uppercase`}>Proceed to Buy <ChevronRightIcon ms={2} fontSize={`lg`} /></Text>
                    </Button>
                    <PageFooter />
                </Box>
            </Flex>

        </>
    )
}