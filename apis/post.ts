import { NewAddress } from "../utils/interfaces";
import gateway from './gateway';

const baseUrl = 'https://turbo-dev.unicommerce.co.in/turbo'

/********************************************** BUYER ***********************************************************/
export async function verifyBuyer(phone: string): Promise<Response> {
    const res = await gateway(`https://unifill.unicommerce.co.in/vas/auth/v1/otp?mobile=${phone}'`, `POST`, {});
    return res;
}

export async function sendOTP(phone: string): Promise<Response> {
    const res = await gateway(`https://unifill.unicommerce.co.in/vas/auth/v1/otp?mobile=${phone}`, `POST`, {});
    return res;
}

export async function resendOTP(otpRequestId: string): Promise<Response> {
    const res = await gateway(`https://unifill.unicommerce.co.in/vas/auth/v1/otp/resend?otp_request_id=${otpRequestId}`, `POST`, {});
    return res;
}

export async function verifyOTP(otpRequestId: string, otp?: string): Promise<Response> {
    const res = await gateway(`https://unifill.unicommerce.co.in/vas/auth/v1/otp/verify`, `POST`, JSON.stringify({
            'otp_request_id': otpRequestId,
            'otp': otp,
        }),
    );
    return res;
}

export async function addNewAddress(address: NewAddress): Promise<Response> {
    const res = await gateway(`${baseUrl}/buyer/v1/address`, `POST`, JSON.stringify(address));
    return res;
}

/********************************************** CART ***********************************************************/
export async function createCart(platform: string, merchantId: string, mobileNumber: string, platformCart?: any, address?: any): Promise<Response> {
    const res = await gateway(`${baseUrl}/v1/cart`, `POST`, JSON.stringify({
        platform: platform,
        merchant_id: merchantId,
        mobile_number: mobileNumber,
        platform_cart: platformCart,
        address: address,
    }));
    return res;
}

/********************************************** PAYMENT ***********************************************************/
export async function createOrder(cartId: string, paymentMethod: string): Promise<Response> {
    const res = await gateway(`${baseUrl}/v1/order`, `POST`, JSON.stringify({
        cart_id: cartId,
        payment_option: paymentMethod,
    }));
    return res;
}

export async function verifyPayment(paymentId: string, data: any): Promise<Response> {
    const res = await gateway(`${baseUrl}/payments/v1/verify`, 'POST', JSON.stringify({
        payment_id: paymentId,
        pg_order_id: data.razorpay_order_id,
        pg_payment_id: data.razorpay_payment_id,
        pg_signature: data.razorpay_signature,
    }));
    return res;
}