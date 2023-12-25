import { Box, Button, Center, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftAddon, InputRightAddon, Link, Radio, RadioGroup, Spinner, Text, useRadio, useRadioGroup, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import styles from './edit-address.module.scss';
import * as Yup from 'yup';
import { getPostalAddress } from "../../apis/get";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addAddress, selectTurboAddressList, selectUnifillAddressList, setSelectedAddress } from "../../redux/slices/addressSlice";
import { showErrorToast } from "../../utils/toasts";
import { editAddress } from "../../apis/put";
import { Address } from "../../utils/interfaces";
import { FaChevronRight } from "react-icons/fa";
import { selectPhone, unsetPhone, unverifyProfile } from "../../redux/slices/profileSlice";
import { ChevronRightIcon } from "@chakra-ui/icons";
import PageFooter from "../../components/PageFooter/PageFooter";
import cleanPhoneNumber from "../../utils/cleanPhoneNumber";

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

export default function EditAddress() {
    const router = useRouter();
    const toast = useToast();
    const turboAddressList = useAppSelector(selectTurboAddressList);
    const unifillAddressList = useAppSelector(selectUnifillAddressList);
    const phone = useAppSelector(selectPhone);
    const dispatch = useAppDispatch();
    const [loadingPincode, setLoadingPincode] = useState(false);
    const { query: { address_id } } = router;

    let address: Address | undefined = turboAddressList?.find(el => el.address_id === address_id);
    if (!address) address = unifillAddressList?.find(el => el.address_id === address_id);

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'HOME',
        defaultValue: 'HOME',
        onChange: (e) => {
            formik.setValues({ ...formik.values, ['address_type']: e })
        },
    })

    const formik = useFormik({
        initialValues: {
            mobile: cleanPhoneNumber(address?.mobile) || '',
            name: address?.name || '',
            email: address?.email || '',
            pincode: address?.pincode || '',
            city: address?.city || '',
            state: address?.state || '',
            address_line1: address?.address_line1 || '',
            address_line2: address?.address_line2 || '',
            country: address?.country || '',
            address_type: address?.address_type || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            address_line1: Yup.string().required('Required'),
            city: Yup.string().nullable(false).required('Required'),
            state: Yup.string().required('Required'),
            country: Yup.string().required('Required'),
            pincode: Yup.string().required('Required').length(6, 'Invalid Pincode').test('invalid-pincode', 'Invalid Pincode', function (value) {
                const { city, state } = this.parent;
                if (city && state) return true;
                else return false;
            }),
            address_type: Yup.string().required('Required'),
            mobile: Yup.string().length(10, 'Invalid Mobile Number').required('Required'),
            email: Yup.string().email('Invalid Email Format'),
        }),
        onSubmit: async (values) => {
            try {
                const res = await editAddress({ ...values, address_id: address!.address_id, district: 'Gurgaon' });
                const data = await res.json();

                if (res.status !== 201) {
                    showErrorToast(toast, data.api_error);
                    return;
                }

                router.replace('/confirmation');
            } catch {
                showErrorToast(toast, { error_code: '500', message: 'An Internal Server Error Occurred, Please Try Again Later' });
            }
        }
    });

    const options = ['HOME', 'WORK', 'OTHER']
    const group = getRootProps();

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
        <Flex className={styles.container} flexDir="column">
            {
                address ? (<>

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

                    <Box className={styles.formContainer} mb={2} p={4} flexGrow={1}>
                        <form onSubmit={formik.handleSubmit}>
                            <FormControl variant="floating" mb={4} isInvalid={formik.touched.mobile && formik.errors.mobile ? true : false}>
                                <InputGroup>
                                    <InputLeftAddon className={styles.leftAddon} p={2} fontSize="sm" background={`none`}>+91</InputLeftAddon>
                                    <Input ps={12} className={styles.leftAddonInput} type="number" placeholder={`Mobile`} {...formik.getFieldProps('mobile')}></Input>
                                    <FormLabel ps={4} htmlFor="mobile">Mobile</FormLabel>
                                </InputGroup>
                                <FormErrorMessage>{formik.errors.mobile}</FormErrorMessage>
                            </FormControl>
                            <FormControl variant="floating" mb={4} isInvalid={formik.touched.name && formik.errors.name ? true : false}>
                                <Input type="text" placeholder="Name" aria-placeholder="Name" {...formik.getFieldProps('name')}></Input>
                                <FormLabel ps={4} htmlFor="name">Name</FormLabel>
                                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                            </FormControl>
                            <FormControl variant="floating" mb={4} isInvalid={formik.touched.email && formik.errors.email ? true : false}>
                                <Input type="text" placeholder="email" aria-placeholder="Email" {...formik.getFieldProps('email')}></Input>
                                <FormLabel ps={4} htmlFor="email">Email</FormLabel>
                                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                            </FormControl>
                            <FormControl variant="floating" mb={4} isInvalid={formik.touched.pincode && formik.errors.pincode ? true : false}>
                                <Input type="text" placeholder="pincode" aria-placeholder="Pincode" {...formik.getFieldProps('pincode')}></Input>
                                <FormLabel ps={4} htmlFor="name">Pincode</FormLabel>
                                <FormErrorMessage>{formik.errors.pincode}</FormErrorMessage>
                            </FormControl>
                            <Flex flexDir="row" justifyContent={`space-between`} gap={4} mb={4}>
                                <FormControl variant="floating" isInvalid={formik.touched.city && formik.errors.city ? true : false}>
                                    <InputGroup>
                                        <Input className={styles.rightAddonInput} type="text" placeholder="City" aria-placeholder="City" {...formik.getFieldProps('city')}></Input>
                                        <FormLabel ps={4} htmlFor="city">City</FormLabel>
                                        {loadingPincode ? <InputRightAddon p={2} fontSize="sm" background={`none`} className={styles.rightAddon}><Spinner size="xs" /></InputRightAddon> : null}
                                    </InputGroup>
                                    <FormErrorMessage>{formik.errors.city}</FormErrorMessage>
                                </FormControl>
                                <FormControl variant="floating" isInvalid={formik.touched.state && formik.errors.state ? true : false}>
                                    <InputGroup>
                                        <Input className={styles.rightAddonInput} disabled type="text" placeholder="State" aria-placeholder="State" {...formik.getFieldProps('state')}></Input>
                                        <FormLabel ps={4} htmlFor="state">State</FormLabel>
                                        {loadingPincode ? <InputRightAddon p={2} fontSize="sm" background={`none`} className={styles.rightAddon}><Spinner size="xs" /></InputRightAddon> : null}
                                    </InputGroup>
                                    <FormErrorMessage>{formik.errors.state}</FormErrorMessage>
                                </FormControl>
                            </Flex>
                            <FormControl variant="floating" mb={4} isInvalid={formik.touched.address_line1 && formik.errors.address_line1 ? true : false}>
                                <Input type="text" placeholder="House no." aria-placeholder="house, road" {...formik.getFieldProps('address_line1')}></Input>
                                <FormLabel ps={4} htmlFor="address_line1">Address Line 1</FormLabel>
                                <FormErrorMessage>{formik.errors.address_line1}</FormErrorMessage>
                            </FormControl>
                            <FormControl variant="floating" mb={4} isInvalid={formik.touched.address_line2 && formik.errors.address_line2 ? true : false}>
                                <Input type="text" placeholder="Locality" aria-placeholder="Locality, Landmark" {...formik.getFieldProps('address_line2')}></Input>
                                <FormLabel ps={4} htmlFor="address_line2">Address Line 2</FormLabel>
                            </FormControl>
                            {/* <FormControl variant="floating" mb={4} isInvalid={formik.touched.address_type && formik.errors.address_type ? true : false}>
                                <FormLabel ps={4} htmlFor="address_type">Address Type</FormLabel>
                                <RadioGroup defaultValue={address.address_type}>
                                    <Radio colorScheme='green' {...formik.getFieldProps('address_type')} value='HOME' mr={4}>
                                        Home
                                    </Radio>
                                    <Radio colorScheme='green' {...formik.getFieldProps('address_type')} value='WORK' mr={4}>
                                        Work
                                    </Radio>
                                    <Radio colorScheme='green' {...formik.getFieldProps('address_type')} value='OTHER'>
                                        Other
                                    </Radio>
                                </RadioGroup>
                            </FormControl> */}
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


                </>) : (<p>Invalid Address Selected, Please try again with another address!</p>)
            }
        </Flex>
    )
}