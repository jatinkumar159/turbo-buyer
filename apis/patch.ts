import gateway from './gateway';

const baseUrl = 'https://turbo-dev.unicommerce.co.in/turbo'

/********************************************** CART ***********************************************************/
export async function updateCart(cartId: string, type: string, data: any): Promise<Response> {
    const res = await gateway(`${baseUrl}/v1/cart/${cartId}`, `PATCH`, JSON.stringify({
            type,
            data
        })
    )

    return res;
}