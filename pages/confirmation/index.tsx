import { ArrowForwardIcon, DeleteIcon, EditIcon, SmallAddIcon } from '@chakra-ui/icons';
import { Avatar, AvatarGroup, Box, Button, Flex, IconButton, Text, useToast } from '@chakra-ui/react';
import AddressCard from './../../components/AddressCard/AddressCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectName, selectPhone, unsetPhone, unverifyProfile } from '../../redux/slices/profileSlice';
import styles from './confirmation.module.scss';
import { selectSelectedAddress, selectTurboAddressList, selectUnifillAddressList } from '../../redux/slices/addressSlice';
import Link from 'next/link';
import { selectSelectedCoupon, unsetSelectedCoupon } from '../../redux/slices/confirmationSlice';
import { useRouter } from 'next/router';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import { setFirstLoad } from '../../redux/slices/navigationSlice';
import { FaChevronRight } from 'react-icons/fa';
import { BsBagCheckFill } from 'react-icons/bs';
import Image from 'next/image';
import discountImageSrc from "../../images/discounts.svg";
import upiMethodsSrc from "../../images/upiMethods.svg";
import cash from "../../images/cash.svg";
import cards from "../../images/cards.svg";
import upi from "../../images/upi.svg";
import { useState } from 'react';
import { selectCartPayload } from '../../redux/slices/settingsSlice';
import imageLoader from '../../utils/imageLoader';
import PageFooter from '../../components/PageFooter/PageFooter';
import { createOrder, verifyPayment } from '../../apis/post';
import { selectCart } from '../../redux/slices/settingsSlice';
import { getOrderById } from '../../apis/get';
import { showErrorToast } from '../../utils/toasts';

export default function Confirmation() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const toast = useToast();

    const name = useAppSelector(selectName);
    const phone = useAppSelector(selectPhone);
    const cart = useAppSelector(selectCart);
    const coupon = useAppSelector(selectSelectedCoupon);
    const selectedAddress = useAppSelector(selectSelectedAddress);
    const [showItemDetails, setShowItemDetails] = useState(false);
    const cartPayload = useAppSelector(selectCartPayload);

    const redirectToAddresses = () => {
        dispatch(setFirstLoad('addresses'));
        router.push('/addresses');
    }

    const handleChangeNumber = () => {
        dispatch(unsetPhone());
        dispatch(unverifyProfile());
        router.push("/profile");
    }

    const handleToggleItemDetails = () => {
        setShowItemDetails(!showItemDetails);
    }

    const loadScript = (src: string) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const initiatePayment = async (paymentMethod: string) => {
        const res = await createOrder(cart['id'], paymentMethod);
        const data = await res.json();

        if (paymentMethod === 'COD') {
            if (data?.order?.status === 'SUCCESS') {
                router.push('/success');
                return;
            }
            if (data?.order?.status === 'COD_OTP_VERIFICATION_INITIATED' && data?.otp_request_id) {
                router.push({
                    pathname: 'verifyorder',
                    query: {
                        otpRequestId: data.otp_request_id
                    }
                }, '/verifyorder');
                return;
            }
            showErrorToast(toast, { error_code: 'Internal Error', message: 'Failed to place order, please try again later!' });
            return;
        }

        const didRazorpayLoad = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!didRazorpayLoad) {
            showErrorToast(toast, { error_code: 'Connection Error', message: 'Failed to initiate transaction, please make sure you are connected to the internet.' });
        }


        if (res.status !== 201) {
            showErrorToast(toast, data.api_error);
            return;
        }

        if (!data.checkout_options) {
            showErrorToast(toast, { error_code: '500', message: 'Failed to initiate transaction. Please try again.' });
            return;
        }

        const options = {
            "key": data.checkout_options.key,
            "amount": data.checkout_options.amount,
            "currency": data.checkout_options.currency,
            "name": "Unicommerce", // TODO: FROM MERCHANT DATA
            "description": data.checkout_options.description,
            "image": "https://infowordpress.s3.ap-south-1.amazonaws.com/wp-content/uploads/2022/10/06114711/logo.webp", // TODO: FROM MERCHANT DATA
            "order_id": data.checkout_options.pg_order_id,
            "handler": async (response: any) => {
                const paymentRes = await verifyPayment(data.order.payment_id, response);
                const paymentData = await paymentRes.json();

                if (paymentData?.signature_verified) router.push('/success');
            },
            "prefill": {
                "name": "Utkarsh Saxena",
                "email": "saxenautkarsh0@gmail.com",
                "contact": "8171505570",
                "method": `${paymentMethod === 'UPI' ? 'upi' : ''}`
            },
            "readonly": {
                contact: true,
                email: true,
            },
            "hidden": {
                contact: true,
                email: true,
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        }
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', (response: any) => console.log(response));
        rzp1.open();
    }

    return (
        <Flex className={`${styles.container} confirmation`} flexDir="column">
            <Box onClick={handleChangeNumber}>
                <Flex className={styles.section} ps={4} pe={4} pt={2} pb={2} align={`center`}>
                    <Box className={`${styles.sectionContent}`} flexGrow={1}>
                        <Text fontWeight={`normal`}>Your number <Text as="span" ms={4} fontWeight={`bold`}>{phone}</Text></Text>
                    </Box>
                    <Box>
                        <Text><FaChevronRight /></Text>
                    </Box>
                </Flex>
            </Box>

            <Box className={styles.section} mt={2}>
                <Box className={`${styles.sectionContent} delivery-section`} mb={2} p={4}>
                    <Flex flexDir="row" w="100%" align="flex-start">
                        <Box flexGrow={1}>
                            <Text>Deliver to <Text as="span" fontWeight="bold">{selectedAddress?.name.trim()}, {selectedAddress?.pin_code || ''}</Text></Text>
                            <Text mt={2} fontSize="xs">{selectedAddress?.address_line1}</Text>
                            <Text fontSize="xs" >{selectedAddress?.address_line2}</Text>
                            {selectedAddress?.mobile ? <Text mt={2} fontSize="xs">Mobile: +91 {selectedAddress?.mobile}</Text> : null}
                        </Box>
                        <Box>
                            <Text onClick={redirectToAddresses} as="span" fontSize="xs" fontWeight="bold" color="var(--turbo-colors-link)" cursor={`pointer`}>Change</Text>
                        </Box>
                    </Flex>
                </Box>

                {/* <Text mb={2} className={styles.moreAddresses} onClick={redirectToAddresses} cursor='pointer'>
                    <SmallAddIcon /> {(turboAddressList?.length || 0) + (unifillAddressList?.length || 0) - (selectedAddress ? 1 : 0)} more addresses found
                    {/* <Link href="/addresses"><SmallAddIcon /> </Link> 
                </Text>
                <Text mb={2} className={styles.newAddress}>
                    <Link href="/new-address"> <SmallAddIcon /> Add new delivery address</Link>
                    {/* <Button size="xs" color="white" background="black" _hover={{bg:'black'}}> <SmallAddIcon />Add new delivery address</Button> 
                </Text> */}
            </Box>

            {!coupon ? <Box className={styles.section} mt={2} p={4}>
                <Link href='/discounts'>
                    <Flex flexDir="row" className={`${styles.sectionContent} coupon-section`} justifyContent="space-between" alignItems={'center'}>
                        <Box flexGrow={1}>
                            <Flex flexDir="row" alignItems="center">
                                <Text w="100%" alignItems="center" lineHeight="1">
                                    <Image loader={imageLoader} className={styles.discountIcon} src={discountImageSrc} alt={'discount'} />
                                    <Text as="span" fontWeight="bold" ms={2}>Apply Coupon</Text>
                                </Text>
                            </Flex>
                        </Box>

                        <Box>
                            <Text><FaChevronRight /></Text>
                        </Box>
                    </Flex>
                </Link>
            </Box> : null
            }

            {coupon ? <Box className={styles.section} mt={2} p={4}>
                <Flex className={`${styles.sectionContent} coupon-section`} justifyContent="space-between" alignItems={'center'}>
                    <Flex flexDir="column" justifyContent="space-between" >
                        <Text as="span" fontWeight="bold" color={`gray.500`} fontSize="sm">{coupon.code}</Text>
                        <Text as="span" fontWeight="bold" color={"var(--turbo-colors-green)"} fontSize="xs" >₹{coupon.discountAmount}</Text>
                    </Flex>
                    <IconButton size="sm" icon={<DeleteIcon />} bg={'black'} _hover={{ bg: 'black' }} color="white" aria-label={'Close'} onClick={() => dispatch(unsetSelectedCoupon())} />
                </Flex>
            </Box> : null
            }

            <Box className={styles.section} mt={2}>
                <Flex className={styles.sectionTitle} flexDir="row" alignItems="center" justifyContent="space-between" p={4}>
                    <Box flexGrow={1}>
                        <Text as="span" fontWeight="bold">Price Details</Text>
                    </Box>
                    <Box onClick={handleToggleItemDetails} textAlign={`right`}>
                        {/* <Box className={styles.itemAvatarGroups}> */}
                        <AvatarGroup size="sm" max={2}>
                            {
                                cartPayload.items.map((avatar: any, avatarIdx: any) => {
                                    return <Avatar icon={<BsBagCheckFill fontSize={`14px`} />} fontSize='1.5rem' key={`avatar-${avatarIdx}`} src={avatar.image || null} />
                                })
                            }
                        </AvatarGroup>
                    </Box>
                    <Box ms={2} onClick={handleToggleItemDetails} >
                        <Text as="span" fontWeight="700" fontSize="xs" color="var(--turbo-colors-link)">{showItemDetails ? 'Hide Items' : 'View Items'}</Text>
                    </Box>
                </Flex>
                <Box className={styles.sectionBody}>
                    {showItemDetails ? <OrderItemsList /> : null}
                </Box>
                <Box className={styles.sectionBody}>
                    <OrderSummary mode={'sm'} />
                </Box>
            </Box>

            {/* <Box className={`${styles.section} ${styles.orderSummaryContainer}`} mt={2}>
                <Box className={`${styles.sectionContent} order-summary`} mb={4}>
                    <OrderItem />
                    <OrderSummary mode={'md'} />
                </Box>
            </Box> */}

            <Flex className={styles.pageTitle} mt={2} ps={4} pe={4}>
                <Text fontWeight={`700`}>Pay via</Text>
            </Flex>

            <Box className={styles.section} mt={2}>
                <Box px={4} py={2}>
                    <Flex flexDir="row" align="center" onClick={() => initiatePayment('UPI')} cursor='pointer'>
                        <Box flexGrow={1}>
                            <Text as="span" fontSize={`sm`} className={styles.paymentMethod}><Image loader={imageLoader} className={styles.paymentMethod} src={upi} alt="upi" />UPI</Text>
                            <Text mt={1} fontSize={`xs`} color={`var(--turbo-colors-green)`} ml={6}>Additional 10% off</Text>
                        </Box>
                        <Box>
                            <Image loader={imageLoader} className={styles.upiMethods} src={upiMethodsSrc} alt={'upi methods'} />
                        </Box>
                    </Flex>
                </Box>
            </Box>

            <Box className={styles.section} mt={2}>
                <Box px={4} py={2}>
                    <Flex flexDir="row" align="center" onClick={() => initiatePayment('PREPAID')} cursor='pointer'>
                        <Box flexGrow={1}>
                            <Text as="span" fontSize={`sm`} className={styles.paymentMethod}><Image loader={imageLoader} className={styles.paymentMethod} src={cards} alt="cards" />Cards/Net Banking/Wallets/Pay Later</Text>
                            <Text mt={1} fontSize={`xs`} color={`var(--turbo-colors-green)`} ml={6}>Additional 10% off</Text>
                        </Box>
                        {/* <Box>
                            <Image loader={imageLoader} className={styles.upiMethods} src={upiMethodsSrc} alt={'upi methods'} />
                        </Box> */}
                    </Flex>
                </Box>
            </Box>

            <Box className={styles.section} mt={2}>
                <Box px={4} py={2}>
                    <Flex flexDir="row" align="center" onClick={() => initiatePayment('COD')} cursor='pointer'>
                        <Box flexGrow={1}>
                            <Text as="span" fontSize={`sm`} className={styles.paymentMethod}><Image loader={imageLoader} className={styles.paymentMethod} src={cash} alt="cash" />Cash on Delivery</Text>
                            <Text mt={1} fontSize={`xs`} color={`gray.800`} ml={6}>Extra charge ₹20</Text>
                        </Box>
                        {/* <Box>
                            <Image loader={imageLoader} className={styles.upiMethods} src={upiMethodsSrc} alt={'upi methods'} />
                        </Box> */}
                    </Flex>
                </Box>
            </Box>
            <Box flexGrow={1}></Box>
            <Box className={styles.pageFooter} mt={2}>
                <PageFooter />
            </Box>
        </Flex>
    )
}