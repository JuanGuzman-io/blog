import { Box, Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { auth } from "../lib/firebase";

const SignOut = () => {
    const router = useRouter();

    const signOut = () => {
        auth.signOut();
        toast('See you later!', {
            icon: '🌝',
            style: {
                border: '1px solid #333',
            },
        });
        router.push('/');
    }

    return (
        <Box
            maxW={'sm'}
            margin={'0 auto'}
        >
            <Heading textAlign={'center'} fontSize={'xl'}>Are you sure you want to sign out?</Heading>
            <Button
                onClick={signOut}
                bg={'#000'}
                color={'white'}
                _hover={{ bg: '#000', textDecoration: 'underline' }}
                width={'100%'}
                mt={4}
            >Yes, good bye</Button>
        </Box>
    );
}

export default SignOut;