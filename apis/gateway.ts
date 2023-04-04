import { getHeaders } from './../utils/headers';

export default async function gateway(path: string, method: string = 'GET', payload?: any, headersMap?: any) {
    return fetch(path, {
        method,
        headers: getHeaders(method, headersMap),
        body: method === 'GET' ? null : payload
    });
}