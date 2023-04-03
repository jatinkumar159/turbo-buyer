/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Text, Radio, RadioGroup, Flex, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Center } from "@chakra-ui/react";
import styles from './addresses.module.scss';
import AddressCard from "../../components/AddressCard/AddressCard";
import { useRouter } from "next/router";
import { useContext, useEffect} from "react";
import { useFormik } from "formik";
import { FaChevronRight} from 'react-icons/fa';
import PageFooter from "../../components/PageFooter/PageFooter";
import { UserContext } from "../../utils/providers/UserProvider";

export default function AddressList() {
    const router = useRouter();
    const { phone, setPhone, setIsVerified, addresses } = useContext(UserContext)
    const { isOpen, onClose, onOpen } = useDisclosure();

    const handleChangeNumber = () => {
        setPhone(null)
        setIsVerified(false)
        router.push("/profile");
    }

    const formik = useFormik({
        initialValues: {
            selectedAddress: ''
        },
        onSubmit: () => { }
    })

    useEffect(() => {
        if (formik.values.selectedAddress) onOpen()
    }, [formik.values.selectedAddress])

    if(!addresses || !addresses.length) return (
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
            <Center h={`calc(100dvh - 8rem)`}>
                <Text>No Addresses Found!</Text>
            </Center>
        </Flex>
    )

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
                                {addresses.length ? addresses.map((address, index) => {
                                    return (
                                        <Box mb={2} key={index} p={4} className={`${styles.card} ${(address.address_id === formik.values.selectedAddress) ? styles.selectedCard : ''}`}>
                                            <Radio colorScheme='green' {...formik.getFieldProps('selectedAddress')} value={index.toString()} className={`${styles.radio}`}>
                                                <AddressCard key={index} index={index} isInForm={true} address={address} mobile={address.mobile} selected={index === +formik.values.selectedAddress} />
                                            </Radio>
                                        </Box>
                                    );
                                }) : null}
                            </RadioGroup>
                        </form>
                    </Box>
                </Box>
                <Box py={2} px={4} className={styles.pageFooter}>
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
                            <Text>Deliver to the following address:</Text>
                            <Text as="p" fontWeight="bold">{addresses[+formik.values.selectedAddress]?.name.trim()},</Text>
                            <Text fontSize="sm">{addresses[+formik.values.selectedAddress]?.address_line1}</Text>
                            <Text fontSize="sm" >{addresses[+formik.values.selectedAddress]?.address_line2}</Text>
                            <Text fontSize="sm">{addresses[+formik.values.selectedAddress]?.pin_code || ''}</Text>
                            {addresses[+formik.values.selectedAddress]?.mobile ? <Text mt={2} fontSize="xs">Mobile: +91 {addresses[+formik.values.selectedAddress]?.mobile}</Text> : null}
                        </Box>
                    </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' size="sm" mr={4} onClick={onClose}>Cancel</Button>
                        <Button colorScheme='blue' onClick={() => {
                            onClose();
                            window?.top?.postMessage({ type: "TURBO_ROUTE", address: JSON.stringify(addresses[+formik.values.selectedAddress])}, '*');
                        }} size="sm">
                            Proceed
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}