import { Box, Flex, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../redux/hooks";
import { selectCartPayload } from "../../redux/slices/settingsSlice";
import OrderItem from "../OrderItemsList/OrderItemsList";
import OrderSummary from "../OrderSummary/OrderSummary";
import styles from './Sidebar.module.scss';

export default function Sidebar() {
    const cartPayload = useAppSelector(selectCartPayload);
    return (
        <Flex flexDir="column" display="none">
            <Text as="h2">Order Summary</Text>
            <Box>
                { cartPayload && <Box> { cartPayload.items.map((orderItem: any, i: number) => 
                        <OrderItem key={`${orderItem.title}-${i}`} mode="sm" orderItem={orderItem}/>
                    )} </Box>
                }
            </Box>
            <OrderSummary mode="sm"/>
        </Flex>
    )
}