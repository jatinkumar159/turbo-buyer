import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";

export interface SettingsState {
    otpLength: number;
    cartPayload: any;
    cart: any;
}

const initialState: SettingsState = {
    otpLength: 6,
    cartPayload: {
        "token": "c18e143e13e2edd58c3157254efad8af",
        "note": null,
        "attributes": {},
        "original_total_price": 360000,
        "total_price": 360000,
        "total_discount": 0,
        "total_weight": 0.0,
        "item_count": 3,
        "items": [
            {
                "id": 43452549988576,
                "quantity": 1,
                "variant_id": 43452549988576,
                "key": "43452549988576:2ece52f442b29dd82794fc826e55c53a",
                "title": "pants",
                "price": 130000,
                "original_price": 130000,
                "discounted_price": 130000,
                "line_price": 130000,
                "original_line_price": 130000,
                "total_discount": 0,
                "discounts": [],
                "sku": "",
                "grams": 0,
                "vendor": "test-801",
                "taxable": true,
                "product_id": 7868374778080,
                "product_has_only_default_variant": true,
                "gift_card": false,
                "final_price": 130000,
                "final_line_price": 130000,
                "url": "\/products\/pants?variant=43452549988576",
                "featured_image": {
                    "aspect_ratio": null,
                    "alt": null,
                    "height": null,
                    "url": null,
                    "width": null
                },
                "image": null,
                "handle": "pants",
                "requires_shipping": true,
                "product_type": "",
                "product_title": "pants",
                "product_description": "",
                "variant_title": null,
                "variant_options": [
                    "Default Title"
                ],
                "options_with_values": [
                    {
                        "name": "Title",
                        "value": "Default Title"
                    }
                ],
                "line_level_discount_allocations": [],
                "line_level_total_discount": 0
            },
            {
                "id": 43450134626528,
                "quantity": 1,
                "variant_id": 43450134626528,
                "key": "43450134626528:1fa8c6a699f81b8735ef52810d2dee3a",
                "title": "short sleeve",
                "price": 100000,
                "original_price": 100000,
                "discounted_price": 100000,
                "line_price": 100000,
                "original_line_price": 100000,
                "total_discount": 0,
                "discounts": [],
                "sku": "short-sleeve",
                "grams": 0,
                "vendor": "wow-store-2022",
                "taxable": true,
                "product_id": 7867695562976,
                "product_has_only_default_variant": true,
                "gift_card": false,
                "final_price": 100000,
                "final_line_price": 100000,
                "url": "\/products\/short-sleeve?variant=43450134626528",
                "featured_image": {
                    "aspect_ratio": null,
                    "alt": null,
                    "height": null,
                    "url": null,
                    "width": null
                },
                "image": null,
                "handle": "short-sleeve",
                "requires_shipping": true,
                "product_type": "",
                "product_title": "short sleeve",
                "product_description": "",
                "variant_title": null,
                "variant_options": [
                    "Default Title"
                ],
                "options_with_values": [
                    {
                        "name": "Title",
                        "value": "Default Title"
                    }
                ],
                "line_level_discount_allocations": [],
                "line_level_total_discount": 0
            },
            {
                "id": 43364674306272,
                "quantity": 1,
                "variant_id": 43364674306272,
                "key": "43364674306272:cab99189379cdf6e25fdcfe242a69a3a",
                "title": "long-sleeve",
                "price": 130000,
                "original_price": 130000,
                "discounted_price": 130000,
                "line_price": 130000,
                "original_line_price": 130000,
                "total_discount": 0,
                "discounts": [],
                "sku": "1000",
                "grams": 0,
                "vendor": "test-801",
                "taxable": true,
                "product_id": 7841497448672,
                "product_has_only_default_variant": true,
                "gift_card": false,
                "final_price": 130000,
                "final_line_price": 130000,
                "url": "\/products\/long-sleeve?variant=43364674306272",
                "featured_image": {
                    "aspect_ratio": null,
                    "alt": null,
                    "height": null,
                    "url": null,
                    "width": null
                },
                "image": null,
                "handle": "long-sleeve",
                "requires_shipping": true,
                "product_type": "",
                "product_title": "long-sleeve",
                "product_description": "",
                "variant_title": null,
                "variant_options": [
                    "Default Title"
                ],
                "options_with_values": [
                    {
                        "name": "Title",
                        "value": "Default Title"
                    }
                ],
                "line_level_discount_allocations": [],
                "line_level_total_discount": 0
            }
        ],
        "requires_shipping": true,
        "currency": "INR",
        "items_subtotal_price": 360000,
        "cart_level_discount_applications": []
    },
    cart: undefined,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setOtpLength: (state, action: PayloadAction<number>) => {
            state.otpLength = action.payload;
        },
        setCartPayload: (state, action: PayloadAction<any>) => {
            state.cartPayload = action.payload;
        },
        setCart: (state, action: PayloadAction<any>) => {
            state.cart = action.payload;
        }
    }
});

export const {setOtpLength, setCartPayload, setCart} = settingsSlice.actions;

export const selectOtpLength = (state: AppState) => state.settings.otpLength;
export const selectCartPayload = (state: AppState) => state.settings.cartPayload;
export const selectCart = (state: AppState) => state.settings.cart;

export default settingsSlice.reducer;