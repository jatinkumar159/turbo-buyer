import { ArrowBackIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { IconButton, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectFlowMap } from '../../redux/slices/navigationSlice';
import imageLoader from '../../utils/imageLoader';
import { ShopifyConfigContext } from '../../utils/providers/ShopifyConfigProvider';
import { UserContext } from '../../utils/providers/UserProvider';
import styles from './Navigation.module.scss';

export default function Navigation() {
    const router = useRouter();

    const { phone, isVerified} = useContext(UserContext)
    const { clientLogo } = useContext(ShopifyConfigContext)
    const flowMap = useAppSelector(selectFlowMap);

    const handleBackNavigation = () => {
        if(router.pathname === '/addresses') {
            router.replace('/profile')
            return
        }
        router.back()
    }

    const handleClose = () => {
        window?.top!.postMessage({ type: "TURBO_EXIT", data: "close event" }, '*');
    }

    return (
        <div className={styles.container}>
            <div className={styles.brand}>
                {((router.pathname === '/profile' && !(phone && !isVerified)) || (router.pathname === '/success')) ?
                    <IconButton aria-label="close" icon={<SmallCloseIcon />} background={"transparent"} _hover={{ bg: 'transparent' }} onClick={handleClose} />
                    : <IconButton aria-label="back" icon={<ArrowBackIcon />} background={"transparent"} _hover={{ bg: 'transparent' }} onClick={handleBackNavigation} />
                }
                <Text as="span" fontSize="sm" fontWeight="bold">{flowMap[router.pathname]?.title}</Text>
            </div>
            <div className={styles.attribution}>
                {clientLogo && <Image loader={imageLoader} src={clientLogo} alt="Logo" width='70' height='50' priority style={{height: 40, width: 'auto', objectFit: 'contain'}}/>}
            </div>
        </div>
    )
}