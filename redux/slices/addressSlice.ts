import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";

import { Address, Addresses } from "./../../utils/interfaces";

export interface AddressState {
    selectedAddress: Address | null;
    addressList: Addresses | null | undefined;
    turboAddressList: Address[] | null | undefined;
    unifillAddressList: Address[] | null | undefined;
}

const initialState: AddressState = {
    selectedAddress: {
        address_id: "1",
        mobile: "8171505570",
        name: "Utkarsh Saxena",
        address_line_1: "G-342 A, G Block",
        address_line2: "Sector 57, Near Hong Kong Bazaar",
        city: "Gurugram",
        district: "Gurugram",
        state: "Harayana",
        country: "India",
        pincode: "122001",
        address_type: "Home",
        selected: true
    },
    addressList: null,
    turboAddressList: null,
    unifillAddressList: null,
}

export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setAddressList: (state, action: PayloadAction<Addresses>) => {
            state.addressList = action.payload
        },
        setSelectedAddress: (state, action: PayloadAction<Address>) => {
            state.selectedAddress = action.payload;
        },
        unsetSelectedAddress: (state) => {
            state.selectedAddress = null;
        },
        addAddress: (state, action: PayloadAction<Address>) => {
            state.turboAddressList?.push(action.payload);
        },
        setTurboAddressList: (state, action: PayloadAction<Address[]>) => {
            state.turboAddressList = action.payload;
        },
        setUnifillAddressList: (state, action: PayloadAction<Address[]>) => {
            state.unifillAddressList = action.payload;
        },
    }
});

export const { setAddressList, setSelectedAddress, unsetSelectedAddress, addAddress, setTurboAddressList, setUnifillAddressList } = addressSlice.actions;

export const selectAddressList = (state: AppState) => state.address.addressList;
export const selectSelectedAddress = (state: AppState) => state.address.selectedAddress;
export const selectTurboAddressList = (state: AppState) => state.address.turboAddressList;
export const selectUnifillAddressList = (state: AppState) => state.address.unifillAddressList;

export default addressSlice.reducer;