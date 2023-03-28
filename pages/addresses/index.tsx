/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Progress, Text, FormControl, Radio, RadioGroup, Flex, Center, Spinner } from "@chakra-ui/react";
import styles from './addresses.module.scss';
import AddressCard from "../../components/AddressCard/AddressCard";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectPhone, setName, unsetPhone, unverifyProfile } from "../../redux/slices/profileSlice";
import { useQuery } from "@tanstack/react-query";
import { getBuyerProfile } from "../../apis/get";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { selectSelectedAddress, setSelectedAddress, setTurboAddressList, setUnifillAddressList } from "../../redux/slices/addressSlice";
import { ChangeEvent, useEffect, useState } from "react";
import { Formik, Form, useFormik } from "formik";
import { selectCart, selectCartPayload, setCart } from "../../redux/slices/settingsSlice";
import { updateCart } from "../../apis/patch";
import { createCart } from "../../apis/post";
import { FaChevronDown, FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { selectFirstLoad, setFirstLoad } from "../../redux/slices/navigationSlice";
import PageFooter from "../../components/PageFooter/PageFooter";

export default function AddressList() {
    // TODO: CHECK IF USER IS A GUEST AND IF ANY ADDRESSES HAVE BEEN STORED
    const router = useRouter();
    const dispatch = useAppDispatch();

    const phone = useAppSelector(selectPhone);
    const cart = useAppSelector(selectCart);
    const firstLoad = useAppSelector(selectFirstLoad);
    const cartPayload = useAppSelector(selectCartPayload);
    const { isLoading, isError, data } = useQuery([phone], () => getBuyerProfile(localStorage.getItem('turbo')!));

    const [showAllAddresses, setShowAllAddresses] = useState(false);
    const [showSpinner, setShowSpinner] = useState(firstLoad['addresses'] ? true : false);

    const handleUpdateCart = async (id: string, type: string, data: any) => {
        try {
            let address = JSON.parse(JSON.stringify(data));
            delete address['selected'];

            const res = await updateCart(id, type, address);
            const updatedCart = await res.json();

            if (updatedCart.hasOwnProperty('cart')) dispatch(setCart(updatedCart['cart']));
        } catch (err) {
            console.error(err);
        }
    }

    const handleChangeNumber = () => {
        dispatch(unsetPhone());
        dispatch(unverifyProfile());
        router.push("/profile");
    }

    const formik = useFormik({
        initialValues: {
            selectedAddress: ''
        },
        onSubmit: () => { },
    })

    useEffect(() => {
        if (!data) return;

        if (!data.address_list?.length && !data.address_list?.length) router.replace('/new-address');

        if (firstLoad['addresses'] && data.address_list?.length) {
            const defaultAddress = data.address_list.find(address => address.selected === true);
            if (defaultAddress) {
                dispatch(setName(defaultAddress.name));
                formik.setFieldValue('selectedAddress', defaultAddress.address_id);
            } else setShowSpinner(false);
        } else setShowSpinner(false);

        dispatch(setTurboAddressList(data.address_list!));
        // dispatch(setUnifillAddressList(data.address_list));
    }, [data])

    useEffect(() => {

        if (!formik.values.selectedAddress) return;

        const selectedAddress =
            data?.address_list?.find(address => address.address_id === formik.values.selectedAddress)
            || data?.address_list?.find(address => address.address_id === formik.values.selectedAddress);
        dispatch(setSelectedAddress(selectedAddress!));
        if (cart) handleUpdateCart(cart['id'], 'ADDRESS_UPDATE', selectedAddress);
        router.push('/confirmation');
    }, [formik.values.selectedAddress])

    // if (!phone) return <>
    //     <Center h={`calc(100vh - 80px)`}><span>Please enter a valid phone number!</span></Center> :
    // </>

    if (isLoading || showSpinner) return <>
        <Center h={`calc(100vh - 80px)`}><Spinner /></Center> :
    </>

    if (isError) return <>
        <span>An error occurred, please try again later!</span>
    </>

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
                <Box flexGrow={1}>
                    <Box>
                        <form>
                            <FormControl>
                                <RadioGroup>
                                    {/* If only Unifill addresses exist */}
                                    {(!data.address_list?.length && data.address_list?.length) ? data.address_list.map(address => {
                                        return (
                                            <Box mb={2} key={address.address_id} p={4} className={`${styles.card} ${(address.address_id === formik.values.selectedAddress) ? styles.selectedCard : ''}`}>
                                                <Radio key={address.address_id} colorScheme='green' {...formik.getFieldProps('selectedAddress')} value={address.address_id} className={`${styles.radio}`}>
                                                    <AddressCard key={address.address_id} isInForm={true} address={address} selected={address.address_id === formik.values.selectedAddress} />
                                                </Radio>
                                            </Box>
                                        );
                                    }) : null}
                                    {/* If only turbo addresses exist */}
                                    {(!data.address_list?.length && data.address_list?.length) ? data.address_list.map(address => {
                                        return (
                                            <Box mb={2} key={address.address_id} p={4} className={`${styles.card} ${(address.address_id === formik.values.selectedAddress) ? styles.selectedCard : ''}`}>
                                                <Radio key={address.address_id} colorScheme='green' {...formik.getFieldProps('selectedAddress')} value={address.address_id} className={`${styles.radio}`}>
                                                    <AddressCard key={address.address_id} isInForm={true} address={address} mobile={data.mobile} selected={address.address_id === formik.values.selectedAddress} />
                                                </Radio>
                                            </Box>
                                        );
                                    }) : null}
                                    {/* If both addresses exist */}
                                    {(data.address_list?.length && data.address_list?.length) ? (<>
                                        {data.address_list.map(address => {
                                            return (
                                                <Box mb={2} key={address.address_id} p={4} className={`${styles.card} ${(address.address_id === formik.values.selectedAddress) ? styles.selectedCard : ''}`}>
                                                    <Radio key={address.address_id} colorScheme='green' {...formik.getFieldProps('selectedAddress')} value={address.address_id} className={`${styles.radio}`}>
                                                        <AddressCard key={address.address_id} isInForm={true} address={address} mobile={data.mobile} selected={address.address_id === formik.values.selectedAddress} />
                                                    </Radio>
                                                </Box>
                                            );
                                        })}

                                        {
                                            showAllAddresses && data.address_list.map(address => {
                                                return (
                                                    <Box key={address.address_id} mb={2} p={4} className={`${styles.card} ${(address.address_id === formik.values.selectedAddress) ? styles.selectedCard : ''}`}>
                                                        <Radio colorScheme='green' {...formik.getFieldProps('selectedAddress')} value={address.address_id} className={`${styles.radio}`}>
                                                            <AddressCard isInForm={true} address={address} selected={address.address_id === formik.values.selectedAddress} />
                                                        </Radio>
                                                    </Box>
                                                );
                                            })
                                        }

                                        <Flex flexDir={`row`} justifyContent={`center`} alignItems={`center`} gap={`0.25rem`} className={styles.addressToggle} p={2} fontSize={`xs`} textAlign={`center`} w={`100%`} onClick={() => setShowAllAddresses(prev => !prev)}>
                                            Show {showAllAddresses ? `less ` : `all`} {showAllAddresses ? <FaChevronUp /> : <FaChevronDown />}
                                        </Flex>
                                    </>) : null}
                                </RadioGroup>
                            </FormControl>
                        </form>
                    </Box>
                </Box>
                <Box py={2} px={4} className={styles.pageFooter}>
                    <Link href="/new-address">
                        <Button fontSize={`sm`} variant={`outline`} type="submit" w={`100%`} colorScheme={`black`} textTransform={`uppercase`}>
                            Add new Address
                        </Button>
                    </Link>
                    <PageFooter />
                </Box>
            </Flex>
        </>
    )
}