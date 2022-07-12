import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputLeftAddon, Text, VStack } from "@chakra-ui/react";
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { auth, db, facebookAuthProvider, googleAuthProvider, twitterAuthProvider } from "../lib/firebase";
import Metatags from "../components/Metatags";

const Enter = ({ }) => {
    const { user, username } = useContext(UserContext);

    return (
        <>
            <Metatags title="Blog - Enter" description='Enter to the Blog community' />
            <main>
                {
                    user ?
                        username ?
                            <Redirect />
                            :
                            <UsernameForm />
                        :
                        <Box
                            maxW={'xl'}
                            margin={'0 auto'}
                        >
                            <Heading py={6} textAlign={'center'} fontWeight={'bold'} fontSize={'4xl'}>Welcome to the Blog community</Heading>
                            <VStack
                                pb={6}
                                spacing={'1.25rem'}
                            >
                                <SignInGoogle />
                                <SignInTwitter />
                                <SignInFacebook />
                            </VStack>
                            <Text py={6} textAlign={'center'} fontWeight={'bold'} fontSize={'2xl'}>Have a password? Continue with your Email</Text>
                            <SignInWithEmail />
                        </Box>
                }
            </main>
        </>
    );
}

function SignInGoogle() {
    const signInWithGoogle = async () => {
        await signInWithRedirect(auth, googleAuthProvider);
    };

    return (
        <Button px={6} py={8} colorScheme='red' width={'100%'} onClick={signInWithGoogle} leftIcon={<FaGoogle />}>
            Sign in with Google
        </Button>
    );
}

function SignInTwitter() {
    const signInWithTwitter = async () => {
        await signInWithRedirect(auth, twitterAuthProvider);
        getRedirectResult(auth)
            .then(result => {
                const userRef = result.user;

                if (userRef) {
                    toast('Welcome!')
                }
            }).catch(error => {
                const errorMessage = error.message;
                toast('Something gone wrong!', errorMessage);
                console.log(errorMessage);
            });
    }

    return (
        <Button px={6} py={8} colorScheme='twitter' width={'100%'} onClick={signInWithTwitter} leftIcon={<FaTwitter />}>
            Sign in with Twitter
        </Button>
    )
}

function SignInFacebook() {
    const signInWithFacebook = async () => {
        await signInWithRedirect(auth, facebookAuthProvider);
        getRedirectResult(auth)
            .then(() => {
                toast('Welcome!');
            }).catch(error => {
                const errorMessage = error.message;
                toast('Something gone wrong!', errorMessage);
            });
    }
    return (
        <Button px={6} py={8} colorScheme='facebook' width={'100%'} onClick={signInWithFacebook} leftIcon={<FaFacebook />}>
            Sign in with Facebook
        </Button>
    )
}

function SignInWithEmail() {
    return (
        <Container
            as={'form'}
            maxW={'xl'}
        >
            <FormControl
                noValidate
            >
                <FormControl mb={4}>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <Input type={'email'} name='email' id='email' placeholder='johndoe@email.com' />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <Input type={'password'} name='password' id='password' placeholder='··········' />
                </FormControl>
                <Flex
                    justifyContent={'flex-end'}
                >
                    <Button
                        type='submit'
                        bg={'#000'}
                        color={'white'}
                        _hover={{ bg: '#000', textDecoration: 'underline' }}
                    >Enter</Button>
                </Flex>
            </FormControl>
        </Container>
    )
}

function Redirect() {
    const router = useRouter();
    const { user, username } = useContext(UserContext);

    useEffect(() => {
        if (user && username) {
            router.push('/');
        }
    }, [user, username]);

    return <Text fontWeight={'700'} textAlign={'center'}>Redirecting...</Text>
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [load, setLoad] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        const userDoc = doc(db, 'users', user.uid);
        const usernameDoc = doc(db, 'username', formValue);

        const batch = writeBatch(db);
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    }

    const onChange = e => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length <= 3) {
            setFormValue(val);
            setLoad(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoad(true);
            setIsValid(false);
        }
    }

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = doc(db, 'username', username);
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    setIsValid(false);
                } else {
                    setIsValid(true);
                }
                setLoad(false);
            }
        }, 500), []
    );

    return (
        !username && (
            <Box
                maxW={'xl'}
                margin={'0 auto'}
            >
                <Heading mb={4}>Create username,</Heading>
                <Text mb={4} fontSize={'large'}>Please enter a valid username to create an account.</Text>
                <form
                    onSubmit={onSubmit}
                >
                    <FormControl>
                        <InputGroup>
                            <InputLeftAddon children='@' />
                            <Input
                                type={'text'}
                                placeholder='johndoe123'
                                value={formValue}
                                onChange={onChange}
                            />
                        </InputGroup>
                        <ValidationMessage username={formValue} isValid={isValid} load={load} />
                        <Flex
                            justifyContent={'flex-end'}
                        >
                            <Button
                                type='submit'
                                disabled={!isValid}
                                bg={'#000'}
                                color={'white'}
                                _hover={{ bg: '#000', textDecoration: 'underline' }}
                                mt={'4'}
                            >Choose</Button>
                        </Flex>
                    </FormControl>
                </form>
            </Box>
        )
    )
}

function ValidationMessage({ username, isValid, load }) {
    if (load) {
        return <Text textColor={'GrayText'} mt={4}>Validating...</Text>;
    } else if (isValid) {
        return <Text textColor={'green.600'} mt={4} fontWeight={'black'}>{username} is valid!</Text>
    } else if (username && !isValid) {
        return <Text textColor={'red.600'} mt={4} fontWeight={'black'}>{username} already has taken or is too short!</Text>
    } else {
        return <></>;

    }
}

export default Enter;