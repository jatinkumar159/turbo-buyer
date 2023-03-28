import { getPlatformData } from "./platform";

export function getHeaders(method: string, headersMap: any): Headers {
    const headers = new Headers();

    let platformInfo: any = {};

    if(navigator.userAgentData) {
        platformInfo.platform = navigator.userAgentData.platform, platformInfo.isMobile = navigator.userAgentData.mobile;
    }
    else {
        platformInfo.platform = getPlatformData();
        platformInfo.isMobile = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;
    }

    // if(localStorage.getItem('turbo')) headers.append('Authorization', `Bearer ${localStorage.getItem('turbo')}`);
    // headers.append('X-NMerchantId', `mid4`);
    // headers.append('user-agent', `${navigator.userAgent}`);
    // headers.append('X-NPlatformInfo', 'SHOPIFY');
    headers.append('Content-type', 'application/json');
    // headersMap?.forEach((headerPair: any) => headers.append(headerPair[0], headerPair[1]));
    
    if(method === 'POST') {
        headers.append('x-api-key', 'ugaoo_with_otp-m6mmd4md8xjs3jo5oah5');
    } else {
        headers.append('X-API-KEY', 'uc_sales-wXDbwosW6tsi2SuLM3AI');
    }
    return headers;
}
