import { Flex, FormControl, HStack, PinInput, PinInputField, FormErrorMessage, Center, Text, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { resendOTP, verifyOTP } from "../../apis/post";
import { useAppSelector } from "../../redux/hooks";
import { selectPhone } from "../../redux/slices/profileSlice";
import { selectOtpLength } from "../../redux/slices/settingsSlice";
import { showErrorToast } from "../../utils/toasts";
import * as Yup from 'yup';
import styles from "./verifyorder.module.scss";

export default function VerifyOrder() {
    const toast = useToast();
    const router = useRouter();

    const [timer, setTimer] = useState<number>(30);
    const [isOtpInvalid, setIsOtpInvalid] = useState<boolean | undefined>(undefined);
    const [otpRequestId, setOtpRequestId] = useState<string>(String(router.query.otpRequestId));

    const phone = useAppSelector(selectPhone);
    const digits = useAppSelector(selectOtpLength);

    const inputs: string[] = [], initialValues: any = {}, validation: any = {};
    for (let digit = 1; digit <= digits; digit++) {
        inputs.push(`digit${digit}`);
        initialValues[`digit${digit}`] = '';
        validation[`digit${digit}`] = Yup.string().length(1).required();
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object(validation),
        validateOnMount: true,
        onSubmit: async (values) => {
            const otp = inputs.reduce((acc, curr) => acc + values[curr] ?? '', '');
            try {
                const res = await verifyOTP(otpRequestId, otp);
                const data = await res.json();

                if (res.status !== 200) {
                    showErrorToast(toast, data.api_error);
                    setIsOtpInvalid(true);
                    return;
                }

                if (data.verified) {
                    if (data.token) localStorage.setItem('token', data.token);
                    router.push('/success');
                }
                else throw new Error("Data is not verified");
            } catch (error) {
                showErrorToast(toast, { error_code: '500', message: 'An Internal Server Error Occurred, Please Try Again Later' });
            }
        }
    });

    useEffect(() => {
        const interval = timer > 0 ? setInterval(() => setTimer(time => time - 1), 1000) : undefined;
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        const otp = inputs.reduce((acc, curr) => acc + formik.values[curr] ?? '', '');
        if (otp.length === digits) formik.submitForm();
    }, [formik.values])

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
        <Flex flexDir={`column`} justifyContent={`space-between`} h={`100%`} className={styles.container} align="center">
            <form onSubmit={formik.handleSubmit}>
                <Text as="h2" mb={4} textAlign={`center`} fontSize={`20px`}>OTP verification for your COD order</Text>
                <FormControl isInvalid={isOtpInvalid}>
                    <Text color={`gray.500`} textAlign={`center`}>Enter the OTP we just sent on {phone}</Text>
                    <HStack justifyContent={`center`} mt={4} mb={4}>
                        <PinInput otp isDisabled={formik.isSubmitting} placeholder=''>
                            {inputs.map(name => {
                                return (
                                    <PinInputField key={name} maxLength={1} name={name} autoFocus={name === 'digit1'} value={formik.values[name]} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                                );
                            })}
                        </PinInput>
                    </HStack>
                    <FormErrorMessage justifyContent='center' mb='4'>
                        Invalid OTP. Please try again.
                    </FormErrorMessage>
                </FormControl>

                <Center>
                    <Text
                        hidden={timer > 0}
                        onClick={handleResendOTP}
                        className={styles.resendLink}
                    >Resend OTP</Text>
                </Center>
                {timer > 0 && <Text as="span" color={`gray.500`}>Didn’t receive the OTP? Resend in <Text as="span" fontWeight={`bold`} color={`var(--turbo-colors-text)`}>{timer} seconds</Text></Text>}
            </form>
        </Flex>
    )
}