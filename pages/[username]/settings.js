import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { deleteUser, updateProfile } from "firebase/auth";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Metatags from "../../components/Metatags";
import { UserContext } from "../../lib/context";
import { auth, db } from "../../lib/firebase";

const Settings = () => {
    const { username } = useContext(UserContext);

    return (
        <>
            <Metatags title={`Settings - @${username}`} />
            <Box
                maxW={'container.xl'}
            >
                <Flex
                    gap={3}
                >
                    <Heading>Profile settings</Heading>
                    <Heading color={'blue.500'}>@{username}</Heading>
                </Flex>
                <FormProfile />
                <DeleteAccount />
            </Box>
        </>
    );
}

function FormProfile() {
    const { user } = useContext(UserContext);
    const [name, setName] = useState('');

    useEffect(() => {
        setName(user?.displayName);
        // eslint-disable-next-line
    }, []);

    const handleChange = e => {
        setName(e.target.value);
    }

    const handleUpdate = async e => {
        e.preventDefault();
        const postRef = doc(
            db,
            'users',
            user?.uid
        );

        updateProfile(auth.currentUser, {
            displayName: name
        }).then(() => {
            toast.success('The profile has been updated!');
        }).catch((error) => {
            toast.error('Something gone wrong!')
            console.log(error);
        });

        await updateDoc(postRef, {
            displayName: name
        });
    }
    return (

        <Box
            maxW={'100%'}
            w={'full'} deletePost
            boxShadow={'md'}
            rounded={'md'}
            p={6}
            my={6}
            overflow={'hidden'}
        >
            <Text fontSize={'2xl'} fontWeight={'bold'}>User</Text>
            <Stack
                as="form"
                onSubmit={handleUpdate}
                spacing={'1.5rem'}
                py={6}
            >
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                        type={'text'}
                        name={'name'}
                        value={name}
                        onChange={handleChange}
                    />
                </FormControl>
                <Button
                    width={'fit-content'}
                    type={'submit'}
                >Save</Button>
            </Stack>
        </Box>
    )
}

function DeleteAccount() {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, username } = useContext(UserContext);
    const cancelRef = useRef();

    const handleDelete = async () => {
        const userRef = auth.currentUser;
        const userDoc = doc(db, 'users', user.uid);
        const usernameDoc = doc(db, 'username', username);
        
        const batch = writeBatch(db);

        batch.delete(userDoc);
        batch.delete(usernameDoc);

        await batch.commit();
        
        deleteUser(userRef).then(() => {
            toast.success('The account has been deleted successfully!')
        }).catch((error) => {
            toast.error('Something gone wrong!')
        });

        router.push('/enter')
    }

    return (
        <Box
            maxW={'100%'}
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'md'}
            rounded={'md'}
            p={6}
            my={6}
            overflow={'hidden'}
        >
            <Text fontSize={'2xl'} fontWeight={'bold'}>Delete account</Text>
            <Button colorScheme='red' onClick={onOpen} my={'6'}>
                Delete account
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize={'lg'} fontWeight={'bold'}>
                            Delete account
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}

export default Settings;