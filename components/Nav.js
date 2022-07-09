import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";

import {
    Box,
    Flex,
    Avatar,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Container
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { auth } from "../lib/firebase";


export default function Simple() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, username } = useContext(UserContext);

    const photoURL = user?.photoURL;

    return (
        <Box bg={useColorModeValue('white', 'white.900')} borderWidth={'0.0625rem'}>
            <Container maxW={'container.xl'}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <Link href={'/'}>
                                <button className="btn-logo">Blog</button>
                            </Link>
                        </Box>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}
                            me='4'
                        >
                            {
                                username &&
                                <Link href={'/admin'}>
                                    <Button
                                        colorScheme={'facebook'}
                                    >
                                        Create post
                                    </Button>
                                </Link>

                            }
                        </HStack>
                        {
                            username ?
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        rounded={'full'}
                                        variant={'link'}
                                        cursor={'pointer'}
                                        minW={0}>
                                        <Avatar
                                            size={'sm'}
                                            src={photoURL || '/profile.png'}
                                            name={user?.displayName}
                                        />
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem>
                                            <strong>
                                                Signed in as <br />
                                                @{username}
                                            </strong>
                                        </MenuItem>
                                        <MenuDivider />
                                        <Link
                                            href={`/${username}`}
                                        >
                                            <MenuItem>
                                                My posts
                                            </MenuItem>
                                        </Link>
                                        <Link
                                            href={`/admin`}
                                        >
                                            <MenuItem>
                                                Create post
                                            </MenuItem>
                                        </Link>
                                        <Link
                                            href={`/${username}/settings`}
                                        >
                                            <MenuItem>
                                                Settings
                                            </MenuItem>
                                        </Link>
                                        <MenuDivider />
                                        <Link
                                            href={'/signout'}
                                        >
                                            <MenuItem color={'red'}>
                                                Sign out
                                            </MenuItem>
                                        </Link>
                                    </MenuList>
                                </Menu>
                                :
                                <Link href={'/enter'}>
                                    <Button colorScheme={'blue'} variant={'link'} size={'sm'}>Log In</Button>
                                </Link>
                        }
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} pt={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {
                                username ? (
                                    <Link href={'/admin'}>
                                        Write post
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={'/enter'}>
                                            Log In
                                        </Link>
                                        <Link href={'/signup'}>
                                            Create account
                                        </Link>
                                    </>
                                )
                            }
                        </Stack>
                    </Box>
                ) : null}
            </Container>
        </Box>
    );
}