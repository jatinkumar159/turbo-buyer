/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Progress, Text, FormControl, Radio, RadioGroup, Flex, Center, Spinner, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import styles from './addresses.module.scss';
import AddressCard from "../../components/AddressCard/AddressCard";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectPhone, setName, unsetPhone, unverifyProfile } from "../../redux/slices/profileSlice";
import { useQuery } from "@tanstack/react-query";
import { fetchAddresses, fetchAddressWithOtp } from "../../apis/get";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { selectAddressList, selectSelectedAddress, setSelectedAddress, setTurboAddressList, setUnifillAddressList } from "../../redux/slices/addressSlice";
import { ChangeEvent, useEffect, useState } from "react";
import { Formik, Form, useFormik } from "formik";
import { selectCart, selectCartPayload, selectIsOtpRequired, setCart } from "../../redux/slices/settingsSlice";
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
    const selectedAddress = useAppSelector(selectSelectedAddress);
    const cartPayload = useAppSelector(selectCartPayload);

    const data = useAppSelector(selectAddressList);

    const [showAllAddresses, setShowAllAddresses] = useState(false);
    const [showSpinner, setShowSpinner] = useState(firstLoad['addresses'] ? true : false);
    const { isOpen, onClose, onOpen } = useDisclosure();

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
        onSubmit: () => { }
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

        // dispatch(setTurboAddressList(data.address_list!));
        // dispatch(setUnifillAddressList(data.address_list));
    }, [data])

    useEffect(() => {
        if (!formik.values.selectedAddress) return;

        const selectedAddress = data?.address_list?.at(+formik.values.selectedAddress);
        dispatch(setSelectedAddress(selectedAddress!));

        if (cart) handleUpdateCart(cart['id'], 'ADDRESS_UPDATE', selectedAddress);
        onOpen()
        // router.push('/confirmation');
    }, [formik.values.selectedAddress])

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
                            <RadioGroup>
                                {data?.address_list?.length ? data?.address_list.map((address, index) => {
                                    return (
                                        <Box mb={2} key={index} p={4} className={`${styles.card} ${(address.address_id === formik.values.selectedAddress) ? styles.selectedCard : ''}`}>
                                            <Radio colorScheme='green' {...formik.getFieldProps('selectedAddress')} value={index.toString()} className={`${styles.radio}`}>
                                                <AddressCard key={index} index={index} isInForm={true} address={address} mobile={data.mobile} selected={index === +formik.values.selectedAddress} />
                                            </Radio>
                                        </Box>
                                    );
                                }) : null}
                            </RadioGroup>
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

            <Modal isCentered={true} isOpen={isOpen} onClose={onClose} motionPreset="none">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Are you sure?</ModalHeader>
                    <ModalCloseButton mt={1}/>
                    <ModalBody >
                    <Flex flexDir="row" w="100%" align="flex-start">
                        <Box flexGrow={1}>
                            <Text mb={4}>Deliver to the following address:</Text>
                            <Text as="p" fontWeight="bold">{selectedAddress?.name.trim()},</Text>
                            <Text fontSize="xs">{selectedAddress?.address_line_1}</Text>
                            <Text fontSize="xs" >{selectedAddress?.address_line2}</Text>
                            <Text fontSize="xs">{selectedAddress?.pin_code || ''}</Text>
                            {selectedAddress?.mobile ? <Text mt={2} fontSize="xs">Mobile: +91 {selectedAddress?.mobile}</Text> : null}
                        </Box>
                    </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' size="sm" mr={4} onClick={onClose}>Cancel</Button>
                        <Button colorScheme='blue' onClick={() => {
                            onClose();
                            window?.top?.postMessage({ type: "TURBO_ROUTE", address: JSON.stringify(selectedAddress)}, '*');
                        }} size="sm">
                            Proceed
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}