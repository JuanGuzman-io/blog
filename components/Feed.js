import {
    Box,
    Center,
    Text,
    Stack,
    Avatar,
    useColorModeValue,
    Flex,
    Spacer,
    Button,
} from '@chakra-ui/react';
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiWorld, BiLockAlt, BiUpArrow } from "react-icons/bi";

const Feed = ({ posts, admin }) => {
    return posts ? posts.map(post => <PostList post={post} key={post.slug} admin={admin} />) : null;
}

function PostList({ post, admin = false }) {
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);
    const router = useRouter();

    return (
        <Center py={4}>
            <Link
                href={`/${post.username}/${post.slug}`}
            >
                <Box
                    maxW={'container.md'}
                    w={'full'}
                    bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={'md'}
                    rounded={'md'}
                    p={6}
                    overflow={'hidden'}
                >
                    <Flex>
                        <Stack mb={6} direction={'row'} spacing={4} align={'center'}>
                            <Link
                                href={`/${post.username}`}
                            >
                                <a>
                                    <Avatar
                                        src={post.authorImage || '/profile.png'}
                                        name={post.displayName}
                                    />
                                </a>
                            </Link>
                            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                                <Link
                                    href={`/${post.username}`}
                                >
                                    <a>
                                        <Flex
                                            gap={1}
                                        >
                                            <Text fontWeight={600}>{post.displayName}</Text>
                                            {'·'}
                                            <Text fontWeight={200}>@{post.username}</Text>
                                        </Flex>
                                    </a>
                                </Link>
                                <Box color={'gray.500'}>
                                    {
                                        router.pathname === '/admin' ? (
                                            <>
                                                {
                                                    post.published ? (
                                                        <Flex alignItems={'center'} gap={'0.3125rem'}>
                                                            <BiWorld /> <Text>Public</Text>
                                                        </Flex>
                                                    ) : (
                                                        <Flex alignItems={'center'} gap={'0.3125rem'}>
                                                            <BiLockAlt /> <Text>Unpublished</Text>
                                                        </Flex>
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <>
                                                {formatDistanceToNowStrict(new Date(post.createdAt))} ago
                                            </>
                                        )
                                    }
                                </Box>
                            </Stack>
                        </Stack>
                        <Spacer />
                        <Text
                            textTransform={'uppercase'}
                            fontWeight={800}
                            fontSize={'sm'}
                            letterSpacing={1.1}
                            
                        >
                            <BiUpArrow /> {post.upCount}
                        </Text>
                    </Flex>
                    <Stack>
                        <Flex
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <Stack>
                                <h2 className='title-card'>
                                    <a>{post.title}</a>
                                </h2>
                                <Text
                                    color={'gray.700'}
                                >{wordCount} words. {minutesToRead} min read</Text>
                            </Stack>

                            {
                                admin && (
                                    <Link
                                        href={`/admin/${post.slug}`}
                                    >
                                        <Button
                                            bg={'blue.500'}
                                            color={'white'}
                                            rounded={'xl'}
                                            _hover={{
                                                bg: 'blue.700',
                                            }}
                                            _focus={{
                                                bg: 'blue.700',
                                            }}>
                                            Edit
                                        </Button>
                                    </Link>
                                )
                            }
                        </Flex>
                    </Stack>
                </Box>
            </Link>
        </Center>
    );
}

export default Feed;