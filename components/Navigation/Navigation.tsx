import { ArrowBackIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { IconButton, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectFlowMap, setFirstLoad } from '../../redux/slices/navigationSlice';
import { selectIsVerified, selectPhone, unsetPhone, unverifyProfile } from '../../redux/slices/profileSlice';
import { selectBrandLogoUrl } from '../../redux/slices/settingsSlice';
import imageLoader from '../../utils/imageLoader';
import styles from './Navigation.module.scss';

export default function Navigation() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const phone = useAppSelector(selectPhone);
    const flowMap = useAppSelector(selectFlowMap);
    const isVerified = useAppSelector(selectIsVerified);
    const brandLogoUrl = useAppSelector(selectBrandLogoUrl);

    const handleBackNavigation = () => {
        console.log(router.pathname);
        if (router.pathname === '/profile' && phone && !isVerified) {
            dispatch(unsetPhone());
            return;
        }
        if(router.pathname === "/addresses") {
            dispatch(unsetPhone());
            dispatch(unverifyProfile());
        }
        if (router.pathname === '/confirmation') dispatch(setFirstLoad('addresses'));
        router.back();
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
                {brandLogoUrl && <Image loader={imageLoader} src={brandLogoUrl} alt="Logo" width='70' height='50' priority style={{height: 40, width: 'auto', objectFit: 'contain'}}/>}
            </div>
        </div>
    )
}