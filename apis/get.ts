import { Addresses } from "../utils/interfaces";
import gateway from './gateway';

const baseUrl = 'https://turbo-dev.unicommerce.co.in/turbo'

/********************************************** BUYER ***********************************************************/
export async function getBuyerProfile(token: string): Promise<Addresses> {
    const res = await gateway(`https://unifill.unicommerce.co.in/vas/v1/addresses?mobile=8983998599`, 'GET');
    return res.json();
}

export async function getPostalAddress(pincode: string): Promise<any> {
    const res = await gateway(`${baseUrl}/v1/pincode/${pincode}`, 'GET');
    return res.json();
}

/********************************************** PAYMENT ***********************************************************/
export async function getOrderById(id: string): Promise<Response> {
    const res = await gateway(`${baseUrl}/v1/order/${id}`, `GET`);
    return res;
}
