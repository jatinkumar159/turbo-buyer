import { CheckCircleIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Flex, Link, Text } from "@chakra-ui/react";
import styles from "./success.module.scss";

export default function Success() {
    return (
        <Flex className={styles.container} flexDir='column' h={'calc(100vh - 3rem)'} justifyContent='space-between'>
            <Center h={'100%'}>
                <Flex flexDir='column' alignItems="center">
                    <CheckCircleIcon color='green' w='39px' h='39px' />
                    <Text fontSize='md' mt='6' fontWeight='bold' textTransform='capitalize' color='green'>CONGRATULATIONS!</Text>
                    <Text fontSize='sm' mt='0.5rem'>Order placed successfully</Text>
                </Flex>
            </Center>
            <Box py={2} px={4} className={styles.pageFooter}>
                <Button w={`100%`} bg={`black`} color={`white`} _hover={{ background: `black` }} mb={2} >
                    <Text as="span" fontSize="sm" textTransform={`uppercase`}>Continue Shopping <ChevronRightIcon ms={2} fontSize={`lg`} /></Text>
                </Button>
                <Text mt={2} fontSize={`sm`} textAlign={`center`}>Powered by <Link href={`https://unicommerce.com`} rel="noreferrer" target="_blank"><Text as="span" color={`blue.300`}>UNICOMMERCE</Text></Link></Text>
            </Box>
        </Flex>
    )
}